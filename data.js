// Data structure for Georgian cities with coordinates (latitude, longitude)
const cities = {
    'Telavi': { lat: 41.9198, lng: 45.4713 },
    'Tbilisi': { lat: 41.7151, lng: 44.8271 },
    'Rustavi': { lat: 41.5495, lng: 45.0217 },
    'Gori': { lat: 41.9842, lng: 44.1158 },
    'Kutaisi': { lat: 42.2679, lng: 42.7153 },
    'Zugdidi': { lat: 42.5088, lng: 41.8709 },
    'Poti': { lat: 42.1462, lng: 41.6765 },
    'Batumi': { lat: 41.6459, lng: 41.6367 },
    'Sokhumi': { lat: 43.0015, lng: 41.0234 },
    'Akhaltsikhe': { lat: 41.6376, lng: 42.9826 },
    'Signagi': { lat: 41.6155, lng: 45.9227 },
    'Mtskheta': { lat: 41.8430, lng: 44.7172 },
    'Akhmeta': { lat: 42.0361, lng: 45.2075 },
    'Gurjaani': { lat: 41.7427, lng: 45.8003 },
    'Sagarejo': { lat: 41.7348, lng: 45.3315 },
    'Kaspi': { lat: 41.9249, lng: 44.4259 },
    'Khashuri': { lat: 41.9952, lng: 43.5991 },
    'Zestafoni': { lat: 42.1099, lng: 43.0591 },
    'Samtredia': { lat: 42.1534, lng: 42.3352 },
    'Senaki': { lat: 42.2714, lng: 42.0675 },
    'Ochamchire': { lat: 42.7118, lng: 41.4694 },
    'Gagra': { lat: 43.2786, lng: 40.2658 },
    // New cities
    'Ozurgeti': { lat: 41.9244, lng: 42.0176 },
    'Tskhinvali': { lat: 42.2277, lng: 43.9686 },
    'Borjomi': { lat: 41.8376, lng: 43.3889 },
    'Kobuleti': { lat: 41.8216, lng: 41.7747 },
    'Tianeti': { lat: 42.1073, lng: 44.9729 },
    'Lagodekhi': { lat: 41.8268, lng: 46.2767 },
    'Tsnori': { lat: 41.6209, lng: 46.0085 },
    'Kvareli': { lat: 41.9509, lng: 45.8173 },
    'Ambrolauri': { lat: 42.5150, lng: 43.1548 },
    'Oni': { lat: 42.5838, lng: 43.4425 },
    'Mestia': { lat: 43.0436, lng: 42.7298 },
    'Marneuli': { lat: 41.4764, lng: 44.8097 },
    'Bolnisi': { lat: 41.4474, lng: 44.5536 },
    'Tsalka': { lat: 41.5955, lng: 44.0894 },
    'Ninotsminda': { lat: 41.2653, lng: 43.5917 },
    'Dusheti': { lat: 42.0846, lng: 44.7034 },
    'Kazbegi': { lat: 42.6575, lng: 44.6417 },
    'Tskaltubo': { lat: 42.3215, lng: 42.5977 },
    'Sachkhere': { lat: 42.3464, lng: 43.4208 },
    'Chiatura': { lat: 42.2981, lng: 43.2995 },
    'Abasha': { lat: 42.2000, lng: 42.2167 },
    'Tserovani': { lat: 41.8701, lng: 44.6393 },
    'Akhalkalaki': { lat: 41.4051, lng: 43.4861 },
    'Dedoplistskaro': { lat: 41.4680, lng: 46.1026 },
    'Tkibuli': { lat: 42.3512, lng: 42.9949 }
};

