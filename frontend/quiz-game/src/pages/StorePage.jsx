import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../index.css'

// Sample unlockable items (replace or extend as needed)
const STORE_ITEMS = [
  {
    id: 1,
    name: 'Dark Mode Theme',
    description: 'Unlock a sleek, dark color scheme for the app.',
    cost: 100,
  },
  {
    id: 2,
    name: 'Streak Emoji Color',
    description: 'Choose from a variety of fun colors.',
    cost: 200,
  },
  {
    id: 3,
    name: 'Pro Badge',
    description: 'Show off a special badge next to your username.',
    cost: 300,
  },
  {
    id: 4,
    name: 'Extra Hint',
    description: 'Get one extra hint per quiz.',
    cost: 150,
  },
]

function StorePage() {
  const navigate = useNavigate()
  const location = useLocation()
  // Use credits passed from ResultPage, or default to 0
  const initialCredits = location.state?.credits ?? 0
  const [Credits, setCredits] = useState(initialCredits)
  const [unlocked, setUnlocked] = useState([])

  const handlePurchase = (item) => {
    if (Credits >= item.cost && !unlocked.includes(item.id)) {
      setCredits(prev => prev - item.cost)
      setUnlocked(prev => [...prev, item.id])
      // TODO: Persist purchase to backend or global state
    }
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 className="h2 topic-header">Store</h1>
      <p className="body-base">
        You have <strong>{Credits}</strong> Credits
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        {STORE_ITEMS.map((item) => {
          const isUnlocked = unlocked.includes(item.id)
          const canAfford = Credits >= item.cost

          return (
            <div key={item.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
              <h2 className="h2 topic-header" style={{ fontSize: '1.25rem' }}>{item.name}</h2>
              <p className="body-base">{item.description}</p>
              <p className="body-base">Cost: {item.cost} credits</p>
              <button
                onClick={() => handlePurchase(item)}
                disabled={!canAfford || isUnlocked}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: isUnlocked ? '#aaa' : canAfford ? '#28a745' : '#ccc',
                  color: '#fff',
                  border: 'none',
                  cursor: canAfford && !isUnlocked ? 'pointer' : 'not-allowed',
                }}
              >
                {isUnlocked ? 'Unlocked' : canAfford ? 'Buy' : 'Too Expensive'}
              </button>
            </div>
          )
        })}
      </div>

      <button onClick={() => navigate('/')} style={{ marginTop: '2rem', padding: '0.5rem 1rem' }}>
        ← Back to Home
      </button>
    </div>
  )
}

export default StorePage
