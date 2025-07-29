import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ShareButtonIcon from '../assets/ShareButton.svg?react'

function ResultPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const score = location.state?.score ?? 0
  const total = location.state?.total ?? 0
  const [copied, setCopied] = useState(false)
  const [scoreSubmitted, setScoreSubmitted] = useState(false)
  const [alreadyPlayed, setAlreadyPlayed] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch user stats if no score data is available (redirected from homepage)
  useEffect(() => {
    const fetchUserStats = async () => {
      const userUID = localStorage.getItem('userUID')
      if (!userUID || (score === 0 && total === 0)) {
        setLoading(true)
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/user-stats?uid=${userUID}`
          )
          if (response.ok) {
            const data = await response.json()
            // Get the most recent quiz score
            if (data.quiz_history && data.quiz_history.length > 0) {
              const latestQuiz = data.quiz_history[0]
              // Update the score and total for display
              location.state = { score: latestQuiz.score, total: 500 }
              setAlreadyPlayed(true)
            }
          }
        } catch (error) {
          console.error('Error fetching user stats:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUserStats()
  }, [score, total, location])

  // Submit score to backend when component loads
  useEffect(() => {
    const submitScore = async () => {
      const userUID = localStorage.getItem('userUID')
      if (userUID && !scoreSubmitted && score > 0) {
        try {
          const response = await fetch('http://127.0.0.1:5000/update-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: userUID,
              score: score,
            }),
          })

          if (response.ok) {
            const result = await response.json()
            // Update localStorage with new user data
            localStorage.setItem('userPoints', result.total_points)
            localStorage.setItem('userStreak', result.streak)
            setScoreSubmitted(true)
            console.log('Score submitted successfully:', result)
          } else {
            console.error('Failed to submit score')
          }
        } catch (error) {
          console.error('Error submitting score:', error)
        }
      }
    }

    submitScore()
  }, [score, scoreSubmitted])

  const handleShare = () => {
    const text = `I scored ${score} out of ${total}!`
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => setCopied(true))
        .catch((err) => console.error('Copy failed', err))
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
      } catch (err) {
        console.error('Copy failed', err)
      }
      document.body.removeChild(textarea)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading your stats...</h2>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        padding: '2rem',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <h2>
        {'Your score is'} {score} out of {total}
      </h2>

      {alreadyPlayed ? (
        <h3 style={{ color: '#432818' }}>
          {' '}
          You've already completed today's quiz! Come back tomorrow for a new
          challenge.{' '}
        </h3>
      ) : (
        scoreSubmitted && (
          <p style={{ color: 'green', marginTop: '1rem' }}>
            Score saved to your profile!
          </p>
        )
      )}

      {/* Bottom button row */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
        }}
      >
        <button
          onClick={handleShare}
          style={{
            padding: '0.5rem 1rem',
            display: 'inline-flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <ShareButtonIcon
            style={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }}
          />
          {copied ? 'Copied!' : 'Share'}
        </button>

        <button onClick={() => navigate('/')}>← Back to Home</button>

        <button onClick={() => navigate('/store')}>Go to Store</button>
      </div>
    </div>
  )
}

export default ResultPage
