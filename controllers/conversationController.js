const paginationFields = require("../config/pagination");
const { paginationHelpers } = require("../helpers/paginationHelpers");
const Conversation = require("../model/ConversationModel");
const pick = require("../shared/pick");
const { v4: uuidv4 } = require("uuid");
const createNewConversation = async (req, res) => {
  try {
    const conversation = new Conversation({
      ...req.body,
      conversationId: "CONV-" + uuidv4().slice(0, 13),
    });
    await conversation.save();

    res.status(201).json({
      data: conversation,
      message: "Conversation created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

const getAllConversation = async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  try {
    const response = await Conversation.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    const total = await Conversation.countDocuments();
    return res.status(200).json({
      meta: {
        page,
        limit,
        total,
      },
      data: response,
      status:200
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const getOneConversation = async (req, res) => {
  const id = req.params.id;

  try {
    const response = await Conversation.findById(id);
    if (!response)
      return res.status(404).send("This Conversation is not found");
    res.status(200).json({
      status:200,
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

const updateConversation = async (req, res) => {
  const id = req.params.id;

  const updatedData = req.body;

  try {
    const response = await Conversation.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const deleteOneConversation = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await Conversation.findByIdAndDelete(id);

    res.status(200).send("Conversation Deleted Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

module.exports = {
  createNewConversation,
  getAllConversation,
  getOneConversation,
  updateConversation,
  deleteOneConversation,
};
