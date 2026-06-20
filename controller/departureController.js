import stationCache from "../cache/stationCache.js";
import liveboardCache from "../cache/liveboardCache.js";

export const getDepartures = async (req, res, next) => {
    try {
        let stations = await stationCache.fetchStations();

        let matchingStations = stations.filter((station) => {
            return station.name.toLowerCase().includes(req.query.q.toLowerCase());
        });

        let liveboardPromises = matchingStations.map(async (station) => {
            const data = await liveboardCache.fetchLiveboardForStationId(station.id);
            return data;
        });

        let liveboard = await Promise.all(liveboardPromises);

        return liveboard;
    } catch (error) {
        next(error);
    }
}
