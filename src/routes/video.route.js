import express from "express";
import {videoInfo,videoInsert,videoSimpleInfo,videoDelete, videoUpdate,vidoeSelectDelete, getEntireTag} from "../controllers/video.controller.js";
import {videoCategoryInfo,getRecentVideo,dummyVideoRead,summaryInsert,summaryDelete} from "../controllers/video.controller.js"

export const videoRoute = express.Router();

videoRoute.get('/:videoId/:version',async(req,res)=>{
    
        const result = await videoInfo(req,res);
    }
    
);
videoRoute.get('/',async(req,res)=>{
    
    const result = await videoSimpleInfo(req,res);
}

);
videoRoute.get('/tag',async(req,res)=>{
    const result =await getEntireTag(req,res);
})
videoRoute.get('/recent',async(req,res)=>{
    const result =await getRecentVideo(req,res);
})
videoRoute.get('/:categoryId',async(req,res)=>{
    const result = await videoCategoryInfo(req,res);
})
videoRoute.post('/new-video',async(req,res)=>{
    const result = await videoInsert(req,res);
})

videoRoute.delete('/:videoId/del',async(req,res)=>{
    console.log("갑니당");
    const result = await videoDelete(req,res);
})
videoRoute.post('/:videoId/newSummary',async(req,res)=>{
    const result = await summaryInsert(req,res);
})
videoRoute.delete('/:summaryId/deleteSummary',async(req,res)=>{
    const result=await summaryDelete(req,res);
})

videoRoute.patch('/:videoId',async(req,res)=>{
    const result =await videoUpdate(req,res);
})

videoRoute.delete('/selectDelete',async(req,res)=>{
    const result = await vidoeSelectDelete(req,res);
})

videoRoute.post('/dummyVideos/:videoId/setRead',async(req,res)=>{
    const result = await dummyVideoRead(req,res);
})