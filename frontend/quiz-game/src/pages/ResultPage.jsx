import { useLocation, useNavigate } from 'react-router-dom'

function ResultPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const score = location.state?.score ?? 0
  const total = location.state?.total ?? 0

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Your score is {score} out of {total}</h2>
      <button onClick={() => navigate('/')}>← Back to Home</button>
    </div>
  )
  
}

export default ResultPage
