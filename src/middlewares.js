import multer from "multer";

export const localsMiddleware = (req,res,next) => {
    // locals information is shared with pug
    // localsMiddleware should be after session middleware
   
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    // req.session.user could be undefined so add an empty object
    res.locals.loggedInUser = req.session.user || {};
    console.log(req.session.user); 
    next();
}

// people who didn't log in are not allowed to go to some pages
export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    }
    else {
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    }
    else {
        return res.redirect("/");
    }
};

// multer is middleware for handling multipart/form-data
export const avatarUpload = multer({
    dest: "uploads/avatars/", 
    limits: {
        fileSize: 30000000,
    },
}); 
export const videoUpload = multer({
    dest: "uploads/videos", 
    limits: {
        fileSize: 100000000,
    },
});