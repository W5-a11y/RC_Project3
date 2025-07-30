import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wheel } from 'react-custom-roulette'

// Spinner wheel topics
const data = [
  { option: 'Entertainment' },
  { option: 'Science' },
  { option: 'History' },
  { option: 'Geography' },
  { option: 'Art'},
  { option: 'Misc.' },
]

function TopicPage() {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0)
  const navigate = useNavigate()
  const [lockedPrizeIndex, setLockedPrizeIndex] = useState(null)
  const [loading, setLoading] = useState(true)


  const handleSpinClick = () => {
    const newPrizeNumber = lockedPrizeIndex !== null
      ? lockedPrizeIndex
      : Math.floor(Math.random() * data.length)
    setPrizeNumber(newPrizeNumber)
    setMustSpin(true)
  }

  const handleStopSpinning = () => {
    const selectedTopic = data[prizeNumber].option
    setTimeout(() => {
      navigate('/quiz', { state: { topic: selectedTopic}})
    }, 1000)
  }

  // Check if exsiting quiz from the user's location and lock the wheel to that topic
  useEffect(() => {
    const checkExistingQuiz = async() => {
      try {
        const response = await fetch('http://localhost:5000/today-quiz')
        if (!response.ok) {
          throw new Error('Failed to fetch quiz')
        }
        const dataFromBackend = await response.json()
        // If quiz exists for that location then lock the topic to spin
        if (dataFromBackend.topic) {
          const index = data.findIndex(item => item.option === dataFromBackend.topic)
          if (index !== -1) {
            setLockedPrizeIndex(index)
          }
        }
      } catch (error) {
        console.error('Error checking for existing quiz:', error)
      } finally {
        setLoading(false)
      }
    } 
    checkExistingQuiz()
  }, [])

  return (
    <div>
      <h1>Choose a Topic</h1>
        <div style={{ transform: 'scale(0.95)'}}>
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}
              onStopSpinning={handleStopSpinning}
              backgroundColors={['#ffe6a7', '#bb9457']}
              textColors={['#432818']}
              fontSize={22}
              outerBorderWidth={3}
              outerBorderColor='#432818'
              radiusLineWidth={3}
              radiusLineColor='#432818'
              pointerProps={{
                style: {
                  fill: '#606c38',
                },
              }}
              spinDuration={0.5}
            />
        </div>
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '20px'}}>
        <button onClick={handleSpinClick} disabled={loading}>{loading ? 'Loading...' : 'Spin'}</button>
      </div>
    </div>
  )
}

export default TopicPage
