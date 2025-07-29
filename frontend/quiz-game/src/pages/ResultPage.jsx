import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ShareButtonIcon from '../assets/ShareButton.svg?react'
import '../index.css'

function ResultPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const score = location.state?.score ?? 0
  const total = location.state?.total ?? 0
  const [copied, setCopied] = useState(false)

  // Inline leaderboard data: either passed via state or fallback mock
  const leaderboard =
    location.state?.leaderboard ||
    [
      { name: 'Alice', score: 15 },
      { name: 'Bob', score: 12 },
      { name: 'Charlie', score: 10 },
      { name: 'You', score: score },
    ]

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

      {/* Leaderboard section with larger size, centered heading, and extra top margin */}
      <div
        style={{
          margin: '4rem auto',       // was '2rem auto'
          maxWidth: '400px',
          textAlign: 'center',      // kept center
          fontSize: '1.25rem',
        }}
      >
        <h2 className="h2 topic-header" style={{ marginBottom: '1rem' }}>
          Leaderboard
        </h2>
        <ul className="body-base" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {leaderboard.map((entry, idx) => (
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
          fontSize: '1rem',
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
