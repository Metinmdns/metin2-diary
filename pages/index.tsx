import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
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
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Yapay Zeka Günlüğü</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          cols={50}
          placeholder="Bugün ne yaşadın, ne düşündün?"
          style={{ width: "100%", padding: "1rem" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1.5rem",
            cursor: "pointer",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {loading ? "Yükleniyor..." : "Gönder"}
        </button>
      </form>
      <div>
        <strong>Yanıt:</strong>
        <p>{response}</p>
      </div>
    </div>
  );
}
