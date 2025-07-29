import { useState } from "react"
import { useNavigate } from "react-router-dom"

function LogInPage() {
  const [name, setName] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
      e.preventDefault()
      if (!name.trim()) {
        alert("Please enter your name")
        return
      }

      const uid = crypto.randomUUID()
      const region = "HK" // default region HK

      // Save locally
      localStorage.setItem("username", name)
      localStorage.setItem("uid", uid)
      localStorage.setItem("region", region)

      try {
        console.log("Submitting:", { uid, username: name, region });
        const response = await fetch("/submit_user_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          username: name,
          region,
          userLoggedIn: true
        })      
        });
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error("Failed to save user info")
        }

        const data = await response.json()
        console.log("User saved:", data)

        navigate("/topics")
      } catch (err) {
        console.error("Error submitting user:", err)
        alert("Failed to submit user info")
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