import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
        width: '100px',
        height: '30px',
        border: '2px dashed #000',
        margin: '10px',
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

const SentenceCompletionGame = () => {
  const [completedSentence, setCompletedSentence] = useState('');
  const [checkResult, setCheckResult] = useState('');

  const handleDrop = (word) => {
    setCompletedSentence((prev) => `${prev} ${word}`);
  };

  const checkAnswer = () => {
    if (completedSentence.trim() === 'He is hungry') {
      setCheckResult('Correct!');
    } else {
      setCheckResult('Incorrect!');
    }
  };

  const retryGame = () => {
    setCompletedSentence('');
    setCheckResult('');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <p>This is the content for Page 2.</p>
        <a href="/">홈으로</a>
        <a href="/Page1">전으로</a>
        <h1>Sentence Completion Game</h1>
        <div>
          <DraggableWord word="He" />
          <DraggableWord word="is" />
          <DraggableWord word="hungry" />
          <DropTargetBox onDrop={handleDrop} />
        </div>
        <p>{checkResult}</p>
        <button onClick={checkAnswer}>Check</button>
        <button onClick={retryGame}>Retry</button>
        <p>Completed Sentence: {completedSentence}</p>
      </div>
    </DndProvider>
  );
};

export default SentenceCompletionGame;