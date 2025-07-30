import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LogInPage() {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (name.trim()) {
      setIsLoading(true)
      try {
        // Generate a unique UID based on the user's name
        const userUID = `user_${name.trim().toLowerCase().replace(/\s+/g, '_')}`

        // Submit user info to backend
        const response = await fetch('http://127.0.0.1:5000/submit_user_info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: userUID,
            name: name.trim(),
          }),
        })

        if (response.ok) {
          const userData = await response.json()

          // Store user data in localStorage
          localStorage.setItem('userUID', userData.uid)
          localStorage.setItem('userName', userData.name)
          localStorage.setItem('userRegion', userData.region)
          localStorage.setItem('userPoints', userData.points)
          localStorage.setItem('userStreak', userData.streak)
          localStorage.setItem('userLoggedIn', 'true')

          navigate('/topics')
        } else {
          alert('Failed to create user. Please try again.')
        }
      } catch (error) {
        console.error('Error creating user:', error)
        alert('Failed to create user. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else {
      alert('Please enter your name')
    }
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-box body-base"
          disabled={isLoading}
        />
        <br />
        <button
          type="submit"
          style={{
            marginTop: '2rem',
            padding: '0.5rem 1rem',
            fontSize: '1.5em',
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Creating User...' : 'Start Quiz'}
        </button>
      </form>
    </div>
  )
}

export default LogInPage
