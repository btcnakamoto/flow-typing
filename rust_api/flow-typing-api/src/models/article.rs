use serde::{Deserialize, Serialize}; // 引入serde的Serialize和Deserialize特性
use uuid::Uuid; // 引入uuid库

#[derive(Serialize, Deserialize, Clone)] // 实现序列化、反序列化和克隆特性
pub struct Article {
    pub id: Uuid, // 文章ID
    pub title: String, // 文章标题
    pub content: String, // 文章内容
}
