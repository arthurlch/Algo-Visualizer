
# Dijkstra's Algorithm 

## Sources

- [Wikipedia: Dijkstra's Algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)
- [LevelUp: Finding the Shortest Path in JavaScript](https://levelup.gitconnected.com/finding-the-shortest-path-in-javascript-dijkstras-algorithm-8d16451eea34)

## Algorithm Explanation

Dijkstra's Algorithm is a graph search algorithm that solves the single-source shortest path problem for a weighted graph, producing a shortest path tree. This algorithm exists in various variants; Dijkstra's original variant found the shortest path between two nodes, but a more common variant fixes a single node as the "source" node and finds the shortest paths from the source node to all other nodes in the graph.

### Steps

1. Assign a tentative distance value to every node: set it to zero for our initial node and to infinity for all other nodes.
2. Set the initial node as current and mark it visited.
3. Consider all unvisited neighbors of the current node and calculate their tentative distances.
4. If the newly calculated tentative distance for a node is less than the current assigned value, update the shortest distance.
5. Once we've considered all unvisited neighbors of the current node, mark the current node as visited. A visited node will not be checked again.
6. If the destination node has been marked visited or if the smallest tentative distance among the nodes in the unvisited set is infinity, then stop. The algorithm has finished.

## Code Structure

- `dijkstra()`: The main function where the algorithm is implemented.
- `sortNodesByDistance()`: Sorts unvisited nodes by their distance.
- `updateUnvisitedNeighbors()`: Updates distances of unvisited neighboring nodes.
- `getUnvisitedNeighbors()`: Returns unvisited neighboring nodes.
- `getAllNodes()`: Returns all nodes from the grid.
- `getNodesInShortestPathOrder()`: Backtracks from the finish node to find the shortest path.

