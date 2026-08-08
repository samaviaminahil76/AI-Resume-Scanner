"use client";

import { useRef, useState } from "react";

const BG_ICONS = [
  { icon: "📚", top: "6%", left: "6%", size: 30, delay: 0, duration: 8 },
  { icon: "✏️", top: "14%", left: "88%", size: 24, delay: 0.6, duration: 7 },
  { icon: "🎓", top: "28%", left: "3%", size: 34, delay: 1.2, duration: 9 },
  { icon: "🔬", top: "22%", left: "80%", size: 26, delay: 1.8, duration: 6.5 },
  { icon: "📐", top: "40%", left: "92%", size: 24, delay: 0.3, duration: 8.5 },
  { icon: "🧠", top: "48%", left: "5%", size: 30, delay: 2.4, duration: 7.5 },
  { icon: "💡", top: "58%", left: "85%", size: 26, delay: 1, duration: 9.5 },
  { icon: "📊", top: "66%", left: "9%", size: 28, delay: 3, duration: 8 },
  { icon: "🖊️", top: "74%", left: "90%", size: 22, delay: 0.9, duration: 6 },
  { icon: "🌟", top: "82%", left: "4%", size: 24, delay: 1.6, duration: 7 },
  { icon: "📝", top: "88%", left: "78%", size: 26, delay: 2.1, duration: 8.5 },
  { icon: "⏰", top: "36%", left: "15%", size: 22, delay: 2.8, duration: 6.8 },
  { icon: "🧮", top: "52%", left: "70%", size: 22, delay: 0.4, duration: 9 },
  { icon: "📌", top: "94%", left: "40%", size: 20, delay: 1.4, duration: 7.2 },
];

