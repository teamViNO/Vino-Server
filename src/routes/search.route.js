import express from 'express';
import {vidoeSearchKeyWord,vidoeSearchTag} from '../controllers/search.controller.js';

export const searchRoute = express.Router();

searchRoute.get('/keyword/:keywordName',async(req,res)=>{
    const result = await vidoeSearchKeyWord(req,res);

});

searchRoute.get('/hashtag/:hashtagName',async(req,res)=>{
const result = await vidoeSearchTag(req,res);

});