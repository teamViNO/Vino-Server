//category.route.js

import express from "express";
import {getCategoryData,addCategory1Data,addCategory2Data,renameCategoryData, deleteCategoryData,moveCategoryData} from "../controllers/category.controller.js";

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

// 카테고리 이동 (하위가 다른 상위의 새로운 하위가 될 때)
categoryRoute.put('/:categoryID/:topCategoryID', async (req,res) =>{
    const result = await moveCategoryData(req,res);
})

// 카테고리 이동 (하위가 새로운 상위가 될 때)
categoryRoute.put('/:categoryID/up', async (req,res) =>{
    //const result = await upCombineCategoryData(req,res);
})

// 카테고리 이동 (하위가 또 다른 하위와 합쳐질 때)
categoryRoute.put('/:categoryID/:anotherCategoryID', async (req,res) =>{
    //const result = await downCombineCategoryData(req,res);
})

// 카테고리 이동 (상위가 다른 상위의 하위와 합쳐질 때)
categoryRoute.put('/:topCategoryID/:categoryID', async (req,res) =>{
    //const result = await downCombineCategoryData(req,res);
})

// 카테고리 이동 (상위가 다른 상위의 새로운 하위가 될 때)
categoryRoute.put('/:topCategoryID/:categoryID/down', async (req,res) =>{
    //const result = await downCombineCategoryData(req,res);
})