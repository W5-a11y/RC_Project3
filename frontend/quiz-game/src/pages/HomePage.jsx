import { useNavigate } from "react-router-dom";
import StoreIcon from '../assets/store.svg?react';
import CreditsIcon from '../assets/credits.svg?react';

function HomePage() {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'false'; // replace later with actual database of logged in users
    if (isLoggedIn) {
      navigate('/topics');
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Main Centered Content */}
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '2em'}}>
        <h1>Welcome to the Quiz Game</h1>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center', maxWidth: '600px', marginTop: '-1em'}}>
          <div className="body-base">
            <p>Spin the wheel to decide the topic of today's 5 questions. <br />
              Each question must be answered correctly within 30 seconds. <br />
              Points will be awarded based on accuracy and speed. <br /> <br />
              Good Luck!
            </p>
          </div>
        </div>
        
        <button onClick={handlePlayClick}>
          Play Game
        </button>
      </div>

      {/* Bottom Buttons with Icons */}
      <div className="bottom-container">
        <button
          onClick={() => navigate('/credits')}
          className="icon-button"
        >
          <CreditsIcon />
        </button>

        <button
          onClick={() => navigate('/store')}
          className="icon-button"
        >
          <StoreIcon />
        </button>
      </div>
    </div>
  );

}

export default HomePage;
