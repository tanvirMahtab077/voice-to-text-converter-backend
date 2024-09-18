const paginationFields = require("../config/pagination");
const { paginationHelpers } = require("../helpers/paginationHelpers");
const Employee = require("../model/EmployeeModel");
const pick = require("../shared/pick");

const getAllEmployees = async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  try {
    const response = await Employee.find().sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
  const total = await Employee.countDocuments();

  return res.status(200).json({
    meta: {
      page,
      limit,
      total,
    },
    data: response,
  });
  } catch (error) {
    console.error(error)
    res.status(500).send(error);
  }
};

const getOneEmployee = async (req, res) => {
  const id = req.params.id;
  
  try {
    const response = await Employee.findById(id)
      
    return res.status(200).json({
      data: response,
    });
  } catch (error) {
    console.error(error)
    res.send(error);
  }
};

const updateEmployee = async (req, res) => {
  const id = req.params.id;

  const updatedData = req.body;

  try {
    const response = await Employee.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).send(response);
  } catch (error) {
    console.error(error)
    res.status(500).send(error);
  }
};

const deleteOneEmployee = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await Employee.findByIdAndDelete(id);

    res.status(200).send("Employee Deleted Successfully");
  } catch (error) {
    console.error(error)
    res.status(500).send(error);
  }
};

module.exports = {
  getAllEmployees,
  getOneEmployee,
  updateEmployee,
  deleteOneEmployee,
};
