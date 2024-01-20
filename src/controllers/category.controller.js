//category.controller.js

import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { addCategoryService,getCategoryService } from "../services/category.service.js";
import { addCategoryRequestDTO } from "../dtos/category.dto.js";

// 카테고리 조회
export const getCategoryData= async (req, res) => {
    try {
        console.log("카테고리 정보 조회 요청");
        const data = req.params.userID; //req.params.userID로
        console.log("컨트롤러 요청정보",data);
        res.send(response(status.SUCCESS, await getCategoryService(data)));
    } catch (error) {
        console.error(error);
    }
}

// 카테고리 추가
export const addCategoryData= async (req,res,next)=>{
    try{
        console.log("카테고리 추가 요청");
        const requestDTO = addCategoryRequestDTO(req);
        const result = await addCategoryService(requestDTO);

        res.send(response(status.SUCCESS, result));
    } catch(error){
        console.error(error);
    }
}