// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
// event中包含了来自小程序端的“data对象”的数据
// data对象中有 a对象和 b对象，两个对象的值都为8
// 返回一个sum对象给小程序端，返回的对象就是来自小程序端的两个对象a和b的和
// 返回的数据将会保存在小程序端的res.result对象内
exports.main = async(event, context) => {
  return {
    sum: event.a + event.b
  }
}