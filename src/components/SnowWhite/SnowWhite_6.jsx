import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import kingImg from './img/KING.png';
import snowWhiteImage from './img/SNOWWHITE_CHILD.png';

const SnowWhite_6 = () => {
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
    '백설공주': snowWhiteImage,
  };

  const [currentLine, setCurrentLine] = useState(-1); // Start with -1 to delay the first dialogue
  const [conversationEnded, setConversationEnded] = useState(false);
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
        setConversationEnded(true);
      }
    }, 5000); // Change the delay time here (in milliseconds)

    return () => clearTimeout(timer);
  }, [currentLine, conversations.length]);

  const handleReplay = () => {
    setCurrentLine(0); // Reset the conversation to the beginning
    setConversationEnded(false); // Reset conversation ended state
  };

  return (
    <div>
      <h1>Conversation</h1>
      {conversations.slice(0, currentLine + 1).map((dialogue, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            marginLeft: `${images[dialogue.speaker] ? '0' : '200px'}`, // Adjust the margin-left here
          }}
        >
          {images[dialogue.speaker] && (
            <img src={images[dialogue.speaker]} alt="Speaker" style={{ width: '200px', marginRight: '10px' }} />
          )}
          <p>{`${dialogue.speaker ? `${dialogue.speaker}: ` : ''}${dialogue.line}`}</p>
        </div>
      ))}
      <div ref={bottomRef}></div> {/* Empty div to scroll to */}
      {conversationEnded && (
        <div>
          <button onClick={handleReplay}>Replay</button>
          <Link to="/SnowWhite_3">
            <button>다음이야기</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SnowWhite_6;