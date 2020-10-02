import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  square1: {
    backgroundColor: '#B2EBF2',
    margin: -1,
    padding: 20,
    border: '2px solid black'
  },
  square2: {
    backgroundColor: '#B2EBF2',
    margin: -1,
    padding: 20,
    border: '2px solid black'
  },
  board: {
    backgroundColor: 'green',
    padding: 0,
  }
}))

function Square({ idx }) {
  const classes = useStyles();
  const [squareVal, setSquareVal] = useState('O');
  const [idxVal, setIdxVal] = useState();

  useEffect(() => {
    setSquareVal('O');
    setIdxVal(idx);
  }, [idx]);

  return(
    <Button onClick={() => setSquareVal('-')} className={idx % 2 == 0 ? classes.square1 : classes.square2}>
      {squareVal}
    </Button>
  )
}


function Board() {
  const classes = useStyles();
  const [boardState, setBoardState] = useState(['']);

  return(
    <div className={classes.board}>
      <div>
        <Square idx={1} />
        <Square idx={2} />
        <Square idx={3} />
        <Square idx={4} />
      </div>
      <div>
        <Square idx={2} />
        <Square idx={6} />
        <Square idx={7} />
        <Square idx={8} />
      </div>
      <div>
        <Square idx={9} />
        <Square idx={10} />
        <Square idx={11} />
        <Square idx={12} />
      </div>
      <div>
        <Square idx={13} />
        <Square idx={14} />
        <Square idx={15} />
        <Square idx={16} />
      </div>
    </div>
  )
}

export default Board;