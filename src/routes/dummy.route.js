import express from 'express';
import { dummyProgressSuccess,dummyProgressFail } from '../controllers/dummy.controller.js';


export const dummyRoute = express.Router();


dummyRoute.get('/dummyProgressSuccess',async(req,res)=>{

    const result = await dummyProgressSuccess(req,res);
    
});
dummyRoute.get('/dummyProgressFail',async(req,res)=>{

    const result = await dummyProgressFail(req,res);
    
});




