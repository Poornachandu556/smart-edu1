"use client";

import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

type SettingsState = {
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  language: string;
  learningPace: "relaxed" | "standard" | "intense";
};

const STORAGE_KEY = "smartedu:userSettings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Load settings on first render
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SettingsState;
        setSettings(parsed);
      } else {
        setSettings({
          emailNotificationsEnabled: true,
          pushNotificationsEnabled: false,
          language: "en",
          learningPace: "standard",
        });
      }
    } catch {
      setSettings({
        emailNotificationsEnabled: true,
        pushNotificationsEnabled: false,
        language: "en",
        learningPace: "standard",
      });
    }
  }, []);

  const canSave = useMemo(() => settings !== null, [settings]);

  function update<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function saveSettings() {
    if (!settings) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2000);
  }

  return (
    <div className="container-px mx-auto py-10">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-4 opacity-80">Update your preferences here.</p>

      {/* Theme */}
      <section className="mt-8 rounded-lg border border-white/10 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium">Theme</h2>
            <p className="text-sm opacity-70">Toggle light and dark mode.</p>
          </div>
          <ThemeToggle />
        </div>
      </section>

      {/* Notifications */}
      <section className="mt-6 rounded-lg border border-white/10 p-5">
        <h2 className="text-lg font-medium">Notifications</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={!!settings?.emailNotificationsEnabled}
              onChange={(e) => update("emailNotificationsEnabled", e.target.checked)}
            />
            <span>Email notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={!!settings?.pushNotificationsEnabled}
              onChange={(e) => update("pushNotificationsEnabled", e.target.checked)}
            />
            <span>Push notifications</span>
          </label>
        </div>
      </section>

      {/* Preferences */}
      <section className="mt-6 rounded-lg border border-white/10 p-5">
        <h2 className="text-lg font-medium">Preferences</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="language" className="text-sm opacity-80">Language</label>
            <select
              id="language"
              className="rounded-md border border-white/10 bg-transparent px-3 py-2"
              value={settings?.language ?? "en"}
              onChange={(e) => update("language", e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="pace" className="text-sm opacity-80">Learning pace</label>
            <select
              id="pace"
              className="rounded-md border border-white/10 bg-transparent px-3 py-2"
              value={settings?.learningPace ?? "standard"}
              onChange={(e) => update("learningPace", e.target.value as SettingsState["learningPace"])}
            >
              <option value="relaxed">Relaxed</option>
              <option value="standard">Standard</option>
              <option value="intense">Intense</option>
            </select>
          </div>
        </div>
      </section>

      <div className="mt-8 flex items-center gap-3">
        <button
          disabled={!canSave}
          onClick={saveSettings}
          className="rounded-md bg-white/90 px-4 py-2 font-medium text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
        >
          Save changes
        </button>
        {savedAt && (
          <span className="text-sm opacity-80">Saved.</span>
        )}
      </div>
    </div>
  );
}


