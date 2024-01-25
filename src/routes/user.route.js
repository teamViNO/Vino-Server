import express from 'express';
import { register, login, setNicknameController, checkEmail ,createVideoAlarm,createNoticeAlarm,getAlarm,setConfirm,deleteAlarm} from '../controllers/user.controller.js';


export const userRoute = express.Router();

userRoute.post('/join', register);
userRoute.post('/login', login);
userRoute.put('/nickname', setNicknameController);
userRoute.post('/checkEmail', checkEmail);

userRoute.post('/videoAlarm/:videoId/:status',createVideoAlarm);

userRoute.post('/noticeAlarm',createNoticeAlarm);

userRoute.get('/alarm',async(req,res)=>{
    const result=await getAlarm(req,res);
});

userRoute.patch('/alarm/:alarm_id',setConfirm);

userRoute.delete('/alarm/:alarm_id/delete',deleteAlarm);