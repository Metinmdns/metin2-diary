import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/metin2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setResponse(data.result || "Cevap alınamadı.");
    } catch (err) {
  if (err instanceof Error) {
    setResponse("Hata oluştu: " + err.message);
  } else {
    setResponse("Bilinmeyen bir hata oluştu.");
  }
}
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20, fontFamily: "Arial" }}>
      <h1>Metin 2 - Yapay Günlük</h1>
      <textarea
        rows={6}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", padding: 10, fontSize: 16 }}
        placeholder="Bugün nasıldın?"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: 10, padding: "10px 20px", fontSize: 16 }}
      >
        {loading ? "Gönderiliyor..." : "Gönder"}
      </button>

      {response && (
        <div style={{ marginTop: 20, background: "#f3f3f3", padding: 15, borderRadius: 8 }}>
          <strong>Metin 2'nin yanıtı:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
