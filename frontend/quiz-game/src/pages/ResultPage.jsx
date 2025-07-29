import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ShareButtonIcon from '../assets/ShareButton.svg?react'

function ResultPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const score = location.state?.score ?? 0
  const total = location.state?.total ?? 0
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const text = `I scored ${score} out of ${total}!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => setCopied(true))
        .catch(err => console.error('Copy failed', err));
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
      } catch (err) {
        console.error('Copy failed', err);
      }
      document.body.removeChild(textarea);
    }
  }

  return (
    <div style={{ position: 'relative', height: '100vh', padding: '2rem', boxSizing: 'border-box', textAlign: 'center' }}>
      <h2>Your score is {score} out of {total}</h2>

      {/* Bottom button row */}
      <div style={{ position: 'absolute', bottom: '2rem', left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <button
          onClick={handleShare}
          style={{
            padding: '0.5rem 1rem',
            display: 'inline-flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <ShareButtonIcon style={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }} />
          {copied ? 'Copied!' : 'Share'}
        </button>

        <button onClick={() => navigate('/')}>
          ← Back to Home
        </button>

        <button onClick={() => navigate('/store')}>
          Go to Store
        </button>

        <button onClick={() => navigate('/leaderboard')}>
          Check the leaderboard
        </button>
      </div>
    </div>
  )
}

export default ResultPage
