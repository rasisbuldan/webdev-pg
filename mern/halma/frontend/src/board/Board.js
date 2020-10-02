import React, { useState, useEffect } from 'react';
import Square from './Square';

const boardSize = 8;
const squareNum = [...Array(16).keys()];

/* 8x8 board state */
const initialBoardState = {
  squares: [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ]
}

function Board(props) {
  const [boardState, setBoardState] = useState(initialBoardState);
  const board = [];

  useEffect(() => {
    console.log('Render board!');
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        let squareColor = ((i*boardSize) + j) % 2 == 0 ? 'grey' : 'white';
        board.push(
          <Square props={{
            color: squareColor,
            onClick: {clickDemo},
            style: {backgroundColor: 'white', border: '1px solid black'},
            piece: 'A'
          }} />
        )
      }
    }
  }, [boardState]);

  return(
    <div style={{display: 'grid', height: '400px', gridGap: '20px'}}>
      {
        squareNum.map((item,idx) => <Square props={{
          color: 'grey',
          onClick: {clickDemo},
          style: {
            backgroundColor: 'white',
            border: '1px solid black',
            display:'inline-grid',
            borderRadius: '0',
            width: '100px',
            height: '100px'
          },
          piece: 'A'+item
        }} key={idx} />)
      }
    </div>
  )
}

const clickDemo = () => {
  console.log('button clicked!');
}

export default Board;