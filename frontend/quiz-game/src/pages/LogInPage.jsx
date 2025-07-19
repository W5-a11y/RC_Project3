import { useState } from "react"
import { useNavigate } from "react-router-dom"

function LogInPage() {
  const [name, setName] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      navigate("/topics")
    } else {
      alert("Please enter your name")
    }
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem", width: "200px" }}
        />
        <br />
        <button type="submit" style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
          Start Quiz
        </button>
      </form>
    </div>
  )
}

export default LogInPage
