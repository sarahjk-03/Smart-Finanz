const Joi = require("joi");

const expenseSchema = Joi.object({
  amount: Joi.number().positive().required(),
  category: Joi.string().max(50).required(),
  description: Joi.string().allow("").max(255),
  type: Joi.string().valid("income", "expense").required(),
  date: Joi.date().required()
});

module.exports = {
  expenseSchema
};
