//category.route.js

import express from "express";
import {getCategoryData,addCategory1Data,renameCategoryData, deleteCategoryData} from "../controllers/category.controller.js";

export const categoryRoute = express.Router();

// 카테고리 정보 가져오기
categoryRoute.get('/:userID/view', async (req, res) => {
    const result = await getCategoryData(req, res);
});

// 상위 카테고리 추가
categoryRoute.post('/:userID/add', async(req,res) => {
    const result = await addCategory1Data(req,res);
})

// 하위 카테고리 추가
//categoryRoute.post('/:userID/:categoryID/add', async(req,res) => {
//    const result = await addCategory2Data(req,res);
//})

// 카테고리 수정
categoryRoute.put('/:userID/:categoryID/rename', async (req,res) => {
    const result = await renameCategoryData(req,res);
})

// 카테고리 삭제 => result값 수정필요
categoryRoute.delete('/:userID/:categoryID/delete', async (req,res) => {
    const result = await deleteCategoryData(req,res);
})