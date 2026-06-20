class LiveBoardCache {
    constructor() {
        this.liveBoardInfo = new Map();
        this.lastFetchTime = new Map();
        this.ttl = 1 * 60 * 1000; // 1 minute
    }

    async fetchLiveboardForStationId(stationId) {
        try {
            if (this.liveBoardInfo.has(stationId) && (Date.now() - this.lastFetchTime.get(stationId)) < this.ttl) {
                return this.liveBoardInfo.get(stationId);
            }
            const response = await fetch(`https://api.irail.be/liveboard/?id=${stationId}&format=json&lang=en`);
            const data = await response.json();
            this.liveBoardInfo.set(stationId, data);
            this.lastFetchTime.set(stationId, Date.now());
            return data;
        }
        catch (error) {
            console.error('Error fetching liveboard:', error);
            return null;
        }
    }   
}

const liveboardCache = new LiveBoardCache();
export default liveboardCache;
