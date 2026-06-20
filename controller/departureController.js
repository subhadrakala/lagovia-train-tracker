import stationCache from "../cache/stationCache.js";


export const getDepartures = async (req, res, next) => {
    try {
        let stations = await stationCache.fetchStations();

        let matchingStations = stations.filter((station) => {
            return station.name.toLowerCase().includes(req.query.q.toLowerCase());
        });
        return matchingStations;


    } catch (error) {
        next(error);
    }
}
