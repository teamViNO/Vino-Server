//category.service.js

import { BaseError } from "../../config/error.js";
import {status} from "../../config/response.status.js"
import { addCategoryResponseDTO,getCategoryResponseDTO } from "../dtos/category.dto.js";
import { addCategoryDAO,getCategoryDAO } from "../models/category.dao.js"

// 카테고리 조회
export const getCategoryService = async (data) => {
    console.log("서비스 요청 정보", data);
    const result = await getCategoryDAO(data);
    return result.map(category=>getCategoryResponseDTO(category));
}

// 카테고리 추가 => result가 null인 것도 해결해야 함
export const addCategoryService = async (requestDTO) => {
    const id = Math.floor(Math.random() * 1000000); // id 랜덤 생성 -> 나중에 수정
    const is_fix = 0;
    const fixed_at = null;
    const top_category = null;
    const categoryData = {
        id,
        name : requestDTO.name,
        is_fix,
        fixed_at,
        user_id : requestDTO.userID,
        top_category,
    };
    const result = await addCategoryDAO(categoryData);
    console.log('데이터:',categoryData);
    return addCategoryResponseDTO(result);
}
