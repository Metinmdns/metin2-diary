// pages/index.tsx
import { useState } from "react";

export default function Home() {
  const [entry, setEntry] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entry }),
      });

      const data = await res.json();
      setResponse(data.result || "Cevap alınamadı.");
    } catch (err) {
      if (err instanceof Error) {
        setResponse("Hata oluştu: " + err.message);
      } else {
        setResponse("Bilinmeyen bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🧠 Yapay Zekâ Günlüğü</h1>
      <textarea
        rows={10}
        cols={60}
        placeholder="Bugün ne hissettin, ne düşündün?"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        style={{ marginBottom: "1rem", padding: "1rem", fontSize: "1rem" }}
      />
      <br />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        {loading ? "Yükleniyor..." : "Gönder"}
      </button>
      <div style={{ marginTop: "2rem", whiteSpace: "pre-wrap" }}>
        {response}
      </div>
    </main>
  );
}
