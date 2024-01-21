//category.route.js

import express from "express";
import { addCategoryData, getCategoryData, renameCategoryData, fixCategoryData } from "../controllers/category.controller.js";

export const categoryRoute = express.Router();

// 카테고리 정보 가져오기
categoryRoute.get('/:userID/view', async (req, res) => {
    const result = await getCategoryData(req, res);
});

// 상위 카테고리 추가
categoryRoute.post('/:userID/add', async(req,res) => {
    const result = await addCategoryData(req,res);
})

// 카테고리 수정
categoryRoute.put('/:userID/:categoryID/rename', async (req,res) => {
    const result = await renameCategoryData(req,res);
})

// 카테고리 상단 고정/해제=> result에 이상한거 뜸
categoryRoute.put('/:userID/:categoryID/fix', async (req,res) => {
    const result = await fixCategoryData(req,res);
})