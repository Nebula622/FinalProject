import React, { useState, useEffect } from 'react';

const Page7 = () => {
  const conversations = [
    "Snow White: “Who are you?”",
    "Witch: “Buy apples.”",
    "Snow White: 'Apples? Sounds delicious!'",
    "Dwarf: “Princess, that person is suspicious!”",
    "Witch: 'The apples are really delicious...'",
    "Dwarf: “Suspicious!”",
    "Snow White: “It’s okay!”",
    "Dwarf: 'I can't do it...'",
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
          <h1>Page 7</h1>
          <p>{conversations[currentLine]}</p>
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

export default Page7;