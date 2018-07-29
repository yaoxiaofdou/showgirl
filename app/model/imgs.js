'use strict';

//   imgs: [     //    Array       图片集合
//     {
//       cid: 0,     //    Number      所属分类id
//       gid: 0,     //    Number      图片组id
//       imgid: 0, //  Number      图片id
//       src: 0,   //  String      图片路径
//       size: 0,  //  Number      图片大小
//       name: '', //  String      图片名称
//       uploadTime: '',  // Date  图片上传时间
//     }
//   ]

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ImgSchema = new Schema({
    cid: {
      type: Number, //    Number      所属分类id
    },
    gid: {
      type: Number, //    Number      图片组id
    },
    imgid: {
      type: Number, //    Number      图片id
    },
    name: {
      type: String, //    String      图片名称
    },
    uploadTime: { //      Date        图片上传时间
      type: Date,
    },
    src: { //             String      图片保存路径
      type: String,
    },
    size: { //            Number      图片组中图片总大小
      type: Number,
    },
  });
  return mongoose.model('Imgs', ImgSchema);
};
