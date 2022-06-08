import mongoose from "mongoose";

console.log(process.env.DB_URL);

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useFindAndModify: false,
    //useCreateIndex: true,
});

const db = mongoose.connection;

const handleError = () => console.log("DB Error", error);
const handleOpen = () => console.log("Connected to DB");

db.on("error", handleError);
db.once("open", handleOpen);

// CRUD (create, read, upload, delete)

