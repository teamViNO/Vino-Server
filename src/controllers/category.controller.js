//category.controller.js

import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { addCategoryService,getCategoryService,renameCategoryService,fixCategoryService, deleteCategoryService   } from "../services/category.service.js";
import { addCategoryRequestDTO,renameCategoryRequestDTO,fixCategoryRequestDTO,deleteCategoryRequestDTO  } from "../dtos/category.dto.js";

// 카테고리 조회
export const getCategoryData= async (req, res) => {
    try {
        console.log("카테고리 정보 조회 요청");
        const data = req.params.userID;
        console.log("컨트롤러 요청정보",data);
        const result = await getCategoryService(data)
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error(error);
    }
}

// 카테고리 추가
export const addCategoryData= async (req,res,next)=>{
    try{
        console.log("카테고리 추가 요청");
        const data = addCategoryRequestDTO(req);
        console.log("컨트롤러 요청정보",data);
        const result = await addCategoryService(data);
        res.send(response(status.SUCCESS, result));
    } catch(error){
        console.error(error);
    }
}

// 카테고리 수정
export const renameCategoryData = async (req, res) => {
    try {
        console.log("카테고리 이름 수정 요청");
        const data = renameCategoryRequestDTO(req);
        console.log("컨트롤러 요청정보",data);
        const result = await renameCategoryService(data);
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error(error);
    }
};

// 카테고리 상단 고정/해제
export const fixCategoryData = async (req, res, next) => {
    try {
        console.log("카테고리 상단 고정/해제 요청");
        const data = fixCategoryRequestDTO(req);
        console.log("컨트롤러 요청정보",data);
        const result = await fixCategoryService(data);
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error(error);
    }
};

// 카테고리 삭제
export const deleteCategoryData = async (req, res) => {
    try {
        console.log("카테고리 삭제 요청");
        const data = deleteCategoryRequestDTO(req);
        console.log("컨트롤러 요청정보",data);
        const result = await deleteCategoryService(data);
        res.send(result);
    } catch (error) {
        console.error(error);
    }
};