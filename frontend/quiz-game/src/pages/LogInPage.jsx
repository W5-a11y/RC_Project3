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
    <div style={{ padding: "2rem", textAlign: "center"}}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-box body-base"
        />
        <br />
        <button type="submit" style={{ marginTop: "2rem", padding: "0.5rem 1rem", fontSize: '1.5em' }}>
          Start Quiz
        </button>
      </form>
    </div>
  )
}

export default LogInPage
