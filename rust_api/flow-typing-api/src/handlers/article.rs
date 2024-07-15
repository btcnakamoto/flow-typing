use actix_web::{web, HttpResponse}; // 引入actix_web的web和HttpResponse模块
use std::sync::Mutex; // 引入标准库中的Mutex
use uuid::Uuid; // 引入uuid库

use crate::models::article::Article; // 引入自定义的Article模型

pub async fn get_article(
    article_id: web::Path<Uuid>, // 从路径中提取文章ID
    data: web::Data<Mutex<Vec<Article>>>, // 从共享数据中提取文章数据
) -> HttpResponse {
    let articles = data.lock().unwrap();

    if let Some(article) = articles.iter().find(|a| a.id == *article_id) {
        HttpResponse::Ok().json(article)
    } else {
        HttpResponse::NotFound().body("Article not found")
    }
}


