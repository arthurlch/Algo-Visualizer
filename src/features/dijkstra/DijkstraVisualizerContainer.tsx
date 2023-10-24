import { useEffect, useState } from 'react';
import { getInitialGrid, getNewGridWithToggledWall } from '../grid/Grid';
import { Dijkstra, GetNodesInShortestPathOrder } from '@/algorithms/Dijkstra';
import type { Node as NodeType } from '../grid/Grid';
import '@/styles/feature/dijkstra_visualizer.css';
import DijkstraVisualizerPresenter from './DijkstraVisualizerPresenter';

function DijkstraVisualizer(): React.ReactElement {
  const [grid, setGrid] = useState<NodeType[][]>([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isVisualizationStarted, setIsVisualizationStarted] = useState(false);
  const [startNode, setStartNode] = useState<NodeType | null>(null);
  const [finishNode, setFinishNode] = useState<NodeType | null>(null);

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

  const visualizeDijkstra = (): void => {
    if (startNode === null || finishNode === null) {
      return;
    }
    setIsVisualizationStarted(true);
  };

  useEffect(() => {
    if (isVisualizationStarted) {
      const visitedNodesInOrder = Dijkstra(grid, startNode!, finishNode!);
      const nodesInShortestPathOrder = GetNodesInShortestPathOrder(finishNode!);
      animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }
  }, [isVisualizationStarted]);

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

  const animateShortestPath = (nodesInShortestPathOrder: NodeType[]): void => {
    // Calculate total animation duration
    const animationDuration = 50 * nodesInShortestPathOrder.length;
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document
          .getElementById(`node-${node.row}-${node.col}`)
          ?.classList.add('node-shortest-path');
      }, 50 * i);
    }
    setTimeout(() => {
      setIsVisualizationStarted(false);
    }, animationDuration);
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
    setIsVisualizationStarted(false);
  };

  return (
    <DijkstraVisualizerPresenter
      grid={grid}
      handleMouseDown={handleMouseDown}
      handleMouseEnter={handleMouseEnter}
      handleMouseUp={handleMouseUp}
      visualizeDijkstra={visualizeDijkstra}
      resetAlgorithm={resetAlgorithm}
      isVisualizationStarted={isVisualizationStarted}
    />
  );
}

export default DijkstraVisualizer;
