import Video from "../models/Video";
import User from "../models/User";
/*
console.log("start");
Video.find({}, (error, videos) => {
    if (error)  
        return res.render("sever-error");
    }
    return res.render("home", { pageTitle: "Home", videos: [] });
);
console.log("finish");
*/
export const home = async(req, res) => {
    
    //console.log("start") // 1
    const videos = await Video.find({}).sort({createdAt: "desc"}); /////wait until we get a result from the db
    //console.log(videos);  2
    //console.log("finish");  3
     return res.render("home", { pageTitle: "Home", videos });
   

};
export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    console.log(video);     //it keeps showing new ObjectId(...) 
    
    const owner = await User.findById(video.owner);
    if (!video) {
        return res.render("404", {pageTitle: "Video not found."} ); 
    }
    return res.render("watch", { pageTitle: video.title, video});
};

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.render("404", {pageTitle: "Video not found."} ); 
    }
    return res.render("edit", { pageTitle: `Edit ${video.title}`, video});
};

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const {title, description, hashtags} = req.body;
    const video = await Video.exists({_id: id});
    console.log(req.body);  
    if (!video) {
        return res.status(404).render("404", {pageTitle: "Video not found."} ); 
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    }) 
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload video"});
};

export const postUpload = async(req, res) => {
    const {
        user: { _id },
    } = req.session;
    const {path: fileUrl}= req.file;        // power of ES6
    const {title, description, hashtags} = req.body;
    console.log(req.body);  
    try {
        await Video.create({
            title,
            description,
            fileUrl,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags),
            
        }); 
    // waiting for video to be saved in the db 
    //await video.save();
    // here we will add a video to the videos array
        return res.redirect("/");
    } catch(error){ 
        return res.status(400).render("upload", { 
            pageTitle: "Upload video", 
            errorMessage: error._message
        });
    }
};

export const deleteVideo = async(req,res) => {
    const { id } = req.params;
    console.log(id);
    //delete video
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}

export const search = async(req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        // search
        videos = await Video.find({
            title: {
                $regex: new RegExp(`${keyword}$`, "i"),     
            },
        });
        console.log(videos);
    }
    return res.render("search", { pageTitle:"Search", videos });
};


 