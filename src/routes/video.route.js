import express from "express";
import {videoInfo,videoInsert,videoSimpleInfo,videoDelete, videoUpdate,vidoeSelectDelete} from "../controllers/video.controller.js";


export const videoRoute = express.Router();

videoRoute.get('/:videoID/:version',async(req,res)=>{
    
        const result = await videoInfo(req,res);
    }
    
);
videoRoute.get('/',async(req,res)=>{
    
    const result = await videoSimpleInfo(req,res);
}

);

videoRoute.post('/new-video',async(req,res)=>{
    const result = await videoInsert(req,res);
})

videoRoute.delete('/:videoID/del',async(req,res)=>{
    console.log("갑니당");
    const result = await videoDelete(req,res);
})

videoRoute.patch('/:videoID',async(req,res)=>{
    const result =await videoUpdate(req,res);
})

videoRoute.delete('/selectDelete',async(req,res)=>{
    const result = await vidoeSelectDelete(req,res);
})
