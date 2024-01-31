import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import {viewSearchKeyword,viewSearchTag}from "../services/search.service.js";
import  jwt  from "jsonwebtoken";

export const vidoeSearchKeyWord= async (req,res)=>{
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    console.log("키워드 검색을 요청하셨습니다");
    const data={
        "userId":req.userId,
        "keyword":req.body.keyword
    };
    console.log(data);
    res.send(response(status.SUCCESS,await viewSearchKeyword(data)));
}

export const vidoeSearchTag = async (req, res)=>{
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    console.log("태그 검색을 요청하셨습니다");
    const data={
        "userId":req.userId,
        "hashtag":req.body.hashtag
    };
    res.send(response(status.SUCCESS,await viewSearchTag(data)));

}