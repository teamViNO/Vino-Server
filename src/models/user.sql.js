export const insertVideoAlarmSql='insert into alarm(is_confirm, created_at, updated_at, type, content, state, user_id, video_id) values(?,?,?,?,?,?,?,?);';

export const insertNoticeAlarmSql='insert into alarm(is_confirm, created_at, updated_at, type, content,  user_id) values(?,?,?,?,?,?);';

export const getAlarmSql='select DISTINCT alarm.id,is_confirm,alarm.created_at,alarm.updated_at,type,content,state,alarm.user_id,video_id,video.title from alarm left outer join video on video.id=alarm.video_id where alarm.user_id=15;';

export const setConfirmSql='update alarm set is_confirm = 1 where id=? and user_id=?;';

export const deleteAlarmSql='delete from alarm where id=? and user_id=?;';