import express from "express";
import departureRoute from "./routes/departure.js";

async function main() {
    const app = express();
    app.use(express.json());
    const port = 3000;


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