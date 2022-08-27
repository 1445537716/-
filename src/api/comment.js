import request from "@/utils/request";

//获取评论
export const getComments = params => {
    return request({
        method: 'GET',
        url: '/v1_0/comments',
        params
    })
}

//点赞评论
export const addCommentLike = target => {
    return request({
        method: 'POST',
        url: '/v1_0/comment/likings',
        data: {
            target
        }
    })
}

//取消点赞评论
export const deleteCommentLike = target => {
    return request({
        method: 'DELETE',
        url: `/v1_0/comment/likings/${target}`,
    })
}

//文章评论
export const addComment = data => {
    return request({
        method: 'POST',
        url: '/v1_0/comments',
        data
    })
}