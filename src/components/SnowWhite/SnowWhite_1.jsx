import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import kingImg from './img/KING_AND_QUEEN_YOUNG.png';
import queen01Img from './img/QUEEN_SPINNING_WHEEL.png';
import queen02Img from './img/QUEEN_HURT.png';
import bloodImg from './img/SURROUNDINGS_BLOOD_DROP.png';
import snowwhiteImg from './img/SNOWWHITE_HAPPY_FACE.png';
import queen03Img from './img/QUEEN_BABY_SNOWWHITE.png';
import funeralImg from './img/SURROUNDINGS_FUNERAL_OF_QUEEN.png';
import kingMarriedImg from './img/KING_MARRY_WITH_WITCH.png';
import './css/SnowWhite_1.css';

const SnowWhite_1 = () => {
  const conversations = [
    { text: `먼 옛날에, 한 왕국에 왕과 왕비가 살았습니다.`, image: kingImg },
    { text: `어느 하얀 눈이 소복 하게 내리던날,\n 왕비는 물레로 옷을 짓고 있었습니다.`, image: queen01Img },
    { text: `옷을 짓던 중, 창 밖의 하얀 눈에 정신을 빼앗긴 왕비는,\n그만 물레에 손을 찔리고 말았습니다.`, image: queen02Img },
    { text: `물레에 찔려 흘린 왕비의 피는\n하얀 눈 위에 떨어져 붉은 자국을 남겼습니다.`, image: bloodImg },
    { text: `왕비는 이 붉은 자국을 보며,\n'입술은 핏자국처럼 붉고, 피부는 눈처럼 하얀 아이를 갖고 싶다' 소망했습니다.`, image: snowwhiteImg },
    { text: `그리고 얼마 지나지 않아 왕비는 아이를 가졌고,\n왕비의 소원대로 빨간 입술에 하얀 피부를 지닌 딸을 낳았습니다.`, image: queen03Img },
    { text: `아이를 낳은 기쁨도 잠시,\n왕비는 안타깝게도 얼마 지나지 않아 세상을 떠나고 말았습니다.`, image: funeralImg },
    { text: `그리고 몇년이 지나,\n 왕은 재혼을 했습니다.`, image: kingMarriedImg },
  ];

  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [fadeOut, setFadeOut] = useState(false); // 변경된 부분: 페이드 아웃 상태 추가

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (textIndex < conversations[currentLine].text.length) {
        setDisplayedText((prevText) => prevText + conversations[currentLine].text[textIndex]);
        setTextIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          if (currentLine < conversations.length - 1) {
            setCurrentLine((prevLine) => prevLine + 1);
            setDisplayedText('');
            setTextIndex(0);
          } else {
            setShowButton(true);
          }
        }, 3000); // 변경된 부분: 페이드 아웃 딜레이 시간 조정 (페이지 전환 전)
      }
    }, 180);

    return () => clearInterval(typingInterval);
  }, [currentLine, conversations, textIndex]);

  const handleNextPage = () => {
    setFadeOut(true); // 페이드 아웃 클래스 추가
    setTimeout(() => {
      setShowButton(false); // 버튼 숨기기
      window.location.href = '/SnowWhite_2'; // 페이지 전환
    }, 1000); // 변경된 부분: 페이드 아웃 후 페이지 전환 딜레이 시간 조정
  };

  return (
    <div className={`conversation-container ${fadeOut ? 'fade-out' : ''}`}>
      {conversations.map((conversation, index) => (
        <div
          key={index}
          className={`conversation-item ${currentLine === index ? 'show' : ''}`}
          style={{ backgroundImage: `url(${conversation.image})` }}
        >
          <p>{currentLine === index ? displayedText : conversation.text}</p>
        </div>
      ))}
      {showButton && (
        <button className="next-button" onClick={handleNextPage}>
          다음이야기
        </button>
      )}
      {fadeOut && <div className="black-screen" />} {/* 변경된 부분: 페이드 아웃 화면 */}
    </div>
  );
};

export default SnowWhite_1;