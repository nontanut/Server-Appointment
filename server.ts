import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import cors from "cors";

const createConnection = require("./config/db");
const sql = createConnection();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Connect sql with req
app.use(function (req: any) {
  req.sql = sql;
  req.next();
});

// Require Routes
import createRouter from "./routes/form";
import dataRouter from "./routes/form";
import branchesRotuer from "./routes/branch";
import checkRouter from "./routes/form";

// Routes
app.use(createRouter);
app.use(dataRouter);
app.use(branchesRotuer);
app.use(checkRouter);

// Port
const port = process.env.PORT;
app.listen(port, () => console.log(`start server in port ${port}`));
