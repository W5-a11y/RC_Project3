// src/pages/StorePage.jsx
import { useNavigate } from 'react-router-dom'

function StorePage() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Store</h1>
      <p>Coming soon!</p>
      <button onClick={() => navigate('/')}>← Back to Home</button>
    </div>
  )
}

export default StorePage
