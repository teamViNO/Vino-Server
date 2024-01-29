export const dummyProgressSuccess=(req,res,next)=>{
    setTimeout(function(){
        res.send({
            "isSuccess":true,
            "code":2000,
            "message":"success!"
        })
    }
    ,6000)
}
export const dummyProgressFail=(req,res,next)=>{
    setTimeout(function(){
        res.send({
            "isSuccess": false, 
            "code": 4000,
            "message":"실패하셨습니다"
        })
    }
    ,6000)
}


