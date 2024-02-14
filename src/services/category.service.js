//category.service.js

import { BaseError } from "../../config/error.js";
import {status} from "../../config/response.status.js"
import { getCategoryResponseDTO,add1CategoryResponseDTO,add2CategoryResponseDTO,fixCategoryResponseDTO,move2CategoryResponseDTO,categoryTagResponseDTO} from "../dtos/category.dto.js";
import { addCategoryDAO,getCategoryDAO,renameCategoryDAO,deleteCategoryDAO } from "../models/category.dao.js"
import { move1CategoryDAO,move2CategoryDAO,move3CategoryDAO,move4CategoryDAO,getCategoryTagDAO } from "../models/category.dao.js"

// 카테고리 조회
export const getCategoryService = async (data) => {
    console.log("서비스 요청 정보", data);
    const result = await getCategoryDAO(data);
    return result.map(category => getCategoryResponseDTO(category));
}

// 상위 카테고리 추가 
export const addCategory1Service = async (req) => {
    const categoryData = {
        name : req.body.name,
        user_id : req.userID,
        top_category : null,
        created_at : new Date
    };
    const categoryID = await addCategoryDAO(categoryData);

    const defaultSubCategoryData = {
        name: "기타",
        user_id: req.userID,
        top_category: categoryID, // 상위 카테고리의 ID를 사용
        created_at: new Date
    };

    const etc = await addCategoryDAO(defaultSubCategoryData); // 기본 하위 폴더 생성
    return add1CategoryResponseDTO(categoryData,categoryID,etc);
}

// 하위 카테고리 추가 
export const addCategory2Service = async (req) => {
    const categoryData = {
        name : req.body.name,
        user_id : req.userID,
        top_category : req.params.topCategoryID,
        created_at : new Date
    };
    const categoryID = await addCategoryDAO(categoryData);
    return add2CategoryResponseDTO(categoryData,categoryID);
}

// 카테고리 수정 
export const renameCategoryService = async (req) => {
    const categoryData =  {
        name : req.body.name,
        user_id : req.userID,
        category_id : req.params.categoryID,
    };
    await renameCategoryDAO(categoryData);
    return fixCategoryResponseDTO(categoryData);
};

// 카테고리 삭제
export const deleteCategoryService = async (req) => {
    const categoryData =  {
        user_id : req.userID,
        category_id : req.params.categoryID,
    };
    console.log("서비스에서 ", categoryData);
    await deleteCategoryDAO(categoryData);
}

// 카테고리 이동1 (하위의 상위 카테고리가 변경될 때)
export const move1CategoryService = async (req) => {
    const categoryData =  {
        user_id : req.userID,
        category_id : req.params.categoryID,
        top_category : req.params.topCategoryID
    };
    console.log("서비스 요청 정보", categoryData);
    await move1CategoryDAO(categoryData);
    return fixCategoryResponseDTO(categoryData);
}

// 카테고리 이동2 (하위가 새로운 상위가 될 때)
export const move2CategoryService = async (req) => {
    const categoryData =  {
        user_id : req.userID,
        category_id : req.params.categoryID,
    };
    console.log("서비스 요청 정보", categoryData);

    const defaultSubCategoryData = {
        name: "기타",
        user_id: req.userID,
        top_category: req.params.categoryID, // 상위 카테고리의 ID를 사용
        created_at: new Date
    };
    const etc = await addCategoryDAO(defaultSubCategoryData); // 기본 하위 폴더 생성

    await move2CategoryDAO(categoryData,etc);
    return move2CategoryResponseDTO(categoryData,etc);
}

// 카테고리 이동3 (상위가 다른 상위의 새로운 하위가 될 때)
export const move3CategoryService = async (req) => {
    const categoryData =  {
        user_id : req.userID,
        category_id : req.params.categoryID,
        top_category : req.params.topCategoryID
    };
    console.log("서비스 요청 정보", categoryData);
    await move3CategoryDAO(categoryData);
    return fixCategoryResponseDTO(categoryData);
}

// // 카테고리 이동4 (상위가 다른 상위의 하위와 합쳐질 때)
// export const move4CategoryService = async (req) => {
//     const categoryData =  {
//         user_id : req.userID,
//         top_category : req.params.topCategoryID, // 이동할 상위가
//         category_id : req.params.categoryID // 얘랑 합쳐짐
//     };
//     console.log("서비스 요청 정보", categoryData);
//     await move4CategoryDAO(categoryData);
//     return fixCategoryResponseDTO(categoryData);
// }

// 카테고리 태그 가져오기
export const getCategoryTagService = async (req) =>{
    const categoryData = {
        user_id : req.userID,
        category_id : req.params.categoryID
    }
    console.log("서비스 요청 정보", categoryData);

    const tags = await getCategoryTagDAO(categoryData);
    return categoryTagResponseDTO(categoryData, tags); //dto 거쳐서 반환하기
}