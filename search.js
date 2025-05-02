// Calculate straight-line distances between cities
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Heuristic distances dictionary
let heuristicDistances = {};

// Calculate straight-line distances for heuristic function
function updateHeuristicDistances(goalCity) {
    heuristicDistances = {}; // Reset
    
    const goalLat = cities[goalCity].lat;
    const goalLng = cities[goalCity].lng;

    for (const city in cities) {
        const cityLat = cities[city].lat;
        const cityLng = cities[city].lng;
        heuristicDistances[city] = calculateDistance(cityLat, cityLng, goalLat, goalLng);
    }
}

// Initialize with default goal
updateHeuristicDistances('Sokhumi');

// Iterative Deepening Depth-First Search (Bidirectional)
function runIDDFSBidirectional(startCity, goalCity) {
    // Special case: if start and end are the same
    if (startCity === goalCity) {
        return {
            path: [startCity],
            distance: 0,
            nodesVisited: 1,
            maxMemory: 1,
            executionTime: 0
        };
    }
    
    const start = performance.now();
    let maxDepth = 0;
    let result = null;
    let nodesVisited = 0;
    let maxMemory = 0;

    while (result === null) {
        const frontResult = {};
        const backResult = {};
        
        result = bidirectionalIDDFS(startCity, goalCity, maxDepth, frontResult, backResult);
        
        nodesVisited += frontResult.nodesVisited + backResult.nodesVisited;
        maxMemory = Math.max(maxMemory, frontResult.maxMemory + backResult.maxMemory);
        
        if (result === null) {
            maxDepth++;
            // Safety check to prevent infinite loops
            if (maxDepth > 30) {
                return {
                    path: ["No path found - cities might be disconnected"],
                    distance: 0,
                    nodesVisited,
                    maxMemory,
                    executionTime: performance.now() - start
                };
            }
        }
    }
    
    const end = performance.now();
    const executionTime = end - start;

    return {
        path: result.path,
        distance: result.distance,
        nodesVisited,
        maxMemory,
        executionTime
    };
}

function bidirectionalIDDFS(startCity, goalCity, maxDepth, frontResult, backResult) {
    // Forward search from start
    const frontierVisited = new Set();
    const frontierPath = {};
    const frontierDistance = {};
    frontierVisited.add(startCity);
    frontierPath[startCity] = [startCity];
    frontierDistance[startCity] = 0;
    
    // Backward search from goal
    const backwardVisited = new Set();
    const backwardPath = {};
    const backwardDistance = {};
    backwardVisited.add(goalCity);
    backwardPath[goalCity] = [goalCity];
    backwardDistance[goalCity] = 0;
    
    let frontNodesVisited = 0;
    let backNodesVisited = 0;
    let frontMaxMemory = 1;
    let backMaxMemory = 1;
    
    for (let depth = 0; depth <= maxDepth; depth++) {
        // Expand frontier (forward search)
        const frontierResult = expandFrontier(startCity, goalCity, depth, frontierVisited, frontierPath, frontierDistance, backwardVisited);
        frontNodesVisited += frontierResult.nodesVisited;
        frontMaxMemory = Math.max(frontMaxMemory, frontierResult.maxMemory);
        
        if (frontierResult.meetingPoint) {
            frontResult.nodesVisited = frontNodesVisited;
            frontResult.maxMemory = frontMaxMemory;
            backResult.nodesVisited = backNodesVisited;
            backResult.maxMemory = backMaxMemory;
            
            // Construct the complete path
            const frontPath = frontierPath[frontierResult.meetingPoint];
            const backPath = backwardPath[frontierResult.meetingPoint].slice(1).reverse();
            const completePath = [...frontPath, ...backPath];
            const totalDistance = frontierDistance[frontierResult.meetingPoint] + backwardDistance[frontierResult.meetingPoint];
            
            return {
                path: completePath,
                distance: totalDistance
            };
        }
        
        // Expand backward (backward search)
        const backwardResult = expandBackward(goalCity, startCity, depth, backwardVisited, backwardPath, backwardDistance, frontierVisited);
        backNodesVisited += backwardResult.nodesVisited;
        backMaxMemory = Math.max(backMaxMemory, backwardResult.maxMemory);
        
        if (backwardResult.meetingPoint) {
            frontResult.nodesVisited = frontNodesVisited;
            frontResult.maxMemory = frontMaxMemory;
            backResult.nodesVisited = backNodesVisited;
            backResult.maxMemory = backMaxMemory;
            
            // Construct the complete path
            const frontPath = frontierPath[backwardResult.meetingPoint];
            const backPath = backwardPath[backwardResult.meetingPoint].slice(1).reverse();
            const completePath = [...frontPath, ...backPath];
            const totalDistance = frontierDistance[backwardResult.meetingPoint] + backwardDistance[backwardResult.meetingPoint];
            
            return {
                path: completePath,
                distance: totalDistance
            };
        }
    }
    
    frontResult.nodesVisited = frontNodesVisited;
    frontResult.maxMemory = frontMaxMemory;
    backResult.nodesVisited = backNodesVisited;
    backResult.maxMemory = backMaxMemory;
    
    return null; // No path found within current depth limit
}

