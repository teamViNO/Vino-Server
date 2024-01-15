
//video view 관련 sql
export const getVideoSql="select * from video where id=? and  user_id=? and version = ?;";
export const getSummarySql='select * from summary where video_id=? and version_id = ? ;';
export const getSubHeadingSql='select * from subheading where video_id=? and version_id = ? ;';
export const getTagSql='select video_id,video_tag.tag_id,video_tag.version_id,t.name from video_tag join tag t on t.id = video_tag.tag_id where video_id=? and version_id =? ;';
export const getEntireVideoSql='select * from video where user_id=? and version = "revision";';
//video add 관련 sql

export const insertVideoOriginSql="insert into video(version, title, link, image, created_at, readed_at, updated_at, category_id, user_id) values(?,?,?,?,?,?,?,?,?);"
export const insertVideoRevisionSql="insert into video(id, version, title, link, image, created_at, readed_at, updated_at, category_id, user_id) values(?,?,?,?,?,?,?,?,?,?);"
export const connectSubheading="insert into subheading(name, start_time, end_time, content, video_id, version_id)values (?,?,?,?,?,?);";
export const connectSummary="insert into summary(content, video_id, version_id) VALUES (?,?,?);";
export const connectTag="INSERT INTO tag(name) VALUES (?);";
export const connectVideoTag="insert into video_tag(video_id, tag_id, version_id) VALUES (?,?,?);";