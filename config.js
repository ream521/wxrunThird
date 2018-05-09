/**
 * [module]小程序配置文件
 */

// 此处主机域名
var host = 'https://hygs.web.mai022.com';
var appid = 'wxafc12635c0396090'
var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        //主机地址
        host,

        // 数据请求地址
        requestUrl: `${host}/wxrunapp/index.php?appid=${appid}`,

        //静态资源路径
        imageUrl: `${host}/wxrunapp/img/`,

    },
};

module.exports = config;