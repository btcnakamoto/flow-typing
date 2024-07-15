use actix_web::{web, App, HttpServer}; // 引入actix_web的web、App和HttpServer模块
use std::sync::Mutex; // 引入标准库中的Mutex，用于线程安全

mod api; // 引入自定义的api模块
mod models; // 引入自定义的models模块

#[actix_web::main] // 使用Actix的main宏
async fn main() -> std::io::Result<()> { // 异步主函数，返回std::io::Result
    let article_data = web::Data::new(Mutex::new(vec![
        models::article::Article { // 创建一个Article结构体实例
            id: uuid::Uuid::new_v4(), // 使用uuid生成新id
            title: String::from("First Article"), // 文章标题
            content: String::from("This is the content of the first article."), // 文章内容
        },
    ]));

    HttpServer::new(move || {
        App::new()
            .app_data(article_data.clone()) // 将文章数据添加到App的共享数据中
            .configure(api::init_routes) // 配置路由
    })
    .bind("127.0.0.1:8080")? // 绑定服务器地址
    .run() // 运行服务器
    .await // 等待运行结果
}
