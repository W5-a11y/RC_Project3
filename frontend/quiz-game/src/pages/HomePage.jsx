import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import StoreIcon from '../assets/store.svg?react'
import CreditsIcon from '../assets/credits.svg?react'

function HomePage() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user exists in backend database
  useEffect(() => {
    const checkUserLogin = async () => {
      const userUID = localStorage.getItem('userUID')
      if (userUID) {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/check-user?uid=${userUID}`
          )
          if (response.ok) {
            const userData = await response.json()
            // Update localStorage with latest user data from backend
            localStorage.setItem('userName', userData.name)
            localStorage.setItem('userRegion', userData.region)
            localStorage.setItem('userPoints', userData.points)
            localStorage.setItem('userStreak', userData.streak)
            localStorage.setItem('userLoggedIn', 'true')
            setIsLoggedIn(true)
          } else {
            // User doesn't exist in backend, clear localStorage
            console.log('User not found in backend, clearing localStorage')
            localStorage.clear()
            setIsLoggedIn(false)
          }
        } catch (error) {
          console.error('Error checking user:', error)
          // On error, assume not logged in and clear localStorage
          localStorage.clear()
          setIsLoggedIn(false)
        }
      } else {
        setIsLoggedIn(false)
      }
      setIsLoading(false)
    }

    checkUserLogin()
  }, [navigate])

  const handlePlayClick = async () => {
    if (isLoggedIn) {
      const userUID = localStorage.getItem('userUID')
      if (userUID) {
        try {
          // Check if user has completed today's quiz
          const quizResponse = await fetch(
            `http://127.0.0.1:5000/check-today-quiz?uid=${userUID}`
          )
          if (quizResponse.ok) {
            const quizData = await quizResponse.json()
            if (quizData.completed) {
              // User has completed today's quiz, redirect to stats
              navigate('/result')
              return
            }
          }
          // User hasn't completed today's quiz, go to topics
          navigate('/topics')
        } catch (error) {
          console.error('Error checking quiz completion:', error)
          // On error, go to topics
          navigate('/topics')
        }
      } else {
        navigate('/topics')
      }
    } else {
      navigate('/login')
    }
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
    )
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Main Centered Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: '2em',
        }}
      >
        <h1>Welcome to the Quiz Game</h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            justifyContent: 'center',
            maxWidth: '600px',
            marginTop: '-1em',
          }}
        >
          <div className="body-base">
            <p>
              Spin the wheel to decide the topic of today's 5 questions. <br />
              Each question must be answered correctly within 30 seconds. <br />
              Points will be awarded based on accuracy and speed. <br /> <br />
              Good Luck!
            </p>
          </div>
        </div>

        <button onClick={handlePlayClick}>Play Game</button>
      </div>

      {/* Bottom Buttons with Icons */}
      <div className="bottom-container">
        <button onClick={() => navigate('/credits')} className="icon-button">
          <CreditsIcon />
        </button>

        <button onClick={() => navigate('/store')} className="icon-button">
          <StoreIcon />
        </button>
      </div>
    </div>
  )
}

export default HomePage
