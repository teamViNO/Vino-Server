//category.route.js

import express from "express";
import {getCategoryData,addCategory1Data,addCategory2Data,renameCategoryData,deleteCategoryData} from "../controllers/category.controller.js";
import {move1CategoryData,move2CategoryData,move3CategoryData,move4CategoryData,getCategoryTag} from "../controllers/category.controller.js";

export const categoryRoute = express.Router();

// 카테고리 모든 정보 조회
categoryRoute.get('/', async (req, res) => {
    const result = await getCategoryData(req, res);
});

// 상위 카테고리 추가
categoryRoute.post('/', async(req,res) => {
    const result = await addCategory1Data(req,res);
})

// 하위 카테고리 추가
categoryRoute.post('/:topCategoryID', async(req,res) => {
    const result = await addCategory2Data(req,res);
})

// 카테고리 수정
categoryRoute.put('/:categoryID', async (req,res) => {
    const result = await renameCategoryData(req,res);
})

// 카테고리 삭제
categoryRoute.delete('/:categoryID', async (req,res) => {
    const result = await deleteCategoryData(req,res);
})

// 카테고리 이동2 (하위가 새로운 상위가 될 때)
categoryRoute.put('/up/:categoryID', async (req,res) =>{
    const result = await move2CategoryData(req,res);
})

// 카테고리 이동3 (상위가 다른 상위의 새로운 하위가 될 때)
categoryRoute.put('/down/:categoryID/:topCategoryID', async (req,res) =>{
    const result = await move3CategoryData(req,res);
})

// 카테고리 이동4 (상위가 다른 상위의 하위와 합쳐질 때)
categoryRoute.put('/combine/:topCategoryID/:categoryID', async (req,res) =>{
    const result = await move4CategoryData(req,res);
})

// 카테고리 이동1 (하위의 상위가 변경될 때)
categoryRoute.put('/:categoryID/:topCategoryID', async (req,res) =>{
    const result = await move1CategoryData(req,res);
})

// 카테고리 태그 가져오기
categoryRoute.get('/:categoryID', async (req,res) => {
    const result = await getCategoryTag(req,res);
})