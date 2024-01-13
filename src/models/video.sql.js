

export const getVideoSql="select * from video where id=? and  user_id=? and version = ?;";
export const getSummarySql='select * from summary where video_id=? and version_id = ? ;';
export const getSubHeadingSql='select * from subheading where video_id=? and version_id = ? ;';
export const getTagSql='select video_id,video_tag.tag_id,video_tag.version_id,t.name from video_tag join tag t on t.id = video_tag.tag_id where video_id=? and version_id =? ;';