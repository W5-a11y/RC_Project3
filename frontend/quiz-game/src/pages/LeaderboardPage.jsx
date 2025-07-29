import { useLocation, useNavigate } from 'react-router-dom';
import '../index.css'

function LeaderboardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Expecting an array of { name, score } from state; fallback to mock data
  const leaderboard = location.state?.leaderboard || [
    { name: 'Alice', score: 15 },
    { name: 'Bob', score: 12 },
    { name: 'Charlie', score: 10 },
    { name: 'You', score: 0 },
  ];

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Leaderboard</h2>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          maxWidth: '300px',
          margin: '1rem auto',
        }}
      >
        {leaderboard.map((entry, idx) => (
          <li
            key={idx}
            style={{
              padding: '0.5rem 1rem',
              background: entry.name === 'You' ? '#f0e68c' : 'transparent',
              borderRadius: '0.25rem',
              marginBottom: '0.5rem',
            }}
          >
            {idx + 1}. {entry.name} — {entry.score}
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate(-1)}
        style={{ marginTop: '2rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        ← Back
      </button>
    </div>
  );
}

export default LeaderboardPage;
