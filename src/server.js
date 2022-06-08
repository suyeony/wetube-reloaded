// only server configuration
import express, { Router } from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import req from "express/lib/request";
import { localsMiddleware } from "./middlewares";
import { mongo } from "mongoose";


//broswer requests a page to a server!
//The server response 

// express application
const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

console.log(process.env.COOKIE_SECRET);

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL}),
    })
);


//controller
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));     //expose files in the folder to users
app.use("/", rootRouter); 
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
//middleware use 'next' it is controller

//configure our application

//GET - http method
//A browser request a website and get it for you
