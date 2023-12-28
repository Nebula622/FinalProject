import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import snowwhite_title from './img/SNOWWHITE_HAPPY.png';
import './css/SnowWhite_Home.css'; // Import the CSS file

const SnowWhite_Home = () => {
  const [showBlackScreen, setShowBlackScreen] = useState(false);

  const handleClick = () => {
    setShowBlackScreen(true);
    setTimeout(() => {
      // Redirect to SnowWhite_1 after a brief delay
      window.location.href = '/SnowWhite_1';
    }, 500); // Adjust the delay time to your preference (in milliseconds)
  };

  return (
    <div>
      <h1>Welcome to Snow White's Story</h1>
      {showBlackScreen && <div className="black-screen" />}
      <button onClick={handleClick}>
        <img src={snowwhite_title} alt="SnowWhite_1" />
      </button>
      <p>Some content related to Snow White's story...</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default SnowWhite_Home;