//category.controller.js

import dotenv from "dotenv";

import jwt from 'jsonwebtoken'
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { getCategoryService,addCategory1Service,addCategory2Service,renameCategoryService,deleteCategoryService,moveCategoryService} from "../services/category.service.js";
import { addCategoryRequestDTO,deleteCategoryRequestDTO,renameCategoryRequestDTO,moveCategoryRequestDTO} from "../dtos/category.dto.js";

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
        res.send(result);
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
        res.send(result);
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

        const data = renameCategoryRequestDTO(req);
        console.log("컨트롤러 요청정보",data);
        const result = await renameCategoryService(data);
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error(error);
    }
};

// 카테고리 이동 (하위 -> 하위)
export const moveCategoryData = async (req, res, next) => {
    try {
        console.log("카테고리 이동 요청");
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.id;
        const data = moveCategoryRequestDTO(req);
        console.log("컨트롤러 요청정보", data);
        const result = await moveCategoryService(data);
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error(error);
    }
}

// 카테고리 삭제
export const deleteCategoryData = async (req, res) => {
    try {
        console.log("카테고리 삭제 요청");
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.id;

        const data = deleteCategoryRequestDTO(req);
        await deleteCategoryService(data);
        res.send(response(status.SUCCESS,"카테고리가 삭제되었습니다."));
    } catch (error) {
        console.error(error);
    }
};
