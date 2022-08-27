//封装本地存储操作模块
//存储本地数据模块
export const setItem = (key, value) => {
    if (typeof value === "object") {
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(key, value)
}
//读取本地存储数据模块
export const getItem = key => {
    const data = window.localStorage.getItem(key)
    try {
        return JSON.parse(data)
    } catch (err) {
        return data
    }
}
//删除本地数据模块
export const removeItem = key => {
    window.localStorage.removeItem(key)
}