import express from "express";
import departureRoute from "./routes/departure.js";
import stationCache from "./cache/stationCache.js";


async function main() {
    const app = express();
    app.use(express.json());
    const port = 3000;

    try {
        await stationCache.fetchStations();
    } catch (error) {
        console.error("Failed to fetch initial station cache:", error);
}

    app.get('/', (req, res) => {
        console.log("received request");
        res.send('Hello World!');
    });

    app.use(departureRoute);

    app.listen(port, (err) => {
        if (err) {
            console.error('Failed to start server:', err.message);
            return;
        }
        console.log(`Server is listening on port ${port}`);
    });

}

main();