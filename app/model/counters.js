'use strict';

// let countersShema = mongoose.Schema({ _id: { type: String }, count: { type: Number } });
// countersShema.statics.findAndModify = function (query, sort, doc, options, callback){
//     return this.collection.findAndModify(query, sort, doc, options, callback);
// }
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const CountersSchema = new Schema({
    _id: {
      type: String,
    },
    count: {
      type: Number,
    },
  });
  CountersSchema.statics.findAndModify = function(query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
  };
  return mongoose.model('Counters', CountersSchema);
};
