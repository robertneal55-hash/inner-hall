"use client";

interface JournalSpaceProps {
  onBack: () => void;
}

export default function JournalSpace({ onBack }: JournalSpaceProps) {
}

  return (
    <div style={{ padding: 24 }}>
      <h1>Listening Chamber</h1>
      <p>This is a placeholder component so the build can compile.</p>
      <button onClick={() => onExit?.()} style={{ marginTop: 12 }}>
        Back
      </button>
    </div>
  );
}