// Road connections between cities with distances in kilometers
const connections = [
    { from: 'Telavi', to: 'Tbilisi', distance: 80 },
    { from: 'Telavi', to: 'Akhmeta', distance: 30 },
    { from: 'Telavi', to: 'Gurjaani', distance: 25 },
    { from: 'Telavi', to: 'Sagarejo', distance: 45 },
    { from: 'Telavi', to: 'Kvareli', distance: 40 },
    { from: 'Tbilisi', to: 'Rustavi', distance: 25 },
    { from: 'Tbilisi', to: 'Mtskheta', distance: 20 },
    { from: 'Tbilisi', to: 'Sagarejo', distance: 50 },
    { from: 'Tbilisi', to: 'Marneuli', distance: 35 },
    { from: 'Tbilisi', to: 'Tserovani', distance: 30 },
    { from: 'Mtskheta', to: 'Kaspi', distance: 30 },
    { from: 'Mtskheta', to: 'Dusheti', distance: 45 },
    { from: 'Mtskheta', to: 'Tserovani', distance: 15 },
    { from: 'Kaspi', to: 'Gori', distance: 20 },
    { from: 'Gori', to: 'Khashuri', distance: 40 },
    { from: 'Gori', to: 'Tskhinvali', distance: 30 },
    { from: 'Gori', to: 'Borjomi', distance: 65 },
    { from: 'Khashuri', to: 'Zestafoni', distance: 60 },
    { from: 'Khashuri', to: 'Borjomi', distance: 30 },
    { from: 'Zestafoni', to: 'Kutaisi', distance: 25 },
    { from: 'Zestafoni', to: 'Chiatura', distance: 35 },
    { from: 'Chiatura', to: 'Sachkhere', distance: 20 },
    { from: 'Kutaisi', to: 'Samtredia', distance: 30 },
    { from: 'Kutaisi', to: 'Tskaltubo', distance: 10 },
    { from: 'Kutaisi', to: 'Tkibuli', distance: 40 },
    { from: 'Samtredia', to: 'Senaki', distance: 40 },
    { from: 'Samtredia', to: 'Abasha', distance: 25 },
    { from: 'Senaki', to: 'Zugdidi', distance: 30 },
    { from: 'Zugdidi', to: 'Ochamchire', distance: 70 },
    { from: 'Zugdidi', to: 'Mestia', distance: 135 },
    { from: 'Ochamchire', to: 'Sokhumi', distance: 35 },
    { from: 'Sokhumi', to: 'Gagra', distance: 80 },
    { from: 'Signagi', to: 'Gurjaani', distance: 20 },
    { from: 'Signagi', to: 'Tsnori', distance: 25 },
    { from: 'Signagi', to: 'Dedoplistskaro', distance: 40 },
    { from: 'Gurjaani', to: 'Sagarejo', distance: 40 },
    { from: 'Akhmeta', to: 'Gurjaani', distance: 45 },
    { from: 'Akhmeta', to: 'Tianeti', distance: 70 },
    { from: 'Kutaisi', to: 'Batumi', distance: 120 },
    { from: 'Senaki', to: 'Poti', distance: 40 },
    { from: 'Poti', to: 'Batumi', distance: 70 },
    { from: 'Khashuri', to: 'Akhaltsikhe', distance: 80 },
    { from: 'Batumi', to: 'Akhaltsikhe', distance: 100 },
    { from: 'Batumi', to: 'Kobuleti', distance: 25 },
    { from: 'Ozurgeti', to: 'Kobuleti', distance: 35 },
    { from: 'Ozurgeti', to: 'Samtredia', distance: 60 },
    { from: 'Gurjaani', to: 'Kvareli', distance: 30 },
    { from: 'Kvareli', to: 'Lagodekhi', distance: 45 },
    { from: 'Tsnori', to: 'Lagodekhi', distance: 35 },
    { from: 'Tsnori', to: 'Dedoplistskaro', distance: 30 },
    { from: 'Borjomi', to: 'Akhaltsikhe', distance: 45 },
    { from: 'Akhaltsikhe', to: 'Akhalkalaki', distance: 60 },
    { from: 'Akhalkalaki', to: 'Ninotsminda', distance: 30 },
    { from: 'Akhalkalaki', to: 'Tsalka', distance: 70 },
    { from: 'Tsalka', to: 'Bolnisi', distance: 60 },
    { from: 'Bolnisi', to: 'Marneuli', distance: 25 },
    { from: 'Marneuli', to: 'Rustavi', distance: 35 },
    { from: 'Dusheti', to: 'Tianeti', distance: 45 },
    { from: 'Dusheti', to: 'Kazbegi', distance: 60 },
    { from: 'Ambrolauri', to: 'Oni', distance: 30 },
    { from: 'Ambrolauri', to: 'Sachkhere', distance: 70 },
    { from: 'Ambrolauri', to: 'Tkibuli', distance: 60 },
    { from: 'Oni', to: 'Mestia', distance: 120 }
];

// Make connections bidirectional
const bidirectionalConnections = [...connections];
for (const conn of connections) {
    bidirectionalConnections.push({
        from: conn.to,
        to: conn.from,
        distance: conn.distance
    });
}

// Create adjacency list representation for easier access
const adjacencyList = {};
for (const city in cities) {
    adjacencyList[city] = [];
}

for (const conn of bidirectionalConnections) {
    const { from, to, distance } = conn;
    adjacencyList[from].push({ city: to, distance });
}