//category.controller.js

import dotenv from "dotenv";

import jwt from 'jsonwebtoken'
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { getCategoryService,addCategory1Service,addCategory2Service,renameCategoryService,deleteCategoryService } from "../services/category.service.js";
import { move1CategoryService,move2CategoryService,move3CategoryService,move4CategoryService } from "../services/category.service.js";

// 카테고리 전체 조회
export const getCategoryData= async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.id;

        console.log("카테고리 전체 정보 조회 요청");
        const data = req.userID;
        console.log("컨트롤러 요청정보",data);
        const result = await getCategoryService(data)
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error(error);
        res.send(response(status.BAD_REQUEST));
    }
}

// 상위 카테고리 추가
export const addCategory1Data= async (req,res,next)=>{
    try{
        console.log("상위 카테고리 추가 요청");
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.id;

        const result = await addCategory1Service(req);
        res.send(response(status.SUCCESS, result));
    } catch(error){
        console.error(error);
    }
}

// 하위 카테고리 추가
export const addCategory2Data= async (req,res,next)=>{
    try{
        console.log("하위 카테고리 추가 요청");
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.id;

        const result = await addCategory2Service(req);
        res.send(response(status.SUCCESS, result));
    } catch(error){
        console.error(error);
    }
}

// 카테고리 수정
export const renameCategoryData = async (req, res) => {
    try {
        console.log("카테고리 이름 수정 요청");
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.id;

        const result = await renameCategoryService(req);
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error(error);
    }
};

// 카테고리 삭제
export const deleteCategoryData = async (req, res) => {
    try {
        console.log("카테고리 삭제 요청");
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.id;
        
        await deleteCategoryService(req);
        res.send(response(status.SUCCESS,"카테고리가 삭제되었습니다."));
    } catch (error) {
        console.error(error);
    }
};

// 카테고리 이동4 (상위가 다른 상위의 하위와 합쳐질 때)
export const move4CategoryData = async (req, res, next) => {
    try {
        console.log("카테고리 이동4 요청");
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.id;

        const result = await move4CategoryService(req);
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error(error);
    }
}

// 카테고리 이동1 (하위의 상위 카테고리가 변경될 때)
export const move1CategoryData = async (req, res, next) => {
    try {
        console.log("카테고리 이동1 요청");
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.id;

        const result = await move1CategoryService(req);
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error(error);
    }
}

// 카테고리 이동2 (하위가 새로운 상위가 될 때)
export const move2CategoryData = async (req, res, next) => {
    try {
        console.log("카테고리 이동2 요청");
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.id;

        const result = await move2CategoryService(req);
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error(error);
    }
}

// 카테고리 이동3 (상위가 다른 상위의 새로운 하위가 될 때)
export const move3CategoryData = async (req, res, next) => {
    try {
        console.log("카테고리 이동3 요청");
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.id;

        const result = await move3CategoryService(req);
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error(error);
    }
}

