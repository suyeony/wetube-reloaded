import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import session from "express-session";
//import userRouter from "../routers/userRouter";

export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
}
export const postJoin = async (req, res) =>
{
    //console.log(req.body);
    const {name, username, email, password, password2, location} = req.body;
    const exists = await User.exists({ $or: [{ username}, {email}, ] });
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match."
        })
    }
    if (exists) {
        return res.status(400).render("join", { 
            pageTitle,  
            errorMessage: "This username/email is already taken.",
        });
    }
    try {
        await User.create({
            name, 
            username, 
            email, 
            password, 
            location
        })
        return res.redirect("/login");
    } catch(error) {
        return res.status(400).render("join", { 
            pageTitle: "Upload video", 
            errorMessage: error._message
        });
    }
};

export const getLogin = (req, res) => 
    res.render("login", {pageTitle: "Login"});

export const postLogin = async(req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username, socialOnly: false});
    const pageTitle = "Login";
    // check if account exists
    if (!user) {
        return res.status(400).render("login", {
        pageTitle, 
        errorMessage: "An account with this username does not exist.",
        });
    }
        
    // check if password is correct
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) {
        return res.status(400).render("login", {
            pageTitle, 
            errorMessage: "Wrong password",
            });
    }

    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");

}
//"https://github.com/login/oauth/authorize?client_id=17b93a12ce9d0bf9c0df&allow_signup=false&scope=read:user"

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        //client_id: process.env.GH_CLIENT,
        client_id: "17b93a12ce9d0bf9c0df",
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    //console.log(finalUrl);
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    }
    //console.log(config);
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json(); 
    // access token is needed when we interact with github api 
    if ("access_token" in tokenRequest) {
        // access api
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        // request user profile with access token
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        //console.log(userData);   
        // request email api with access token
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        //console.log(emailData);
        
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if (!emailObj) {
            // set notification (let users know logged in with github )
            return res.redirect("/login");
        }
        
        let user = await User.findOne({email: emailObj.email });
        if (!user) {
            // if we can't find a user, create an account
            user = await User .create({
                avatarUrl: userData.avatar_url,
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true, 
                location: userData.location,
            });
        }     
        // log user in
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
    } 
    
    else {
        return res.redirect("/login");
    }
    
};
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
}
export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile",});
}
export const postEdit = async (req, res) => {
    const { 
        session: {
            user: {_id, avatarUrl}, //avatarUrl in db user
        },
        body: {name, email, username, location },
        file,   
    } = req;
    //console.log(path);
    //console.log(file);
    const updatedUser = await User.findByIdAndUpdate(_id,{
        avatarUrl: file ? file.path : avatarUrl,    // sometimes we won't change avatar file
        name, 
        email, 
        username, 
        location
    },
    {new: true}
    );
    //code challenge: what if updated information already exists?
    //we can't update with existing username or email
    const loggedInUserUsername = res.locals.loggedInUser.username;
    const loggedInUserEmail = res.locals.loggedInUser.email;
    const exists = await User.exists({ $or: [{ username}, {email}, ] });
    if (exists && username !== loggedInUserUsername) {
        return res.status(400).render("edit-profile", {
            pageTitle: "Edit Profile",
            errorMessage: "This username is already taken.",
        });
    }
    else if (exists && email !== loggedInUserEmail) {
        return res.status(400).render("edit-profile", {
            pageTitle: "Edit Profile",
            errorMessage: "This email is already taken.",
        });
    }
    return res.redirect("/users/edit");
}


export const edit = (req, res) => res.send("Edit User");

export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        return res.redirect("/");
    }
    return res.render("users/change-password", { pageTitle: "Change Password" })
};
export const postChangePassword = async (req, res) => {
    const { 
        session: {
            user: {_id, password } ,
        },
        body: { oldPassword, newPassword, newPasswordConfirmation },
    } = req;
    // Compare the password user sent with the form and the password in the session
    const ok = await bcrypt.compare(oldPassword, password);
    if (!ok) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The current password is incorrect",
        });
    }
    if (newPassword !== newPasswordConfirmation) {
        return res.status(400).render("users/change-password", { 
            pageTitle: "Change Password", 
            errorMessage: "The password does not match the confirmation", 
            });
    }
    const user = await User.findById(_id);
    //console.log("Old password", user.password);
    user.password = newPassword;
    //console.log("New unhashed pw", user.password);
    await user.save();  //trigger to hash password
    //console.log("New hashed pw", user.password);
    //update session password
    req.session.user.password = user.password;
    // send notification 
    return res.redirect("/users/logout");
}; 

//getting userid in public
export const see = async(req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user) {
    }
    return res.render("users/profile",
         {pageTitle: `${user.name}의 Profile`, 
         user,
    })
};
 