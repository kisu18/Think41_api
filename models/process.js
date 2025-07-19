const mongoose = require('mongoose');

const processSchema = new mongoose.Schema({
  resource_name: { type: String, required: true },
  process_id: { type: String, inrequired: true },
  expires_in:{type:Date,required:false,default:new Date(Date.now()+15*1000)}
}, { timestamps: true });

processSchema.index({ resource_name: 1 }, { unique: true });

module.exports = mongoose.model('Process', processSchema);
