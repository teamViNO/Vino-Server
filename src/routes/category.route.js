//category.route.js

import express from "express";
import {getCategoryData,addCategory1Data,addCategory2Data,renameCategoryData, deleteCategoryData,moveCategoryData} from "../controllers/category.controller.js";

export const categoryRoute = express.Router();

// 카테고리 모든 정보 조회
categoryRoute.get('/:userID', async (req, res) => {
    const result = await getCategoryData(req, res);
});

// 상위 카테고리 추가
categoryRoute.post('/:userID', async(req,res) => {
    const result = await addCategory1Data(req,res);
})

// 하위 카테고리 추가
categoryRoute.post('/:userID/:topCategoryID', async(req,res) => {
    const result = await addCategory2Data(req,res);
})

// 카테고리 수정
categoryRoute.put('/:userID/:categoryID', async (req,res) => {
    const result = await renameCategoryData(req,res);
})

// 카테고리 삭제
categoryRoute.delete('/:userID/:categoryID', async (req,res) => {
    const result = await deleteCategoryData(req,res);
})

// 카테고리 이동 (하위 -> 하위)
categoryRoute.put('/:userID/:categoryID/:topCategoryID/', async (req,res) =>{
    const result = await moveCategoryData(req,res);
})