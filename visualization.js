// Initialize Leaflet map
let map = L.map('map').setView([42.3154, 43.3569], 8); // Center of Georgia

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Variables to store the currently selected cities
let currentStartCity = 'Telavi';
let currentEndCity = 'Sokhumi';

// Populate city dropdowns
const startCitySelect = document.getElementById('startCity');
const endCitySelect = document.getElementById('endCity');

// Helper function to populate a dropdown
function populateDropdown(dropdown, selectedCity) {
    // Clear existing options
    dropdown.innerHTML = '';
    
    Object.keys(cities).sort().forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        if (city === selectedCity) {
            option.selected = true;
        }
        dropdown.appendChild(option);
    });
}

// Initial dropdown population
populateDropdown(startCitySelect, currentStartCity);
populateDropdown(endCitySelect, currentEndCity);

// Add city markers
const cityMarkers = {};
for (const city in cities) {
    const { lat, lng } = cities[city];
    const marker = L.marker([lat, lng])
        .bindPopup(`<b>${city}</b>`)
        .addTo(map);
    
    cityMarkers[city] = marker;
}

// Function to update marker icons based on selected start and end cities
function updateMarkerIcons() {
    // Reset all markers
    for (const city in cityMarkers) {
        cityMarkers[city].setIcon(L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        }));
    }
    
    // Highlight start city
    cityMarkers[currentStartCity].setIcon(L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #1e90ff; 
               width: 15px; height: 15px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    }));
    
    // Highlight end city
    cityMarkers[currentEndCity].setIcon(L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #ff4500; 
               width: 15px; height: 15px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    }));
}

// Initialize marker icons
updateMarkerIcons();

// Draw connections between cities
const connectionLines = [];
for (const conn of connections) {
    const { from, to, distance } = conn;
    const fromCity = cities[from];
    const toCity = cities[to];
    
    const line = L.polyline([[fromCity.lat, fromCity.lng], [toCity.lat, toCity.lng]], {
        color: 'gray',
        weight: 2,
        opacity: 0.5
    }).bindPopup(`${from} to ${to}: ${distance} km`);
    
    connectionLines.push(line);
    line.addTo(map);
}

// Variables to store highlighted paths
let iddfsPathLines = [];
let astarPathLines = [];

// Function to highlight a path on the map
function highlightPath(path, color) {
    const pathLines = [];
    
    // Handle error message path
    if (path.length === 1 && typeof path[0] === 'string' && path[0].startsWith('No path found')) {
        alert(path[0]);
        return pathLines;
    }
    
    for (let i = 0; i < path.length - 1; i++) {
        const fromCity = cities[path[i]];
        const toCity = cities[path[i + 1]];
        
        const line = L.polyline([[fromCity.lat, fromCity.lng], [toCity.lat, toCity.lng]], {
            color: color,
            weight: 5,
            opacity: 0.8
        }).bindPopup(`${path[i]} to ${path[i + 1]}`);
        
        pathLines.push(line);
        line.addTo(map);
    }
    
    // Fit the map to show the entire path
    if (path.length > 1) {
        const pathPoints = path.map(city => [cities[city].lat, cities[city].lng]);
        map.fitBounds(L.latLngBounds(pathPoints));
    }
    
    return pathLines;
}

// Function to clear highlighted paths
function clearHighlightedPaths() {
    [...iddfsPathLines, ...astarPathLines].forEach(line => {
        if (map.hasLayer(line)) {
            map.removeLayer(line);
        }
    });
    iddfsPathLines = [];
    astarPathLines = [];
    
    // Reset the result displays
    document.getElementById('iddfsPath').textContent = '';
    document.getElementById('iddfsDistance').textContent = '';
    document.getElementById('iddfsTimeComplexity').textContent = '';
    document.getElementById('iddfsSpaceComplexity').textContent = '';
    document.getElementById('iddfsExecutionTime').textContent = '';
    
    document.getElementById('astarPath').textContent = '';
    document.getElementById('astarDistance').textContent = '';
    document.getElementById('astarTimeComplexity').textContent = '';
    document.getElementById('astarSpaceComplexity').textContent = '';
    document.getElementById('astarExecutionTime').textContent = '';
}

