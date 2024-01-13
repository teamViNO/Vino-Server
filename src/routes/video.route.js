import express from "express";
import {videoInfoOrigin,videoInfoRev} from "../controllers/video.controller.js";


export const videoRoute = express.Router();

videoRoute.get('/:userID/:videoID/:version',async(req,res)=>{
    
        const result = await videoInfoOrigin(req,res);
    
    
    }
    
);




