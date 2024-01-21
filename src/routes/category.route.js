//category.route.js

import express from "express";
import {getCategoryData,addCategory1Data,addCategory2Data,renameCategoryData, deleteCategoryData,moveCategoryData} from "../controllers/category.controller.js";

export const categoryRoute = express.Router();

// 카테고리 모든 정보 조회
categoryRoute.get('/:userID/view', async (req, res) => {
    const result = await getCategoryData(req, res);
});

// 상위 카테고리 추가
categoryRoute.post('/:userID/add', async(req,res) => {
    const result = await addCategory1Data(req,res);
})

// 하위 카테고리 추가
categoryRoute.post('/:userID/:topCategoryID/add', async(req,res) => {
    const result = await addCategory2Data(req,res);
})

// 카테고리 수정
categoryRoute.put('/:userID/:categoryID/rename', async (req,res) => {
    const result = await renameCategoryData(req,res);
})

// 카테고리 삭제 => result값 수정필요
categoryRoute.delete('/:userID/:categoryID/delete', async (req,res) => {
    const result = await deleteCategoryData(req,res);
})

// 카테고리 이동 (하위 -> 하위)
categoryRoute.put('/:userID/:categoryID/:topCategoryID/move', async (req,res) =>{
    const result = await moveCategoryData(req,res);
})