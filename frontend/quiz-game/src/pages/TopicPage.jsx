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
    setTimeout(() => {
      navigate('/quiz')
    }, 1000)
  }

  return (
    <div className="topic-page">
      <h1>Choose a Topic</h1>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        onStopSpinning={handleStopSpinning}
        backgroundColors={['#3e3e3e', '#df3428']}
        textColors={['#ffffff']}
      />
      <button onClick={handleSpinClick}>Spin</button>
    </div>
  )
}

export default TopicPage
