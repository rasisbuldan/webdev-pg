import React, { useEffect } from 'react';
import './Board.css';

function Square(props) {
  useEffect(() => {
    console.log(props);
    console.log('Render square!');
    console.log(props.props.piece);
  }, [props]);

  return(
    <button
      className={'square_' + props.props.color}
      onClick={props.props.onClick}
      style={props.props.style}
    >
      {props.props.piece}
    </button>
  )
}

export default Square;