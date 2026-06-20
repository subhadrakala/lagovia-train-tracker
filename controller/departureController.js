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

        let liveboardinfo = {};

        liveboard.forEach((item) => {
            if (item.departures && item.departures.number > 0) {
                let departureList = [];
                let departures = item.departures.departure;
                departures.forEach(departure => {
                    if ((departure.time * 1000) < (Date.now() + 15 * 60 * 1000)) {
                        const time = new Date(departure.time * 1000).toLocaleTimeString('en-BE', { timeStyle: 'short', timeZone: 'Europe/Brussels' });
                        departureList.push({
                            stationId: item.stationinfo.id,
                            stationName: item.stationinfo.standardname,
                            train: departure.vehicleinfo.shortname,
                            destination: departure.station,
                            departureTime: time,
                            cancelled: departure.canceled == "0" ? false : true,
                            delay: parseInt(departure.delay, 10) / 60
                        });
                    }
                });
                liveboardinfo[item.stationinfo.standardname] = departureList;
            }
        });

        return liveboardinfo;
    } catch (error) {
        next(error);
    }
}
