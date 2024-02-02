
//video view 관련 sql
export const getVideoSql="select * from video where id=? and  user_id=? and version = ?;";
export const getSummarySql='select * from summary where video_id=? and version_id = ? ;';
export const getSubHeadingSql='select * from subheading where video_id=? and version_id = ? ;';
export const getTagSql='select video_id,video_tag.tag_id,video_tag.version_id,t.name from video_tag join tag t on t.id = video_tag.tag_id where video_id=? and version_id =? ;';
export const getEntireVideoSql='select * from video where user_id=? and version = "revision";';
export const setTimeSql='update video set readed_at=? where id=?;'
//video add 관련 sql

export const insertVideoOriginSql="insert into video(version, title, link, image,youtube_created_at, created_at, readed_at, updated_at, category_id, user_id) values(?,?,?,?,?,?,?,?,?,?);"
export const insertVideoRevisionSql="insert into video(id, version, title, link, image,youtube_created_at, created_at, readed_at, updated_at, category_id, user_id) values(?,?,?,?,?,?,?,?,?,?,?);"
export const connectSubheading="insert into subheading(name, start_time, end_time, content, video_id, version_id)values (?,?,?,?,?,?);";
export const connectSummary="insert into summary(content, video_id, version_id) VALUES (?,?,?);";
export const connectTag="INSERT INTO tag(name) VALUES (?);";
export const connectVideoTag="insert into video_tag(video_id, tag_id, version_id) VALUES (?,?,?);";

//video delete 관련 sql

export const deleteVideoTagSql="delete from video_tag where video_id=?;"
export const deleteTagSql="delete from tag where video_id=?;"
export const deleteSummarySql="delete from summary where video_id=?;"
export const deleteSubheadingSql="delete from subheading where video_id=?;"
export const deleteVideoSql="delete from video where id=?;"


//video update 관련 sql

export const updateVideoSql="update video set title= ?, readed_at=?,updated_at=?,category_id=? where id=? and version='revision';"
export const updateSubheadingSql="update subheading set name=?,content=? where id=? and video_id=? and version_id='revision';";
export const updateSummarySql="update summary set content =? where id=? and video_id=? and version_id='revision';";


export const entireTagSql="select DISTINCT tag.id, tag.name from video_tag join tag on video_tag.tag_id = tag.id join video on video_tag.video_id = video.id where user_id=?;"

export const getCategorySql="select id from category where user_id=? and top_category=?;";
export const getSimpleVideoWithVideoSql="select * from video where category_id=? and version = 'revision';"