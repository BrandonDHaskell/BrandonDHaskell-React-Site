import express, { Request, Response } from "express";

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const PORT: number | string = process.env.PORT || 3001;

const app = express();
app.use(express.urlencoded({ extended : true }));

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server running on port: {PORT}`);
        })
    } catch (err) {
        console.log("Error starting server");
        console.log(err);
    }
}