import React from 'react';
import '@/styles/feature/node.css';

type NodeProps = {
  isFinish: boolean;
  isStart: boolean;
  col: number;
  row: number;
  isWall: boolean;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp?: () => void;
};

function Node({
  isFinish,
  isStart,
  col,
  row,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: NodeProps): React.ReactElement {
  const handleMouseDown = (): void => {
    onMouseDown(row, col);
  };

  const handleMouseEnter = (): void => {
    onMouseEnter(row, col);
  };

  const exClassName = isFinish
    ? 'node-finish'
    : isStart
    ? 'node-start'
    : isWall
    ? 'node-wall'
    : '';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${exClassName}`}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={onMouseUp}
    ></div>
  );
}

export default Node;
