/**
 * [module]小程序配置文件
 */

// 此处主机域名
var host = 'https://hygs.web.mai022.com';
var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        //主机地址
        host,

        // 数据请求地址
        requestUrl: `${host}/wxrunapp/index.php?appid=wx17a78eaf1dbe7419`,

        //静态资源路径
        imageUrl: `${host}/wxrunapp/img/`,

    },
};

module.exports = config;