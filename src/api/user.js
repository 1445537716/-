import request from '@/utils/request'
// import store from '@/store'

export const login = data => { //登录
    return request({
        method: 'POST',
        url: '/v1_0/authorizations',
        data
    })
}
export const sendSms = mobile => { //获取验证码
    return request({
        method: 'GET',
        url: `/v1_0/sms/codes/${mobile}`,
    })
}
export const getUserInfo = () => { //获取用户个人资料
    return request({
        method: 'GET',
        url: '/v1_0/user'
        // headers: {
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}
export const getUserChannels = () => { //获取用户频道列表
    return request({
        method: 'GET',
        url: '/v1_0/user/channels'
    })
}
export const addFollow = target => { //关注用户
    return request({
        method: 'POST',
        url: '/v1_0/user/followings',
        params: {
            target
        }
    })
}
export const deleteFollow = target => { //取消关注
    return request({
        method: 'DELETE',
        url: `/v1_0/user/followings/${target}`,
    })
}
export const getUserProfile = () => { //获取用户个人资料
    return request({
        method: 'GET',
        url: '/v1_0/user/profile',
    })
}
export const updateUserProfile = data => { //更新用户资料
    return request({
        method: 'PATCH',
        url: '/v1_0/user/profile',
        data
    })
}
export const updateUserPhoto = data => { //更新用户头像资料
    return request({
        method: 'PATCH',
        url: '/v1_0/user/photo',
        data
    })
}