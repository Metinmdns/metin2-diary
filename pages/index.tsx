// pages/index.tsx
import { useState } from "react";

export default function Home() {
  const [entry, setEntry] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!entry.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/metin2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      // API: pages/api/metin2.ts -> { reply: string }
      setResponse(typeof data.reply === "string" ? data.reply : "Cevap alınamadı.");
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
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 16 }}>🧠 Metin 2 – Yapay Günlük</h1>

      <textarea
        rows={8}
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Bugün ne hissettin / ne düşündün? Buraya yaz..."
        style={{
          width: "100%",
          fontSize: 16,
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ddd",
          outline: "none",
        }}
      />

      <div style={{ marginTop: 12 }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: 8,
            background: "#111827",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loading ? "Gönderiliyor..." : "Gönder"}
        </button>
      </div>

      {response && (
        <div
          style={{
            marginTop: 20,
            background: "#f3f4f6",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 16,
            whiteSpace: "pre-wrap",
          }}
        >
          <strong>Metin 2:</strong>
          <div style={{ marginTop: 8 }}>{response}</div>
        </div>
      )}
    </main>
  );
}
