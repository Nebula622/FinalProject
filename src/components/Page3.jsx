import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DraggableWord = ({ word }) => {
  if (word === 'He' || word === 'hungry') {
    return <p>{word}</p>; // Display 'He' and 'Hungry' as regular text
  }

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
const DropTargetBox = ({ onDrop }) => {
  const [droppedWord, setDroppedWord] = useState(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'WORD',
    drop: (item) => {
      setDroppedWord(item.word);
      onDrop(item.word);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
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
        lineHeight: '30px',
      }}
    >
      {droppedWord ? droppedWord : 'Empty'}
    </div>
  );
};

const Page3 = () => {
  const [completedWord, setCompletedWord] = useState('');
  const [checkResult, setCheckResult] = useState('');

  const handleDrop = (word) => {
    setCompletedWord(word);
  };

  const checkAnswer = () => {
    if (completedWord === 'is') {
      setCheckResult('Correct!');
    } else {
      setCheckResult('Incorrect!');
    }
  };

  const retryGame = () => {
    setCompletedWord('');
    setCheckResult('');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1>Sentence Completion Game</h1>
        <div>
          <DraggableWord word="He" />
          <DropTargetBox onDrop={handleDrop} />
          <DraggableWord word="hungry" />
        </div>
        <div>
          <DraggableWord word="is" />
          <DraggableWord word="am" />
          <DraggableWord word="are" />
        </div>
        <p>{checkResult}</p>
        <button onClick={checkAnswer}>Check</button>
        <button onClick={retryGame}>Retry</button>
      </div>
    </DndProvider>
  );
};

export default Page3;