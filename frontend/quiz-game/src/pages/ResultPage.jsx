import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ShareButtonIcon from '../assets/ShareButton.svg?react'
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

  // Calculate credits
  const credits = total > 0 ? Math.round(10 + (score / total) * 90) : 10

  // Leaderboard
  const baseEntries = location.state?.leaderboard || [
    { name: 'Alice', score: 150 },
    { name: 'Bob', score: 240 },
    { name: 'Charlie', score: 380 },
  ]
  const fullLeaderboard = [...baseEntries, { name: 'You', score }].sort((a, b) => b.score - a.score)

  useEffect(() => {
    const fetchUserStats = async () => {
      const userUID = localStorage.getItem('userUID')
      if (!userUID || (score === 0 && total === 0)) {
        setLoading(true)
        try {
          const response = await fetch(`http://127.0.0.1:5000/user-stats?uid=${userUID}`)
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
        .then(() => setCopied(true))
        .catch(err => console.error('Copy failed', err))
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
    <div className="quiz-container"
      style={{
        position: 'relative',
        height: '100vh',
        padding: '2rem',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <h1 className="h2 topic-header">
        Your score is {score} out of {total}
      </h1>

      {alreadyPlayed ? (
        <h3 style={{ color: '#432818' }}>
          You've already completed today's quiz! Come back tomorrow for a new challenge.
        </h3>
      ) : (
        scoreSubmitted && (
          <p style={{ color: 'green', marginTop: '1rem' }}>
            Score saved to your profile!
          </p>
        )
      )}

      {/* Leaderboard */}
      <div style={{ margin: '4rem auto', maxWidth: '400px', fontSize: '1.25rem' }}>
        <h2 className="h2 topic-header" style={{ marginBottom: '1rem' }}>Leaderboard</h2>
        <ul className="body-base" style={{ listStyle: 'none', padding: 0 }}>
          {fullLeaderboard.map((entry, idx) => (
            <li
              key={idx}
              className="body-base"
              style={{
                padding: '0.75rem 1rem',
                background: entry.name === 'You' ? '#f0e68c' : 'transparent',
                borderRadius: '0.25rem',
                marginBottom: '0.75rem',
              }}
            >
              {idx + 1}. {entry.name} — {entry.score}
            </li>
          ))}
        </ul>
      </div>

      {/* Credits */}
      <p style={{ fontSize: '1.5rem', marginTop: '2rem' }}>
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
        <button
          onClick={handleShare}
          style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <ShareButtonIcon style={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }} />
          {copied ? 'Copied!' : 'Share'}
        </button>

        <button onClick={() => navigate('/')}>← Back to Home</button>

        <button onClick={() => navigate('/store', { state: { credits } })}>Go to Store</button>
      </div>
    </div>
  )
}

export default ResultPage
