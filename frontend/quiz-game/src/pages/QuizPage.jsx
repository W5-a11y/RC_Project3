import { useState, useEffect } from 'react'
import { useLocation} from 'react-router-dom'
import QuestionBox from '../assets/QuizContainer.svg?react';
import '../index.css'

function QuizPage() {
  const [timeLeft, setTimeLeft] = useState(30)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [clickedIndex, setClickedIndex] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const location = useLocation()
  const topic = location.state?.topic || 'Default'

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

  useEffect(() => {
    if (clickedIndex !== null) return // stop timer if answered
    // move to next question if time is 0
    if (timeLeft === 0) {
      setTimeout(() => {
        if (currentQuestion === questions.length - 1) {
          setShowResults(true)
        } else {
          setCurrentQuestion((prev) => prev + 1)
          setTimeLeft(30)
          setClickedIndex(null)
          setIsCorrect(null)
        }
      }, 800)
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, clickedIndex, currentQuestion])

  // reset timer on new question
  useEffect(() => {
    setTimeLeft(30)
  }, [currentQuestion])

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
      <h1 className="h2">Topic: {topic}</h1>
      <div className="question-box-wrapper">
        <div className="question-box-image">
          <QuestionBox className="question-svg" />
          <p className="quiz-question-text">{question.question}</p>
          <span className="timer">{timeLeft}s</span>
        </div>

        <div className="options">
          {question.options.map((option, idx) => {
            let className = "option-btn"
            if (clickedIndex === idx) {
              className += isCorrect ? " correct" : " wrong"
            }

            return (
              <button
                key={idx}
                className={className="option-btn body-base"}
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
