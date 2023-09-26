import { useEffect, useState } from 'react';
import {
  getInitialGrid,
  getNewGridWithToggledWall,
  startNodeRow,
  startNodeCol,
  finishNodeRow,
  finishNodeCol,
} from '../grid/Grid';
import Node from '../node/Node';
import { Dijkstra, GetNodesInShortestPathOrder } from '@/algorithms/dijkstra';
import type { Node as NodeType } from '../grid/Grid';
import '@/styles/feature/dijkstra_visualizer.css';

function DijkstraVisualizer(): React.ReactElement {
  const [grid, setGrid] = useState<NodeType[][]>([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  useEffect(() => {
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
  }, []);

  const handleMouseDown = (row: number, col: number): void => {
    const newGrid = getNewGridWithToggledWall(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row: number, col: number): void => {
    if (!mouseIsPressed) {
      return;
    }
    const newGrid = getNewGridWithToggledWall(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = (): void => {
    setMouseIsPressed(false);
  };

  const animateDijkstra = (
    visitedNodesInOrder: NodeType[],
    nodesInShortestPathOrder: NodeType[],
  ): void => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document
          .getElementById(`node-${node.row}-${node.col}`)
          ?.classList.add('node-visited');
      }, 10 * i);
    }
  };

  const visualizeDijkstra = (): void => {
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = Dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = GetNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const animateShortestPath = (nodesInShortestPathOrder: NodeType[]): void => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document
          .getElementById(`node-${node.row}-${node.col}`)
          ?.classList.add('node-shortest-path');
      }, 50 * i);
    }
  };

  return (
    <>
      <div className="btn-wrapper">
        <button className="btn" onClick={(): void => visualizeDijkstra()}>
          Visualize Dijkstra Algorithm
        </button>
        <h4 className="instruction">
          Click on the grid and hold to draw walls!
        </h4>
      </div>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div className="node-wrapper" key={rowIndex}>
            {row.map((node, nodeIndex) => {
              const { row, col, isStart, isFinish, isWall } = node;
              return (
                <Node
                  key={nodeIndex}
                  col={col}
                  isFinish={isFinish}
                  isStart={isStart}
                  isWall={isWall}
                  onMouseDown={(row, col): void => handleMouseDown(row, col)}
                  onMouseEnter={(row, col): void => handleMouseEnter(row, col)}
                  onMouseUp={(): void => handleMouseUp()}
                  row={row}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default DijkstraVisualizer;
