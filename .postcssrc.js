// postcss配置文件

module.exports = {
    // vuecli已经默认配置了brower，不用写，否则编译器会警告，出现冲突
    // browsers: ['Android >= 4.0', 'iOS >= 8'],
    // 配置postcss使用的插件
    plugins: {
        'postcss-pxtorem': {
            rootValue({
                file
            }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75;
            },
            propList: ['*'],
            //配置不需要转换的样式资源
            exclude: 'github-markdown'
        }
    }
}