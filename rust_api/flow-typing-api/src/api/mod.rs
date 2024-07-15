use actix_web::web; // 引入actix_web的web模块

mod handlers; // 引入自定义的handlers模块
use handlers::article; // 使用handlers中的article

pub fn init_routes(cfg: &mut web::ServiceConfig) { // 初始化路由函数
    cfg.service(
        web::resource("/articles/{id}") // 定义一个新的资源路径
            .route(web::get().to(article::get_article)), // 将GET请求路由到get_article处理器
    );
}
