import React, { useState, useEffect } from 'react';
import snowWhiteImg from '../images/snowwhite.jpg';
import witchImg from '../images/witch.jpg';
import dwarfImg from '../images/dwarf.jpg';

const Page8 = () => {
  const conversations = [
    { text: "Snow White: “Who are you?”", image: snowWhiteImg },
    { text: "Witch: “Buy apples.”", image: witchImg },
    { text: "Snow White: 'Apples? Sounds delicious!'", image: snowWhiteImg },
    { text: "Dwarf: “Princess, that person is suspicious!”", image: dwarfImg },
    { text: "Witch: 'The apples are really delicious...'", image: witchImg },
    { text: "Dwarf: “Suspicious!”", image: dwarfImg },
    { text: "Snow White: “It’s okay!”", image: snowWhiteImg },
    { text: "Dwarf: 'I can't do it...'", image: dwarfImg },
  ];

  const [currentLine, setCurrentLine] = useState(0);
  const [showWindow, setShowWindow] = useState(false);

  useEffect(() => {
    if (currentLine < conversations.length) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1);
      }, 2000); // Change the delay time here (in milliseconds)

      return () => clearTimeout(timer);
    } else {
      setShowWindow(true);
    }
  }, [currentLine, conversations.length]);

  const closeWindow = () => {
    setShowWindow(false);
  };

  return (
    <div>
      {currentLine < conversations.length ? (
        <div>
          <h1>Page 8</h1>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img src={conversations[currentLine].image} alt="Speaker" style={{ width: '50px', marginRight: '10px' }} />
            <p>{conversations[currentLine].text}</p>
          </div>
        </div>
      ) : null}
      {showWindow && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '2px solid #000',
            padding: '20px',
            backgroundColor: '#fff',
            zIndex: '999',
          }}
        >
          <p>Small window content</p>
          <button onClick={closeWindow}>Click</button>
        </div>
      )}
    </div>
  );
};

export default Page8;