export const getVideoKeywordSql="SELECT video.id,video.title,video.description,video.image,video.created_at,subheading.name as summary,subheading.content,user.name FROM video join subheading on subheading.video_id=video.id join user on video.user_id = user.id WHERE (video.user_id=? or video.user_id=41) and video.version='revision' and subheading.version_id='revision' and  ( title LIKE ? or description LIKE ? or subheading.content LIKE ?);"

export const getVideoTagSql="SELECT DISTINCT video.id,video.title,video.description,video.image,video.created_at,subheading.name as summary,subheading.content,user.name FROM video join subheading on subheading.video_id=video.id join user on video.user_id = user.id join video_tag on video.id = video_tag.video_id join tag on video_tag.tag_id = tag.id WHERE (video.user_id=? or video.user_id=41) and video.version='revision' and subheading.version_id='revision' and  tag.name LIKE ?;";