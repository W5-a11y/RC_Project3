import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wheel } from 'react-custom-roulette'

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

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length)
    setPrizeNumber(newPrizeNumber)
    setMustSpin(true)
  }

  const handleStopSpinning = () => {
    const selectedTopic = data[prizeNumber].option
    setTimeout(() => {
      navigate('/quiz', { state: { topic: selectedTopic}})
    }, 1000)
  }

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
            />
        </div>
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '20px'}}>
        <button onClick={handleSpinClick}>Spin</button>
      </div>
    </div>
  )
}

export default TopicPage
