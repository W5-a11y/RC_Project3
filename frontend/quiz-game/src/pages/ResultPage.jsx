import { useNavigate } from 'react-router-dom'

function ResultPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Your score is ...</h2>
      <button onClick={() => navigate('/')}>← Back to Home</button>
    </div>
  )
  
}

export default ResultPage
