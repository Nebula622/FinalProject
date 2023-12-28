import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import kingImg from './img/KING.png';
import snowWhiteImg from './img/SNOWWHITE_CHILD_FACE.png';
import robotImg from './img/BOT_PALACE.png';
import './css/SnowWhite_3.css'; // Import the CSS file for styling

const SnowWhite_3 = () => {
  const conversations = [
    { speaker: '백설공주', line: '이게 뭐에요?' },
    { speaker: '왕', line: '아빠가 우리 공주를 잘 신경쓰지 못해서 주는 선물이란다.' },
    { speaker: '왕', line: '네 작은 친구지!' },
    { line: '공주는 선물로 받은 파란 로봇을 바라보았습니다.' },
  ];

  const images = {
    '왕': kingImg,
    '백설공주': snowWhiteImg,
    '로봇': robotImg,
  };

  const [currentLine, setCurrentLine] = useState(-1); // Start with -1 to delay the first dialogue
  const [showNextButton, setShowNextButton] = useState(false); // State to control showing the next story button
  const bottomRef = useRef(null); // Ref for the bottom element

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to the bottom when a new message is added
    }
  }, [currentLine]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLine < conversations.length - 1) {
        setCurrentLine(currentLine + 1);
      } else {
        setShowNextButton(true); // Show the next story button after conversation ends
      }
    }, 5000); // Change the delay time here (in milliseconds)

    return () => clearTimeout(timer);
  }, [currentLine, conversations.length]);

  const handleReplay = () => {
    window.location.href = '/SnowWhite_2';
  };

  return (
    <div>
      <h1>Conversation</h1>
      {conversations.slice(0, currentLine + 1).map((dialogue, index) => (
        <div
          key={index}
          className={`dialogue-container ${!images[dialogue.speaker] ? 'line-only' : ''}`} // line-only 클래스 추가
        >
          {images[dialogue.speaker] && (
            <img src={images[dialogue.speaker]} alt="Speaker" className="speaker-image" />
          )}
          <p className="dialogue-text">
            {dialogue.speaker && (
              <span className="speaker-name">{dialogue.speaker}:</span>
            )}
            {dialogue.line}
          </p>
        </div>
      ))}
      <div ref={bottomRef}></div> {/* Empty div to scroll to */}
      {showNextButton && (
        <div>
          <Link to="/SnowWhite_4">
            <button>다음 이야기</button>
          </Link>
          <button onClick={handleReplay}>Replay</button>
        </div>
      )}
    </div>
  );
};

export default SnowWhite_3;