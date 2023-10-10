import { useEffect, useState } from 'react';
import { getInitialGrid, getNewGridWithToggledWall } from '../grid/Grid';
import Node from '../node/Node';
import { Dijkstra, GetNodesInShortestPathOrder } from '@/algorithms/Dijkstra';
import type { Node as NodeType } from '../grid/Grid';
import '@/styles/feature/dijkstra_visualizer.css';
import { useSound } from '@/hooks/useSound';

const soundFile = 'public/sounds_effect/synthetic.mp3';

function DijkstraVisualizer(): React.ReactElement {
  const [grid, setGrid] = useState<NodeType[][]>([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isVisualizationStarted, setIsVisualizationStarted] = useState(false);
  const [startNode, setStartNode] = useState<NodeType | null>(null);
  const [finishNode, setFinishNode] = useState<NodeType | null>(null);
  const { play, stop, audioObject } = useSound(soundFile);

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

  /* I should go to jail for using useEffect like that
  I really wanna refactor this 
  1st choice is to nest each animation function under visualizeDijkstra
  or have a custom hook for the logic
  at the moment isVisualizationStarted is the safeGuard to avoid random play func trigger 
  */

  useEffect(() => {
    if (audioObject !== null && isVisualizationStarted) {
      const visitedNodesInOrder = Dijkstra(grid, startNode!, finishNode!);
      const nodesInShortestPathOrder = GetNodesInShortestPathOrder(finishNode!);
      animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }
  }, [audioObject, isVisualizationStarted]); // isVisualizationStarted is the safeGuard to avoid random play func trigger
  // and so even some dependencies are missing the safeguard should do the work
  const visualizeDijkstra = (): void => {
    if (startNode === null || finishNode === null) {
      return;
    }
    play();
    setIsVisualizationStarted(true); // avoid random play func trigger
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
    stop();
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
      stop();
    }, animationDuration);
    setIsVisualizationStarted(false);
  };

  const resetGrid = (): void => {
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
  };

  const clearAnimations = (): void => {
    const nodes = document.querySelectorAll(
      '.node-visited, .node-shortest-path',
    );
    nodes.forEach((node) => {
      node.classList.remove('node-visited', 'node-shortest-path');
    });
  };

  const resetAlgorithm = (): void => {
    clearAnimations();
    resetGrid();
    stop();
    setIsVisualizationStarted(false);
  };

  return (
    <>
      <div className="btn-wrapper">
        <button className="btn" onClick={(): void => visualizeDijkstra()}>
          Visualize Dijkstra Algorithm
        </button>
        <button
          className="btn"
          onClick={resetAlgorithm}
          disabled={isVisualizationStarted}
        >
          Reset
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
