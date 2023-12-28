import React, { useState, useEffect } from 'react';
import snowWhiteImage from '../images/snowwhite.jpg';
import dwarfImage from '../images/dwarf.jpg';
import witchImage from '../images/witch.jpg';

const Page6 = () => {
  const conversations = [
    { speaker: 'Snow White', line: 'Who are you?' },
    { speaker: 'Witch', line: 'Buy apples.' },
    { speaker: 'Snow White', line: 'Apples? Sounds delicious!' },
    { speaker: 'Dwarf', line: 'Princess, that person is suspicious!' },
    { speaker: 'Witch', line: 'The apples are really delicious...' },
    { speaker: 'Dwarf', line: 'Suspicious!' },
    { speaker: 'Snow White', line: 'It’s okay!' },
    { speaker: 'Dwarf', line: 'I can\'t do it...' },
  ];

  const images = {
    'Snow White': snowWhiteImage,
    'Dwarf': dwarfImage,
    'Witch': witchImage
  };

  const [currentLine, setCurrentLine] = useState(0);
  const [conversationEnded, setConversationEnded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLine < conversations.length - 1) {
        setCurrentLine(currentLine + 1);
      } else {
        setConversationEnded(true);
      }
    }, 2000); // Change the delay time here (in milliseconds)

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
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <img src={images[dialogue.speaker]} alt="Speaker" style={{ width: '50px', marginRight: '10px' }} />
          <p>{`${dialogue.speaker}: ${dialogue.line}`}</p>
        </div>
      ))}
      {conversationEnded && (
        <button onClick={handleReplay}>Replay</button>
      )}
    </div>
  );
};

export default Page6;