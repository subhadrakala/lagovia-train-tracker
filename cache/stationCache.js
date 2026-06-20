class StationCache {
    constructor() {
        this.stations = null;
        this.lastFetchTime = null;
        this.ttl = 86400000; // 24 hours
    }
    async fetchStations() {
        try {
            if (!this.stations || (Date.now() - this.lastFetchTime) > this.ttl) {
                const response = await fetch('https://api.irail.be/stations/?format=json&lang=en');
                const data = await response.json();
                this.stations = data.station;
                this.lastFetchTime = Date.now();
            }
            return this.stations;
        }
        catch (error) {
            console.error('Error fetching stations:', error);
            return [];
        }
    }
}

const stationCache = new StationCache();
export default stationCache;
