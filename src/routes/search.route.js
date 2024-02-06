import express from 'express';
import {vidoeSearchKeyWord,vidoeSearchTag} from '../controllers/search.controller.js';

export const searchRoute = express.Router();

searchRoute.get('/keyword',async(req,res)=>{
    const result = await vidoeSearchKeyWord(req,res);

});

searchRoute.get('/hashtag',async(req,res)=>{
const result = await vidoeSearchTag(req,res);

});