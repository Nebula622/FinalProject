import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import kingImg from './img/KING.png';
import snowWhiteImg from './img/SNOWWHITE_CHILD.png';
import robotImg from './img/BOT_PALACE.png';
import './css/SnowWhite_2.css';

const SnowWhite_2 = () => {
  const conversations = [
    { line: '시간이 흘러, 공주는 일곱살이 되었습니다.' },
    { line: '왕은 일곱살이 된 공주의 생일을 맞아 작은 선물을 주었습니다' },
    { speaker: '왕', line: '자 선물이다 내 작은 공주 백설아!' },
    { speaker: '백설공주', line: '와! 선물이다! 뭘까?' },
    { speaker: '왕', line: '어서 뜯어보렴!' },
    { line: '공주는 설레는 마음으로 선물을 뜯어 보았습니다.' },
  ];

  const images = {
    '왕': kingImg,
    '백설공주': snowWhiteImg,
    '로봇': robotImg,
  };

  const [currentLine, setCurrentLine] = useState(-1); // Start with -1 to delay the first dialogue
  const [showPopup, setShowPopup] = useState(false);
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
        setShowPopup(true); // Show the popup after conversation ends
        setShowNextButton(true); // Show the next story button after conversation ends
      }
    }, 5000); // Change the delay time here (in milliseconds)

    return () => clearTimeout(timer);
  }, [currentLine, conversations.length]);

  const handleClosePopup = () => {
    setShowPopup(false);
    window.location.href = '/SnowWhite_3';
  };

  const handleReplay = () => {
    setCurrentLine(0); // Reset the conversation to the beginning
    setShowPopup(false); // Close the popup
    setShowNextButton(false); // Hide the next story button
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
      {showPopup && (
        <div className="popup">
          <div className="popup-content"
            style={{
              backgroundImage: `url(${robotImg})`, // Set robotImg as the background image
            }}>
            <p></p>
            <button onClick={handleClosePopup}>닫기</button>
          </div>
        </div>
      )}
      {showNextButton && (
        <div>
          <button onClick={handleReplay}>Replay</button>
        </div>
      )}
    </div>
  );
};

export default SnowWhite_2;