export default function Home() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const pageRef = useRef(null);
  const uploadCardRef = useRef(null);
  const askCardRef = useRef(null);

  // Nudges the ambient background icons opposite the cursor for a
  // light parallax feel across the whole page.
  const handlePageMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setParallax({ x, y });
  };

  // Subtle "hold it in your hand" tilt — tracks the cursor and
  // rotates the card toward it, like tipping an index card to read it.
  const handleTilt = (e, ref) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -6;
    const rotateY = ((x - rect.width / 2) / rect.width) * 6;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-14px)`;
  };

  const resetTilt = (ref) => {
    if (ref.current) {
      ref.current.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    }
  };

  const liftCard = (ref) => {
    if (ref.current) ref.current.classList.add("card-lit");
  };

  const dropCard = (ref) => {
    if (ref.current) ref.current.classList.remove("card-lit");
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed");
      }

      setUploaded(true);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      setAnswer("");
      setSources([]);

      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (error) {
      setAnswer("Something went wrong: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page" onMouseMove={handlePageMove} ref={pageRef}>
      <div className="ink-wash ink-wash-a" />
      <div className="ink-wash ink-wash-b" />

      <div
        className="bg-icons"
        style={{
          transform: `translate(${parallax.x * -12}px, ${parallax.y * -12}px)`,
        }}
      >
        {BG_ICONS.map((b, i) => (
          <span
            key={i}
            className="bg-icon"
            style={{
              top: b.top,
              left: b.left,
              fontSize: b.size,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
            }}
          >
            {b.icon}
          </span>
        ))}
      </div>

      <nav className="navbar fade-up">
        <div className="brand">
          <div className="seal">✦</div>
          <div>
            <h2>StudyAI</h2>
            <span>Your AI Study Companion</span>
          </div>
        </div>

        <div className="status">
          <span className="status-dot" />
          Assistant awake
        </div>
      </nav>

      <section className="hero fade-up" style={{ animationDelay: "0.05s" }}>
        <span className="float-icon icon-a">📚</span>
        <span className="float-icon icon-b">🖋️</span>
        <span className="float-icon icon-c">🎓</span>
        <span className="float-icon icon-d">📖</span>
        <span className="float-icon icon-e">✏️</span>

        <div className="hero-badge">the desk, digitized</div>

        <h1>
          Study smarter.
          <br />
          <span className="animated-text">Ask anything.</span>
        </h1>

        <p>
          Drop in your notes, and the assistant reads between every
          line — surfacing answers and the exact passages they came
          from.
        </p>
      </section>

      <section className="workspace">
        {/* Upload — Card 01 */}
        <div
          ref={uploadCardRef}
          className="card glass-card float-card fade-up"
          style={{ animationDelay: "0.15s" }}
          onMouseMove={(e) => handleTilt(e, uploadCardRef)}
          onMouseEnter={() => liftCard(uploadCardRef)}
          onMouseLeave={() => {
            resetTilt(uploadCardRef);
            dropCard(uploadCardRef);
          }}
        >
          <div className="card-sheen shimmer" />
          <div className="card-header">
            <div>
              <span className="tab">Chapter 01</span>
              <h3>Upload your document</h3>
            </div>
            <span className="wax-seal">📄</span>
          </div>

          <label className="upload-box">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <div className="upload-icon">↑</div>

            <strong>{file ? file.name : "Drop your PDF here"}</strong>

            <span>
              {file ? "Ready to upload" : "or click to browse your files"}
            </span>
          </label>

          <button
            className="glow-button primary-button"
            onClick={uploadFile}
            disabled={loading}
          >
            {loading ? "Uploading…" : "Upload document →"}
          </button>

          {uploaded && (
            <div className="success fade-up">
              <span>✓</span>
              Filed and indexed
            </div>
          )}
        </div>

        {/* Question — Card 02 */}
        <div
          ref={askCardRef}
          className="card glass-card float-card fade-up"
          style={{ animationDelay: "0.25s" }}
          onMouseMove={(e) => handleTilt(e, askCardRef)}
          onMouseEnter={() => liftCard(askCardRef)}
          onMouseLeave={() => {
            resetTilt(askCardRef);
            dropCard(askCardRef);
          }}
        >
          <div className="card-sheen shimmer" />
          <div className="card-header">
            <div>
              <span className="tab">Chapter 02</span>
              <h3>Ask your document</h3>
            </div>
            <span className="wax-seal">💬</span>
          </div>

          <textarea
            className="premium-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to know?"
          />

          <button
            className="glow-button primary-button"
            onClick={askQuestion}
            disabled={loading}
          >
            {loading ? (
              <span className="thinking">
                Thinking
                <span className="ai-dot" />
                <span className="ai-dot" />
                <span className="ai-dot" />
              </span>
            ) : (
              "Ask AI ✦"
            )}
          </button>
        </div>
      </section>

      {/* Answer */}
      {answer && (
        <section className="answer-section glass-card fade-up">
          <div className="answer-header">
            <div className="ai-avatar">✦</div>
            <div>
              <span>AI STUDY ASSISTANT</span>
              <h3>Here&apos;s what I found</h3>
            </div>
          </div>

          <div className="answer-text">{answer}</div>
        </section>
      )}

      {/* Sources */}
      {sources.length > 0 && (
        <section className="sources-section fade-up">
          <div className="sources-header">
            <div>
              <span className="tab">Marginalia</span>
              <h3>Retrieved passages</h3>
            </div>

            <span className="source-count">{sources.length} sources</span>
          </div>

          <div className="sources-grid">
            {sources.map((source, index) => (
              <div
                className="source-card"
                key={index}
                style={{
                  transform: `rotate(${index % 2 === 0 ? "-0.6deg" : "0.6deg"})`,
                }}
              >
                <div className="source-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <p>{source}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="fade-up">
        Built with Python · FastAPI · Qdrant · Sentence Transformers · Gemini
      </footer>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding-bottom: 90px;
          position: relative;
          overflow: hidden;
        }

        .bg-icons {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          transition: transform 0.4s ease-out;
        }

        .bg-icon {
          position: absolute;
          opacity: 0.16;
          filter: drop-shadow(0 4px 10px rgba(178, 34, 34, 0.15));
          animation: bgDrift ease-in-out infinite;
        }

        @keyframes bgDrift {
          0%,
          100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-22px) rotate(8deg) scale(1.08);
          }
        }

        @media (max-width: 750px) {
          .bg-icons {
            opacity: 0.6;
          }

          .bg-icon {
            font-size: 18px !important;
          }
        }

        .ink-wash {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }

        .ink-wash-a {
          width: 620px;
          height: 460px;
          top: -220px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(118, 43, 67, 0.16);
        }

        .ink-wash-b {
          width: 380px;
          height: 380px;
          top: 420px;
          right: -140px;
          background: rgba(196, 154, 99, 0.14);
        }

        .navbar {
          max-width: 1120px;
          margin: auto;
          padding: 28px 25px 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .seal {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, var(--maroon), var(--burgundy));
          color: var(--cream);
          font-size: 21px;
          box-shadow: 0 8px 20px rgba(84, 24, 44, 0.25);
        }

        .brand h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 19px;
          color: var(--maroon-dark);
          letter-spacing: -0.3px;
        }

        .brand span {
          color: var(--muted);
          font-size: 12px;
        }

        .status {
          border: 1px solid var(--border);
          background: var(--cream);
          padding: 8px 14px;
          border-radius: 30px;
          font-size: 13px;
          color: var(--muted);
        }

        .status-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--gold);
          margin-right: 7px;
          box-shadow: 0 0 8px rgba(196, 154, 99, 0.8);
        }

        .hero {
          max-width: 800px;
          margin: 70px auto 55px;
          text-align: center;
          padding: 0 20px;
          position: relative;
          z-index: 1;
        }

        .float-icon {
          position: absolute;
          font-size: 26px;
          opacity: 0.55;
          filter: drop-shadow(0 6px 12px rgba(178, 34, 34, 0.25));
          animation: iconDrift 5.5s ease-in-out infinite;
          pointer-events: none;
        }

        .icon-a {
          top: -6px;
          left: -3%;
          font-size: 30px;
          animation-delay: 0s;
        }

        .icon-b {
          top: 55px;
          right: -4%;
          animation-delay: 0.8s;
        }

        .icon-c {
          bottom: -10px;
          left: 2%;
          font-size: 24px;
          animation-delay: 1.6s;
        }

        .icon-d {
          top: -30px;
          right: 10%;
          font-size: 28px;
          animation-delay: 2.3s;
        }

        .icon-e {
          bottom: 0px;
          right: -6%;
          font-size: 22px;
          animation-delay: 3.1s;
        }

        @keyframes iconDrift {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-14px) rotate(-6deg);
          }
        }

        @media (max-width: 750px) {
          .float-icon {
            display: none;
          }
        }

        .hero-badge {
          display: inline-block;
          padding: 7px 16px;
          border-radius: 30px;
          background: rgba(196, 154, 99, 0.14);
          border: 1px solid rgba(196, 154, 99, 0.4);
          color: var(--maroon);
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 26px;
        }

        .hero h1 {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(42px, 6.8vw, 72px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -1.8px;
          margin: 0;
          color: var(--maroon-dark);
        }

        .animated-text {
          background: linear-gradient(
            100deg,
            #7a1414,
            #c0392b,
            #e05252,
            #c49a63,
            #7a1414
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradientDrift 6s linear infinite;
        }

        @keyframes gradientDrift {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 300% 50%;
          }
        }

        .hero p {
          max-width: 560px;
          margin: 24px auto 0;
          color: var(--muted);
          font-size: 16px;
          line-height: 1.7;
        }

        .workspace {
          max-width: 1120px;
          margin: auto;
          padding: 0 25px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 26px;
          position: relative;
          z-index: 1;
        }

        .card {
          padding: 26px;
          position: relative;
          transition: transform 0.2s ease-out, box-shadow 0.35s ease;
          will-change: transform, box-shadow;
        }

        .card.card-lit {
          box-shadow:
            0 30px 60px rgba(122, 20, 20, 0.3),
            0 0 45px rgba(192, 57, 43, 0.3),
            0 0 0 1px rgba(192, 57, 43, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.7);
        }

        .card-sheen {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          pointer-events: none;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .tab {
          display: inline-block;
          color: var(--gold);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .card h3 {
          margin: 6px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 19px;
          color: var(--maroon-dark);
        }

        .wax-seal {
          font-size: 22px;
          filter: drop-shadow(0 2px 4px rgba(84, 24, 44, 0.15));
        }

        .upload-box {
          height: 180px;
          border: 1.5px dashed rgba(84, 24, 44, 0.25);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: rgba(255, 250, 244, 0.5);
          transition: 0.2s;
        }

        .upload-box:hover {
          border-color: var(--burgundy);
          background: rgba(255, 250, 244, 0.85);
        }

        .upload-box input {
          display: none;
        }

        .upload-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(118, 43, 67, 0.1);
          display: grid;
          place-items: center;
          color: var(--burgundy);
          font-size: 23px;
          margin-bottom: 12px;
        }

        .upload-box strong {
          font-size: 14px;
          color: var(--foreground);
        }

        .upload-box span {
          color: var(--muted);
          font-size: 12px;
          margin-top: 6px;
        }

        .card :global(textarea) {
          width: 100%;
          height: 180px;
          resize: none;
          padding: 16px;
          font-size: 15px;
          font-family: inherit;
        }

        .card :global(textarea::placeholder) {
          color: var(--muted);
          opacity: 0.7;
        }

        .primary-button {
          width: 100%;
          margin-top: 15px;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
        }

        .primary-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .thinking {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .success {
          margin-top: 14px;
          color: var(--burgundy);
          font-size: 13px;
          text-align: center;
        }

        .answer-section,
        .sources-section {
          max-width: 1070px;
          margin: 26px auto 0;
          padding: 30px;
          position: relative;
          z-index: 1;
        }

        .answer-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .ai-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, var(--maroon), var(--burgundy));
          color: var(--cream);
        }

        .answer-header span {
          color: var(--gold);
          font-size: 10.5px;
          letter-spacing: 1.4px;
        }

        .answer-header h3 {
          margin: 4px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          color: var(--maroon-dark);
        }

        .answer-text {
          color: var(--foreground);
          line-height: 1.85;
          white-space: pre-wrap;
          font-size: 15.5px;
          padding-left: 16px;
          border-left: 3px solid rgba(196, 154, 99, 0.5);
        }

        .sources-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .sources-header h3 {
          margin: 5px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          color: var(--maroon-dark);
        }

        .source-count {
          font-size: 12px;
          color: var(--muted);
        }

        .sources-grid {
          display: grid;
          gap: 12px;
        }

        .source-card {
          display: flex;
          gap: 15px;
          padding: 16px 18px;
          background: rgba(255, 250, 244, 0.75);
          border: 1px solid var(--border);
          border-radius: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .source-card:hover {
          transform: rotate(0deg) translateY(-3px) !important;
          box-shadow: 0 12px 24px rgba(84, 24, 44, 0.1);
        }

        .source-number {
          color: var(--gold);
          font-weight: 700;
          font-size: 12px;
          font-family: Georgia, serif;
        }

        .source-card p {
          margin: 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
        }

        footer {
          text-align: center;
          color: var(--muted);
          font-size: 12px;
          margin-top: 60px;
          opacity: 0.7;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 750px) {
          .workspace {
            grid-template-columns: 1fr;
          }

          .hero {
            margin-top: 45px;
          }

          .navbar {
            padding: 20px;
          }

          .status {
            display: none;
          }

          .card:hover {
            transform: none !important;
          }
        }
      `}</style>
    </main>
  );
}