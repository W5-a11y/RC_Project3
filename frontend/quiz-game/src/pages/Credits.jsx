import { useNavigate } from "react-router-dom"

function CreditsPage() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Credits</h1>
      <p>🎮 Quiz Game created by:</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>Samantha Siew – UI/UX Developer & Designer</li>
        <li>Celia Wang – Database & API</li>
        <li>Sarayu Mummidi – LLM Quiz Generator </li>
        <li>Jacob Lawson – Gamification</li>
      </ul>
      <button onClick={() => navigate("/")}>← Back to Home</button>
    </div>
  )
}

export default CreditsPage
