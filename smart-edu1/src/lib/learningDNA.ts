export type VARK = {
  visual: number;
  auditory: number;
  reading: number;
  kinesthetic: number;
};

const STORAGE_KEY = "smartedu:dna";

export function clamp(val: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, val));
}

export function loadDNA(): VARK {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<VARK>;
      return normalize({
        visual: parsed.visual ?? 60,
        auditory: parsed.auditory ?? 30,
        reading: parsed.reading ?? 40,
        kinesthetic: parsed.kinesthetic ?? 30,
      });
    }
  } catch {}
  return normalize({ visual: 60, auditory: 30, reading: 40, kinesthetic: 30 });
}

export function saveDNA(dna: VARK) {
  const normalized = normalize(dna);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

// Ensure values are within 0..100 and sum to at most 100 by proportional scaling
export function normalize(dna: VARK): VARK {
  const v = clamp(Math.round(dna.visual));
  const a = clamp(Math.round(dna.auditory));
  const r = clamp(Math.round(dna.reading));
  const k = clamp(Math.round(dna.kinesthetic));
  const sum = v + a + r + k;
  if (sum <= 100) return { visual: v, auditory: a, reading: r, kinesthetic: k };
  // scale down proportionally to sum 100
  const scale = 100 / sum;
  return {
    visual: Math.round(v * scale),
    auditory: Math.round(a * scale),
    reading: Math.round(r * scale),
    kinesthetic: Math.round(k * scale),
  };
}

export type ActivityType =
  | "visual"
  | "auditory"
  | "reading"
  | "kinesthetic"
  | "study_session"
  | "diagram_view"
  | "video_watch"
  | "podcast_listen"
  | "code_run";

/**
 * Update DNA weights from a user activity event.
 * Small EMA-like nudges with proportional decay to keep values bounded.
 */
export function updateDNAFromActivity(activity: ActivityType, weight = 1) {
  const dna = loadDNA();
  // base nudge size; weight can be duration or intensity factor
  const nudge = Math.max(0.5, Math.min(5, weight)) * 1.0; // 0.5 .. 5 pts

  // Apply slight decay to others so the total remains meaningful
  const decay = (val: number, d = 0.25) => val * (1 - d / 100);

  let next: VARK = { ...dna };

  switch (activity) {
    case "visual":
    case "diagram_view":
      next.visual += nudge;
      next.auditory = decay(next.auditory);
      next.reading = decay(next.reading);
      next.kinesthetic = decay(next.kinesthetic);
      break;
    case "auditory":
    case "podcast_listen":
      next.auditory += nudge;
      next.visual = decay(next.visual);
      next.reading = decay(next.reading);
      next.kinesthetic = decay(next.kinesthetic);
      break;
    case "reading":
      next.reading += nudge;
      next.visual = decay(next.visual);
      next.auditory = decay(next.auditory);
      next.kinesthetic = decay(next.kinesthetic);
      break;
    case "kinesthetic":
    case "code_run":
      next.kinesthetic += nudge;
      next.visual = decay(next.visual);
      next.auditory = decay(next.auditory);
      next.reading = decay(next.reading);
      break;
    case "study_session":
      // generic session: small balanced nudge, slightly favor reading & kinesthetic
      next.reading += nudge * 0.6;
      next.kinesthetic += nudge * 0.6;
      next.visual += nudge * 0.3;
      next.auditory += nudge * 0.3;
      break;
  }

  saveDNA(next);
}

export function resetDNA() {
  saveDNA({ visual: 60, auditory: 30, reading: 40, kinesthetic: 30 });
}

export function getSuggestion(dna: VARK): string {
  const entries: Array<[keyof VARK, number]> = [
    ["visual", dna.visual],
    ["auditory", dna.auditory],
    ["reading", dna.reading],
    ["kinesthetic", dna.kinesthetic],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  const [top, val] = entries[0];
  const pct = Math.round(val);
  switch (top) {
    case "visual":
      return `Prefer visuals (${pct}%): diagrams, charts, short videos.`;
    case "auditory":
      return `Prefer auditory (${pct}%): lectures, podcasts, explanations.`;
    case "reading":
      return `Prefer reading (${pct}%): notes, articles, step-by-step guides.`;
    case "kinesthetic":
      return `Prefer hands-on (${pct}%): coding exercises, labs, projects.`;
  }
}
