import { useNavigate } from "react-router-dom";
import StoreIcon from '../assets/store.svg?react';
import CreditsIcon from '../assets/credits.svg?react';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Main Centered Content */}
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '2em'}}>
        <h1>Welcome to the Quiz Game</h1>
        <button onClick={() => navigate('/topics')}>
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
