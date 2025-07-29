import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TopicPage from './pages/TopicPage'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'
import CreditsPage from './pages/Credits'
import StorePage from './pages/StorePage'
import LogInPage from './pages/LogInPage'

function App() {
  return (
    <div className="aspect-wrapper">
      <div className="aspect-box">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/topics" element={<TopicPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/login" element={<LogInPage />} />
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App
