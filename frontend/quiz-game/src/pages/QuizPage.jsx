import { useState, useEffect } from 'react'
import { useLocation, useNavigate} from 'react-router-dom'
import QuestionBox from '../assets/QuizContainer.svg?react';
import HintIcon from '../assets/HintButton.svg?react';
import '../index.css'

function QuizPage() {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState(30)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [eliminatedOptions, setEliminatedOptions] = useState([]) // later for hint
  const [showHintMessage, setShowHintMessage] = useState(false);
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [clickedIndex, setClickedIndex] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const location = useLocation()
  const topic = location.state?.topic || 'Default'

  // get the quiz questions from backend
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`http://127.0.0.1:5000/today-quiz?topic=${topic}`);
        const data = await res.json()
        if (data.questions) {
          // Normalize questions to match expected format
          const formatted = data.questions.map(q => ({
            question: q.question,
            options: q.options,
            answer: q.options.indexOf(q.answer)  // Get index of correct string
          }))
          setQuestions(formatted)
        } else {
          console.error(data.error || "Failed to load quiz")
        }
      } catch (err) {
        console.error("Error fetching quiz:", err)
      }
    }

    fetchQuiz()
  }, [topic])

  useEffect(() => {
    if (clickedIndex !== null || !questions.length) return // stop timer if answered
    // move to next question if time is 0
    if (timeLeft === 0) {
      setTimeout(() => {
        if (currentQuestion === questions.length - 1) {
          setShowResults(true)
        } else {
          setCurrentQuestion((prev) => prev + 1)
          setTimeLeft(100000)
          setClickedIndex(null)
          setIsCorrect(null)
        }
      }, 800)
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, clickedIndex, currentQuestion, questions.length])

  // reset timer on new question
  useEffect(() => {
    setTimeLeft(30)
  }, [currentQuestion])

  useEffect(() => {
    if (showResults) {
      navigate('/result', { state: { score, total: questions.length * 100 } })
    }
  }, [showResults])

  const handleAnswerClick = (index) => {
    const correct = index === questions[currentQuestion].answer
    setClickedIndex(index)
    setIsCorrect(correct)

    if (correct) {
      let points = 100;
      const penaltySeconds = Math.max(0, 30 - timeLeft - 5);
      points -= Math.floor(penaltySeconds / 2) * 5;
      points = Math.max(0, points);

      setScore(prev => prev + points);
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

  if (!questions.length) return <div>Loading quiz...</div>
  const question = questions[currentQuestion] || {}

  return (
    <div className="quiz-container">
      <div className="topic-header-wrapper">
        <h1 className="h2 topic-header" title={topic}>Topic: {topic}</h1>
      </div>
      
      <div className="question-box-wrapper">
        <div className="question-box-image">
          <QuestionBox className="question-svg" />
          <p className="quiz-question-text">{question.question}</p>
          <span className="timer">{timeLeft}s</span>
        </div>
        
        <div className="options">
          {question.options.map((option, idx) => {
            let className = "option-btn body-base"
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
        
        <button className="icon-button" onClick={() => {
          setShowHintMessage(true);
          setTimeout(() => setShowHintMessage(false), 3000)
        }}>
          <HintIcon/>
        </button>
        {showHintMessage && (
        <div className="body-base" style={{ marginTop: "-1rem", color: "#BB342F"}}>
          Hint not unlocked yet!
        </div>
        )}

      </div>

    </div>
  )
}

export default QuizPage