// Event listener for start city change
startCitySelect.addEventListener('change', function() {
    clearHighlightedPaths();
    currentStartCity = this.value;
    
    // Prevent same city for start and end
    if (currentStartCity === currentEndCity) {
        // Find the next city in alphabetical order that isn't the current start city
        const cityNames = Object.keys(cities).sort();
        let newEndCity = cityNames[0];
        for (const city of cityNames) {
            if (city !== currentStartCity) {
                newEndCity = city;
                break;
            }
        }
        endCitySelect.value = newEndCity;
        currentEndCity = newEndCity;
    }
    
    updateMarkerIcons();
});

// Event listener for end city change
endCitySelect.addEventListener('change', function() {
    clearHighlightedPaths();
    currentEndCity = this.value;
    
    // Prevent same city for start and end
    if (currentStartCity === currentEndCity) {
        // Find the next city in alphabetical order that isn't the current end city
        const cityNames = Object.keys(cities).sort();
        let newStartCity = cityNames[0];
        for (const city of cityNames) {
            if (city !== currentEndCity) {
                newStartCity = city;
                break;
            }
        }
        startCitySelect.value = newStartCity;
        currentStartCity = newStartCity;
    }
    
    updateMarkerIcons();
});

// Event listeners for buttons
document.getElementById('runIDDFS').addEventListener('click', function() {
    // Clear previous results
    clearHighlightedPaths();
    
    try {
        // Run IDDFS Bidirectional search
        const startCity = currentStartCity;
        const endCity = currentEndCity;
        console.log(`Running IDDFS from ${startCity} to ${endCity}`);
        const result = runIDDFSBidirectional(startCity, endCity);
        
        // Display results
        document.getElementById('iddfsPath').textContent = Array.isArray(result.path) ? result.path.join(' → ') : result.path;
        document.getElementById('iddfsDistance').textContent = result.distance.toFixed(2);
        document.getElementById('iddfsTimeComplexity').textContent = `O(b^(d/2)) - Nodes visited: ${result.nodesVisited}`;
        document.getElementById('iddfsSpaceComplexity').textContent = `O(d) - Max memory: ${result.maxMemory}`;
        document.getElementById('iddfsExecutionTime').textContent = result.executionTime.toFixed(2);
        
        // Highlight path on the map
        iddfsPathLines = highlightPath(result.path, '#1e90ff');
    } catch (error) {
        console.error("Error in IDDFS:", error);
        alert(`Error in IDDFS: ${error.message}`);
    }
});

document.getElementById('runAStar').addEventListener('click', function() {
    // Clear previous results
    clearHighlightedPaths();
    
    try {
        // Run A* search
        const startCity = currentStartCity;
        const endCity = currentEndCity;
        console.log(`Running A* from ${startCity} to ${endCity}`);
        const result = runAStar(startCity, endCity);
        
        // Display results
        document.getElementById('astarPath').textContent = Array.isArray(result.path) ? result.path.join(' → ') : result.path;
        document.getElementById('astarDistance').textContent = result.distance.toFixed(2);
        document.getElementById('astarTimeComplexity').textContent = `O(b^d) - Nodes visited: ${result.nodesVisited}`;
        document.getElementById('astarSpaceComplexity').textContent = `O(b^d) - Max memory: ${result.maxMemory}`;
        document.getElementById('astarExecutionTime').textContent = result.executionTime.toFixed(2);
        
        // Highlight path on the map
        astarPathLines = highlightPath(result.path, '#ff4500');
    } catch (error) {
        console.error("Error in A*:", error);
        alert(`Error in A*: ${error.message}`);
    }
});

document.getElementById('clearMap').addEventListener('click', clearHighlightedPaths);

// Initialize the map with default paths
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    // Wait a bit for the map to initialize properly
    setTimeout(function() {
        console.log("Running initial algorithms");
        // Run both algorithms with the default cities
        document.getElementById('runIDDFS').click();
        setTimeout(function() {
            document.getElementById('runAStar').click();
        }, 1000);
    }, 1500);
});