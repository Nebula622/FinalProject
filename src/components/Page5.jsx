import React, { useState, useEffect } from 'react';
import snowWhiteImage from '../images/snowwhite.jpg';
import dwarfImage from '../images/dwarf.jpg';

const Page5 = () => {
  const dialogue = [
    "Hello, I’m Snow White.",
    "I am a dwarf",
    "How old are you?",
    "We don't count things like age",
    "Can I live with you?",
    "Of course!"
  ];

  const images = [snowWhiteImage, dwarfImage];

  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLine < dialogue.length - 1) {
        setCurrentLine(currentLine + 1);
      }
    }, 2000); // Change the delay time here (in milliseconds)

    return () => clearTimeout(timer);
  }, [currentLine, dialogue.length]);

  return (
    <div>
      <h1>Conversation</h1>
      <div>
        {dialogue.slice(0, currentLine + 1).map((line, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img src={images[index % images.length]} alt="Speaker" style={{ width: '50px', marginRight: '10px' }} />
            <p>{line}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page5;