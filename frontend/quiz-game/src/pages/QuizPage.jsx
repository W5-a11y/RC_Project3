import { useState } from 'react'
import '../index.css'

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [clickedIndex, setClickedIndex] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)

  const questions = [
    {
      question: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Madrid'],
      correct: 0,
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Venus', 'Mars', 'Jupiter'],
      correct: 2,
    },
    // more questions...
  ]

  const handleAnswerClick = (index) => {
    const correct = index === questions[currentQuestion].correct
    setClickedIndex(index)
    setIsCorrect(correct)

    if (correct) {
      setScore(score + 1)
    }

    // Wait 800ms, then go to next question or results
    setTimeout(() => {
      if (currentQuestion === questions.length - 1) {
        setShowResults(true)
      } else {
        setCurrentQuestion((prev) => prev + 1)
        setClickedIndex(null)
        setIsCorrect(null)
      }
    }, 800)
  }

  if (showResults) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">Results</h1>
        <p>You scored {score} out of {questions.length}</p>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quiz Game</h1>

      <div className="question-box">
        <p className="question">{question.question}</p>
        <div className="options">
          {question.options.map((option, idx) => {
            let className = "option-btn"
            if (clickedIndex === idx) {
              className += isCorrect ? " correct" : " wrong"
            }

            return (
              <button
                key={idx}
                className={className}
                onClick={() => handleAnswerClick(idx)}
                disabled={clickedIndex !== null}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default QuizPage
