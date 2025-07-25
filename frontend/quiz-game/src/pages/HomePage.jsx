import { useNavigate } from "react-router-dom";
import StoreIcon from '../assets/store.svg?react';
import CreditsIcon from '../assets/credits.svg?react';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Main Centered Content */}
      <div className="text-center">
        <h1>Welcome to the Quiz Game</h1>
        <button onClick={() => navigate('/topics')}>
          Play Game
        </button>
      </div>

      {/* Bottom Buttons with Icons */}
      <button
        onClick={() => navigate('/credits')}
        className="icon-button bottom-left"
      >
        <CreditsIcon />
      </button>

      <button
        onClick={() => navigate('/store')}
        className="icon-button bottom-right"
      >
        <StoreIcon />
      </button>
    </div>
  );
}

export default HomePage;
