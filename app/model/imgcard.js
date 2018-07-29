'use strict';

// imglist = {
//   cid: 0,     //    Number      所属分类id
//   gid: 0,     //    Number      图片组id
//   name: '',   //    String      图片组名称
//   imgsum: 0,  //    Number      图片总数
//   size: 0,    //    Number      图片总大小
//   imgs: [     //    Array       图片集合
//     {
//       imgid: 0, //  Number      图片id
//       src: 0,   //  String      图片路径
//       size: 0,  //  Number      图片大小
//       name: '', //  String      图片名称
//       uploadTime: '',  // Date  图片上传时间
//     }
//   ]
// }

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ImgcardSchema = new Schema({
    cid: {
      type: Number, //    Number      所属分类id
    },
    gid: {
      type: Number, //    Number      图片组id
    },
    name: {
      type: String, //    String      图片组名称
    },
    createtime: { //      Date        图片组创建时间
      type: Date,
    },
    sum: { //             Number      图片组中图片总数
      type: Number,
    },
    size: { //            Number      图片组中图片总大小
      type: Number,
    },
  });
  return mongoose.model('Imgcard', ImgcardSchema);
};