function expandFrontier(startCity, goalCity, depth, visited, paths, distances, oppositeVisited) {
    const result = {
        meetingPoint: null,
        nodesVisited: 0,
        maxMemory: 0
    };
    
    function dfs(city, currentDepth, path, distance) {
        result.nodesVisited++;
        result.maxMemory = Math.max(result.maxMemory, Object.keys(paths).length);
        
        if (currentDepth === depth) {
            // Check if this node has been visited from the opposite direction
            if (oppositeVisited.has(city)) {
                result.meetingPoint = city;
                return true;
            }
            return false;
        }
        
        for (const neighbor of adjacencyList[city]) {
            const nextCity = neighbor.city;
            if (!path.includes(nextCity)) {
                const newPath = [...path, nextCity];
                const newDistance = distance + neighbor.distance;
                
                paths[nextCity] = newPath;
                distances[nextCity] = newDistance;
                visited.add(nextCity);
                
                // Check if this node has been visited from the opposite direction
                if (oppositeVisited.has(nextCity)) {
                    result.meetingPoint = nextCity;
                    return true;
                }
                
                if (dfs(nextCity, currentDepth + 1, newPath, newDistance)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    for (const city of visited) {
        if (dfs(city, 0, paths[city], distances[city])) {
            return result;
        }
    }
    
    return result;
}

function expandBackward(goalCity, startCity, depth, visited, paths, distances, oppositeVisited) {
    const result = {
        meetingPoint: null,
        nodesVisited: 0,
        maxMemory: 0
    };
    
    function dfs(city, currentDepth, path, distance) {
        result.nodesVisited++;
        result.maxMemory = Math.max(result.maxMemory, Object.keys(paths).length);
        
        if (currentDepth === depth) {
            // Check if this node has been visited from the opposite direction
            if (oppositeVisited.has(city)) {
                result.meetingPoint = city;
                return true;
            }
            return false;
        }
        
        for (const neighbor of adjacencyList[city]) {
            const nextCity = neighbor.city;
            if (!path.includes(nextCity)) {
                const newPath = [...path, nextCity];
                const newDistance = distance + neighbor.distance;
                
                paths[nextCity] = newPath;
                distances[nextCity] = newDistance;
                visited.add(nextCity);
                
                // Check if this node has been visited from the opposite direction
                if (oppositeVisited.has(nextCity)) {
                    result.meetingPoint = nextCity;
                    return true;
                }
                
                if (dfs(nextCity, currentDepth + 1, newPath, newDistance)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    for (const city of visited) {
        if (dfs(city, 0, paths[city], distances[city])) {
            return result;
        }
    }
    
    return result;
}

// A* Search Algorithm
function runAStar(startCity, goalCity) {
    // Special case: if start and end are the same
    if (startCity === goalCity) {
        return {
            path: [startCity],
            distance: 0,
            nodesVisited: 1,
            maxMemory: 1,
            executionTime: 0
        };
    }
    
    const start = performance.now();
    
    // Update heuristics for the current goal
    updateHeuristicDistances(goalCity);
    
    // Priority queue implementation using a simple array
    const openSet = [{ city: startCity, priority: 0 }];
    const closedSet = new Set();
    
    // For tracking paths
    const cameFrom = {};
    
    // g_score[city] is the cost from start to city
    const gScore = {};
    gScore[startCity] = 0;
    
    // f_score[city] = g_score[city] + h(city)
    const fScore = {};
    fScore[startCity] = heuristicDistances[startCity];
    
    let nodesVisited = 0;
    let maxMemory = 1;
    
    while (openSet.length > 0) {
        // Find the node with the lowest f_score
        openSet.sort((a, b) => a.priority - b.priority);
        const current = openSet.shift().city;
        nodesVisited++;
        
        if (current === goalCity) {
            // Reconstruct path
            const path = reconstructPath(cameFrom, current);
            const distance = gScore[current];
            const end = performance.now();
            const executionTime = end - start;
            
            return {
                path,
                distance,
                nodesVisited,
                maxMemory,
                executionTime
            };
        }
        
        closedSet.add(current);
        
        // For each neighbor
        for (const neighbor of adjacencyList[current]) {
            const neighborCity = neighbor.city;
            
            if (closedSet.has(neighborCity)) {
                continue;
            }
            
            // Tentative g_score
            const tentativeGScore = gScore[current] + neighbor.distance;
            
            // Find if neighbor is in openSet
            const neighborInOpenSet = openSet.findIndex(item => item.city === neighborCity);
            const neighborNotInOpenSet = neighborInOpenSet === -1;
            
            if (neighborNotInOpenSet || tentativeGScore < gScore[neighborCity]) {
                // This path is the best until now
                cameFrom[neighborCity] = current;
                gScore[neighborCity] = tentativeGScore;
                fScore[neighborCity] = gScore[neighborCity] + heuristicDistances[neighborCity];
                
                if (neighborNotInOpenSet) {
                    openSet.push({ city: neighborCity, priority: fScore[neighborCity] });
                    maxMemory = Math.max(maxMemory, openSet.length + closedSet.size);
                }
            }
        }
    }
    
    // No path found
    return {
        path: ["No path found - cities might be disconnected"],
        distance: 0,
        nodesVisited,
        maxMemory,
        executionTime: performance.now() - start
    };
}

function reconstructPath(cameFrom, current) {
    const totalPath = [current];
    while (cameFrom[current]) {
        current = cameFrom[current];
        totalPath.unshift(current);
    }
    return totalPath;
}