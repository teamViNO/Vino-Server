import express from 'express';
import { register, login, setNicknameController, checkEmail ,createVideoAlarm,createNoticeAlarm,getAlarm,setConfirm,deleteAlarm, returnEmail, sendTempPassword, deleteSelectAlarm, setEntireConfirm} from '../controllers/user.controller.js';


export const userRoute = express.Router();

userRoute.post('/join', register);
userRoute.post('/login', login);
userRoute.put('/nickname', setNicknameController);
userRoute.post('/checkEmail', checkEmail);
userRoute.post('/findEmail', returnEmail);
userRoute.post('/findPassword', sendTempPassword);

userRoute.post('/videoAlarm/:videoId/:status',createVideoAlarm);

userRoute.post('/noticeAlarm',createNoticeAlarm);

userRoute.get('/alarm',async(req,res)=>{
    const result=await getAlarm(req,res);
});
userRoute.patch('/alarm/selectedConfirm',setEntireConfirm);

userRoute.patch('/alarm/read/:alarmId',setConfirm);

userRoute.delete('/alarm/:alarmId/delete',deleteAlarm);

userRoute.delete('/alarm/selectDelete',deleteSelectAlarm);