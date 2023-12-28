import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import exampleImage from '../images/sheisfine.jpg';


const Page1 = () => {
  const DraggableWord = ({ word }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'WORD',
      item: { word },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
  
    return (
      <div
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
          border: '1px solid #000',
          padding: '5px',
          margin: '5px',
          display: 'inline-block',
        }}
      >
        {word}
      </div>
    );
  };
  
  // Updated DropTargetBox component
  const DropTargetBox = () => {
    const [droppedWord, setDroppedWord] = useState(null); // State to hold the dropped word
    const [checkResult, setCheckResult] = useState(''); // State to hold the check result
  
  
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'WORD',
      drop: (item) => {
        setDroppedWord(item.word); // Update dropped word in state
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));
  
  
    return (
      <div>
        <div
          ref={drop}
          style={{
            width: '60px',
            height: '30px',
            border: '2px dashed #000',
            margin: '0px',
            display: 'inline-block',
            backgroundColor: isOver ? 'lightgray' : 'transparent',
            textAlign: 'center',
            lineHeight: '10px', // Center content vertically
          }}
        >
          {droppedWord ? droppedWord : ''} {/* Display dropped word or 'Empty' */}
        </div>
        {/* Display check result */}
        {checkResult && <p>{checkResult}</p>}
      </div>
    );
  };




  const words = ['는', '은', '가', '이']; // 드래그 가능한 단어 목록
  const expectedAnswer = '는'; // Expected correct answer

  const [droppedWord, setDroppedWord] = useState('');
  const [checkResult, setCheckResult] = useState('');
  const handleDrop = (word) => {
    console.log('handle drop working')
    console.log(word)
    setDroppedWord(word);
  };

  const checkAnswer = () => {
    console.log('Dropped Word:', droppedWord)
    console.log('Expected Answer:', expectedAnswer)
    if (droppedWord === expectedAnswer) {
      setCheckResult('Correct!');
    } else {
      setCheckResult('Incorrect!');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1>Welcome to Page 1</h1>
        <p>This is the content for Page 1.</p>
        <a href="/">홈으로</a>
        <Link to="/Page2">
          <img src={exampleImage} alt="Page 2" />
        </Link>
        {/* 네모 상자에 정답이 될 수 있는 후보군인 단어들 */}
        <div style={{ border: '2px solid black', padding: '10px', margin: '10px' }}>
          {words.map((word, index) => (
            <DraggableWord key={index} word={word} />
          ))}
        </div>
        {/* 빈 상자 드롭 타겟 */}
        <DropTargetBox onDrop={handleDrop} />

        {/* Check button */}
        <button onClick={checkAnswer}>OK</button>
        
        {/* Display check result */}
        {checkResult && <p>{checkResult}</p>}
      </div>
    </DndProvider>
  );
};

export default Page1;