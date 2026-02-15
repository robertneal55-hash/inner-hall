"use client";

type Props = {
  onBack: () => void;
}

export default function ListeningChamber({ onBack }: Props) {
 return (
    <div style={{ padding: 24 }}>
      <h1>Listening Chamber</h1>
      <p>This is a placeholder component so the build can compile.</p>
    <button onClick={onBack} style={{ marginTop: 12 }}>
  Back
</button>
    </div>
  );
}
