import FloatingChatbot from "@/components/FloatingChatbot";

export default function TutorPage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">AI Tutor</h1>
      <p className="opacity-70">Ask any question below using the floating assistant.</p>
      <FloatingChatbot />
    </div>
  );
}


