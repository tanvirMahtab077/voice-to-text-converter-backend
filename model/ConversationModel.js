const mongoose = require("mongoose");
const dayjs = require("dayjs");
const Schema = mongoose.Schema;
const ConversationModelSchema = new Schema({
  conversationId:{
    type:String,
    unique: true,
  },
  audio: {
    type: String,
  },
  text: {
    type: String,
  },
  creatdAt: {
    type: String,
    default: dayjs().format("YYYY-MM-DD hh:mm:ss"),
  },
});

const Conversation = mongoose.model("conversation", ConversationModelSchema); // change to singular

module.exports = Conversation;