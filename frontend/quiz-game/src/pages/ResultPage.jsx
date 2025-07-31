import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ShareButtonIcon from '../assets/ShareButton.svg?react'
import StoreIcon from '../assets/store.svg?react'
import '../index.css'

function ResultPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const score = location.state?.score ?? 0
  const total = location.state?.total ?? 0
  const [copied, setCopied] = useState(false)
  const [scoreSubmitted, setScoreSubmitted] = useState(false)
  const [alreadyPlayed, setAlreadyPlayed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)

  // Calculate credits for display (but use backend value for actual credits)
  const credits = total > 0 ? Math.round(10 + (score / total) * 90) : 10

  // Fetch leaderboard data from backend
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLeaderboardLoading(true)
      try {
        const response = await fetch('http://127.0.0.1:5000/api/leaderboard')
        if (response.ok) {
          const data = await response.json()
          setLeaderboard(data.leaderboard || [])
        } else {
          console.error('Failed to fetch leaderboard')
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLeaderboardLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  // Add current user to leaderboard if they have a score and aren't already in it
  const currentUser = localStorage.getItem('userName')
  const userAlreadyInLeaderboard = leaderboard.some(
    (entry) => entry.name === currentUser
  )

  const fullLeaderboard =
    score > 0 && !userAlreadyInLeaderboard
      ? [...leaderboard, { name: currentUser || 'You', points: score }]
          .sort((a, b) => b.points - a.points)
          .slice(0, 5)
      : leaderboard.slice(0, 5)

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
            if (data.quiz_history && data.quiz_history.length > 0) {
              const latestQuiz = data.quiz_history[0]
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

  useEffect(() => {
    const submitScore = async () => {
      const userUID = localStorage.getItem('userUID')
      if (userUID && !scoreSubmitted && score > 0) {
        try {
          const response = await fetch('http://127.0.0.1:5000/update-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: userUID, score }),
          })

          if (response.ok) {
            const result = await response.json()
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
        .then(() => {
          setCopied(true), setTimeout(() => setCopied(false), 1500)
        })
        .catch((err) => console.error('Copy failed', err))
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      try {
        alert('Clipboard API not supported. Please copy manually: ' + text)
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
      className="quiz-container"
      style={{
        position: 'relative',
        height: '100vh',
        padding: '2rem',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <h1 className="h2" style={{ marginTop: '1rem', fontSize: '40px' }}>
        Score: {score}/{total}
      </h1>

      {alreadyPlayed ? (
        <h3
          className="caption"
          style={{ marginTop: '1rem', marginBottom: '-3rem' }}
        >
          You've already completed today's quiz! Come back tomorrow for a new
          challenge.
        </h3>
      ) : (
        scoreSubmitted && (
          <p style={{ color: '#606c38', marginTop: '1rem' }}>
            Score saved to your profile!
          </p>
        )
      )}

      {/* Leaderboard */}
      <div
        style={{
          margin: '4rem auto .5rem auto',
          maxWidth: '400px',
          fontSize: '1.25rem',
        }}
      >
        <h2
          style={{ marginBottom: '1rem', marginTop: '-1rem', fontSize: '35px' }}
        >
          Leaderboard
        </h2>
        {leaderboardLoading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>
            Loading leaderboard...
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {fullLeaderboard.map((entry, idx) => (
              <li
                key={idx}
                className="body-base"
                style={{
                  padding: '0.5rem 1rem',
                  background:
                    entry.name === currentUser
                      ? 'rgba(96, 108, 56, 0.6)'
                      : 'transparent',
                  borderRadius: '0.25rem',
                  marginBottom: '0.5rem',
                }}
              >
                {idx + 1}. {entry.name} — {entry.points}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Credits */}
      <p className="body-base" style={{ marginTop: '.25rem' }}>
        You've earned <strong>{credits}</strong> credits!
      </p>

      {/* Bottom buttons */}
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
          fontSize: '1rem',
        }}
      >
        <div style={{ position: 'relative' }}>
          {copied && (
            <div
              style={{
                position: 'absolute',
                top: '-1.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#606c38',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
              }}
            >
              Copied!
            </div>
          )}
          <button onClick={handleShare} className="icon-button" title="Share">
            <ShareButtonIcon />
          </button>
        </div>

        <button onClick={() => navigate('/')}>← Back to Home</button>

        <button
          onClick={() => navigate('/store', { state: { credits } })}
          className="icon-button"
        >
          <StoreIcon />
        </button>
      </div>
    </div>
  )
}

export default ResultPage
