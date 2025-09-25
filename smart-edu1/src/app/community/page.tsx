"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEnrollments } from "@/hooks/useEnrollments";

type Post = {
  id: string;
  userId: string;
  courseId?: string | null;
  title: string;
  body: string;
  tagsJson: string;
  upvotes: number;
  createdAt: string;
  user?: { id: string; name?: string | null; email?: string | null };
  answers?: (Answer & { user?: { id: string; name?: string | null; email?: string | null } })[];
};
type Answer = { id: string; postId: string; userId: string; body: string; upvotes: number; createdAt: string };

export default function CommunityPage() {
  const { status } = useSession();
  const router = useRouter();
  const { enrollments } = useEnrollments();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [courseId, setCourseId] = useState<string>("");
  const [answerFor, setAnswerFor] = useState<string | null>(null);
  const [answerBody, setAnswerBody] = useState("");
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const enrolledIds = useMemo(() => enrollments.map(e => e.courseId), [enrollments]);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      // randomize by one of the enrolled courses on each pull
      const pick = enrolledIds.length ? enrolledIds[Math.floor(Math.random() * enrolledIds.length)] : undefined;
      const url = new URL("/api/community/feed", window.location.origin);
      if (pick) url.searchParams.set("courseId", pick);
      const res = await fetch(url.toString(), { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setPosts(json.posts || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    // simple polling to simulate real-time updates
    pollRef.current = window.setInterval(fetchFeed, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrolledIds.join(",")]);

  async function submitPost() {
    if (!title.trim() || !body.trim()) return;
    try {
      const res = await fetch("/api/community/post", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), courseId: courseId || undefined }),
      });
      if (!res.ok) {
        const j = await res.json().catch(()=>({}));
        alert(`Failed to post: ${j?.error || res.status}`);
        return;
      }
      setTitle(""); setBody("");
      fetchFeed();
    } catch (e:any) {
      alert("Network error while posting. Please try again.");
    }
  }

  async function submitAnswer() {
    if (!answerFor || !answerBody.trim()) return;
    try {
      const res = await fetch("/api/community/answer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ postId: answerFor, body: answerBody.trim() }),
      });
      if (!res.ok) {
        const j = await res.json().catch(()=>({}));
        alert(`Failed to answer: ${j?.error || res.status}`);
        return;
      }
      setAnswerBody(""); setAnswerFor(null);
      fetchFeed();
    } catch {
      alert("Network error while answering. Please try again.");
    }
  }

  async function upvote(postId: string) {
    await fetch("/api/community/upvote", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ postId }) });
    fetchFeed();
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">Community Forum</h1>
      <p className="text-sm opacity-70">Ask questions, share knowledge, earn badges.</p>

      {/* Composer */}
      <div className="card mt-4 p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Question title" className="rounded-xl border border-white/20 bg-transparent px-3 py-2 outline-none md:col-span-2" />
          <select value={courseId} onChange={(e)=>setCourseId(e.target.value)} className="rounded-xl border border-white/20 bg-transparent px-3 py-2 outline-none">
            <option value="">General</option>
            {enrolledIds.map(id => (<option key={id} value={id}>{id}</option>))}
          </select>
          <button onClick={submitPost} className="btn-primary">Post</button>
        </div>
        <textarea value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Describe your question..." className="mt-3 w-full rounded-xl border border-white/20 bg-transparent px-3 py-2 outline-none" rows={3} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {loading && <div className="text-sm opacity-70">Loading...</div>}
          {!loading && posts.length === 0 && <div className="text-sm opacity-70">No posts yet. Ask the first question!</div>}
          {posts.map((p) => {
            const tags: string[] = (()=>{ try { return JSON.parse(p.tagsJson||"[]"); } catch { return []; } })();
            return (
              <div key={p.id} className="card p-4">
                <div className="mb-2 flex items-center gap-2 text-xs opacity-70">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-white">Q</span>
                  <span>{p.user?.name || p.user?.email || 'Anon'}</span>
                  <span>· {new Date(p.createdAt).toLocaleString()}</span>
                  <button onClick={()=> upvote(p.id)} className="ml-auto rounded-full border border-white/20 px-2 py-1">▲ {p.upvotes}</button>
                </div>
                <p className="font-medium">{p.title}</p>
                <div className="mt-1 text-sm opacity-80 whitespace-pre-wrap">{p.body}</div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  {p.courseId && <span className="rounded-full bg-white/10 px-2 py-0.5">{p.courseId}</span>}
                  {tags.slice(0,3).map(t => <span key={t} className="rounded-full bg-accent-orange/20 px-2 py-0.5 text-accent-orange">{t}</span>)}
                  <button onClick={()=> setAnswerFor(p.id)} className="ml-auto text-primary-600">Answer →</button>
                </div>
                {/* Answers */}
                {p.answers && p.answers.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {p.answers.map(a => (
                      <div key={a.id} className="rounded-xl border border-white/10 p-3 text-sm">
                        <div className="mb-1 text-xs opacity-70">{a.user?.name || a.user?.email || 'User'} replied</div>
                        <div>{a.body}</div>
                      </div>
                    ))}
                  </div>
                )}
                {answerFor === p.id && (
                  <div className="mt-3">
                    <textarea value={answerBody} onChange={(e)=>setAnswerBody(e.target.value)} className="w-full rounded-xl border border-white/20 bg-transparent px-3 py-2 outline-none" rows={2} placeholder="Write your answer..." />
                    <div className="mt-2 flex gap-2">
                      <button onClick={submitAnswer} className="btn-primary">Submit</button>
                      <button onClick={()=>{ setAnswerFor(null); setAnswerBody(""); }} className="rounded-xl border border-white/20 px-4 py-2">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <aside className="space-y-3">
          <div className="card p-4">
            <p className="mb-2 font-medium">Tips</p>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Be respectful and specific in your questions.</li>
              <li>Upvote helpful posts; first answer earns a badge.</li>
              <li>Feed rotates questions from your enrolled courses.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}


