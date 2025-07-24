import { useNavigate } from "react-router-dom"

function HomePage() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>Welcome to the Quiz Game</h1>
      {/* go to sign in page if not signed in */}
      <button onClick={() => navigate('/topics')}>Start</button>  {/*go to topics page*/}
      <button onClick={() => navigate('/store')}>Store/Customization</button> {/*go to profile customization page*/}
      <button onClick={() => navigate('/credits')}>Credits</button> {/*go to credits page*/}
    </div>
    
  )
}

export default HomePage
