import { useEffect, useState } from 'react';
import { getInitialGrid, getNewGridWithToggledWall } from '../grid/Grid';
import Node from '../node/Node';
import { Dijkstra, GetNodesInShortestPathOrder } from '@/algorithms/Dijkstra';
import type { Node as NodeType } from '../grid/Grid';
import '@/styles/feature/dijkstra_visualizer.css';
import { playSound } from '@/utils/play_sound';
import { stopSound } from '@/utils/stop_sound';

const soundFile = 'public/sounds_effect/synthetic.mp3';
const audio = playSound(soundFile);
console.log(audio);

function DijkstraVisualizer(): React.ReactElement {
  const [grid, setGrid] = useState<NodeType[][]>([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [startNode, setStartNode] = useState<NodeType | null>(null);
  const [finishNode, setFinishNode] = useState<NodeType | null>(null);
  const [audioObject, setAudioObject] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
    for (const row of initialGrid) {
      for (const node of row) {
        if (node.isStart) {
          setStartNode(node);
        }
        if (node.isFinish) {
          setFinishNode(node);
        }
      }
    }
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

  useEffect(() => {
    if (audioObject !== null) {
      const visitedNodesInOrder = Dijkstra(grid, startNode!, finishNode!);
      const nodesInShortestPathOrder = GetNodesInShortestPathOrder(finishNode!);
      animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }
  }, [audioObject]);

  const visualizeDijkstra = (): void => {
    if (startNode === null || finishNode === null) {
      return;
    }
    const audio = playSound(soundFile);
    setAudioObject(audio);
  };

  const animateDijkstra = (
    visitedNodesInOrder: NodeType[],
    nodesInShortestPathOrder: NodeType[],
  ): void => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          if (audioObject) {
            audioObject.pause();
            audioObject.currentTime = 0;
          }
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

  const animateShortestPath = (nodesInShortestPathOrder: NodeType[]): void => {
    console.log(audioObject);
    console.log('animateShortestPath called');
    stopSound(audioObject);
    const animationDuration = 50 * nodesInShortestPathOrder.length; // Calculate total animation duration
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document
          .getElementById(`node-${node.row}-${node.col}`)
          ?.classList.add('node-shortest-path');
      }, 50 * i);
    }
    setTimeout(() => {
      if (audioObject) {
        audioObject.pause();
        audioObject.currentTime = 0;
      }
    }, animationDuration);
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
