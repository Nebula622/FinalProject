import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { Link } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import exampleImage from '../images/sheisfine.jpg';

const DraggableWord = ({ word }) => {
  if (word === 'He' || word === 'She'|| word === 'You'|| word === 'They'|| word === 'I'|| word === 'hungry') {
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

const Page4 = () => {

//빈칸 개수만큼 completeWord 선언
  const [completedWord, setCompletedWord] = useState('');
  const [completedWord2, setCompletedWord2] = useState('');
  const [completedWord3, setCompletedWord3] = useState('');
  const [completedWord4, setCompletedWord4] = useState('');
  const [completedWord5, setCompletedWord5] = useState('');
  const [checkResult, setCheckResult] = useState('');


  //따로 핸들링
  const handleDrop = (word) => {
    setCompletedWord(word);
  };
  const handleDrop2 = (word) => {
    setCompletedWord2(word);
  };
  const handleDrop3 = (word) => {
    setCompletedWord3(word);
  };
  const handleDrop4 = (word) => {
    setCompletedWord4(word);
  };
  const handleDrop5 = (word) => {
    setCompletedWord5(word);
  };

  //정답은 한번에 체크
  const checkAnswer = () => {
    if (completedWord === 'is' && completedWord2 ==='am'&& completedWord3 ==='are'&& completedWord4 ==='are'&& completedWord5 ==='is') {
      setCheckResult('Correct!');
    } else {
      setCheckResult('Incorrect!');
    }
  };

  // 초기화는 한번에  --> 현재 초기화는 되나 화면 표출이 제대로 되지 않는 문제있음
  const retryGame = () => {
    setCompletedWord('');
    setCompletedWord2('');
    setCompletedWord3('');
    setCompletedWord4('');
    setCompletedWord5('');
    setCheckResult('');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <a href="/">홈으로</a>
        <Link to="/Page3">
          <img src={exampleImage} alt="Page 3" />
        </Link>
        <h1>Sentence Completion Game</h1>
        <div>
          <DraggableWord word="He" />
          <DropTargetBox onDrop={handleDrop} />
          <DraggableWord word="hungry" />
        </div>
        <div>
          <DraggableWord word="I" />
          <DropTargetBox onDrop={handleDrop2} />
          <DraggableWord word="hungry" />
        </div>
        <div>
          <DraggableWord word="You" />
          <DropTargetBox onDrop={handleDrop3} />
          <DraggableWord word="hungry" />
        </div>
        <div>
          <DraggableWord word="They" />
          <DropTargetBox onDrop={handleDrop4} />
          <DraggableWord word="hungry" />
        </div>
        <div>
          <DraggableWord word="She" />
          <DropTargetBox onDrop={handleDrop5} />
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

export default Page4;