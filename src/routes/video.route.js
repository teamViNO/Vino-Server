import express from "express";
import {videoInfo,videoInsert,videoSimpleInfo} from "../controllers/video.controller.js";


export const videoRoute = express.Router();

videoRoute.get('/:userID/:videoID/:version',async(req,res)=>{
    
        const result = await videoInfo(req,res);
    }
    
);
videoRoute.get('/:userID',async(req,res)=>{
    
    const result = await videoSimpleInfo(req,res);
}

);

videoRoute.post('/:userID/new-video',async(req,res)=>{
    const result = await videoInsert(req,res);
})




