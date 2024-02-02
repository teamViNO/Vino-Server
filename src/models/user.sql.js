export const insertVideoAlarmSql='insert into alarm(is_confirm, created_at, updated_at, type, content, state, user_id, video_id) values(?,?,?,?,?,?,?,?);';

export const insertNoticeAlarmSql='insert into alarm(is_confirm, created_at, updated_at, type, content,  user_id,title) values(?,?,?,?,?,?,?);';

export const getAlarmSql='select DISTINCT alarm.id,is_confirm,alarm.created_at,alarm.updated_at,alarm.title as alarm_title,type,content,state,alarm.user_id,video_id,video.title from alarm left outer join video on video.id=alarm.video_id where alarm.user_id=? order by alarm.created_at DESC;';

export const setConfirmSql='update alarm set is_confirm = 1 where id=? and user_id=?;';

export const deleteAlarmSql='delete from alarm where id=? and user_id=?;';

export const deleteAllAlarmSql='delete from alarm where user_id=? and id=?;';