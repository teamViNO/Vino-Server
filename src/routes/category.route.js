//category.route.js

import express from "express";
import { addCategoryData, getCategoryData, renameCategoryData } from "../controllers/category.controller.js";

export const categoryRoute = express.Router();

// 카테고리 정보 가져오기
categoryRoute.get('/:userID/view', async (req, res) => {
    const result = await getCategoryData(req, res);
});

// 상위 카테고리 추가
categoryRoute.post('/:userID/add', async(req,res) => {
    const result = await addCategoryData(req,res);
})

// 상위 카테고리 상단 고정
//categoryRoute.put()

// 카테고리 수정
categoryRoute.put('/:userID/:categoryID/rename', async (req,res) => {
    const result = await renameCategoryData(req,res);
})