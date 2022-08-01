import { use } from "bcrypt/promises";
import express from "express";
import {edit,  
        logout,
        getEdit,
        postEdit,  
        see, 
        startGithubLogin, 
        finishGithubLogin,
        getChangePassword,
        postChangePassword,
        } 
        from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
        .route("/edit")
        .all(protectorMiddleware)
        .get(getEdit)
        .post(avatarUpload.single("avatar"), postEdit);  //order is important //avatar is input in the pug.

userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword)
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see); 

export default userRouter;
