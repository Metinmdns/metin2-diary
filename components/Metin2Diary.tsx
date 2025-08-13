import { useState } from "react";

export default function Metin2Diary() {
  const [entry, setEntry] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResponse("");

    const res = await fetch("/api/metin2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entry }),
    });

    const data = await res.json();
    setResponse(data.reply);
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center">Metin 2 - Yapay Günlük</h1>
      <textarea
        rows={6}
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        className="w-full border p-2"
      />
      <button onClick={handleSubmit} disabled={loading || !entry} className="bg-black text-white px-4 py-2">
        Gönder
      </button>
      {loading && <p className="text-center">Metin 2 düşünüyor...</p>}
      {response && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold">Metin 2:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}