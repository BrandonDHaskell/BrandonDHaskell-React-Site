import express, { Request, Response } from "express";
import path from "path";

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const PORT: number | string = process.env.PORT || 3001;

const app = express();
app.use(express.urlencoded({ extended : true }));

// Serve my static web page
app.use(express.static(path.join(__dirname, "../../client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        })
    } catch (err) {
        console.log("Error starting server");
        console.log(err);
    }
}

startServer();