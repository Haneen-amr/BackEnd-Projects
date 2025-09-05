const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    user: {
        type: "string", 
        pattern: "^[a-f\\d]{24}$" }, // MongoDB ObjectId
    items: {
        type: "array",
        minItems: 1,
        items: {
            type: "object",
            properties: {
                product: { type: "string", pattern: "^[a-f\\d]{24}$" },
                quantity: { type: "number", minimum: 1 }
            },
            required: ["product", "quantity"]
    }
    },
    totalPrice: { 
        type: "number", 
        minimum: 0 },
    status: {
        type: "string",
        enum: ["pending", "shipped", "delivered", "cancelled"]
    }
  },
  required: ["user", "items", "totalPrice"]
};

module.exports = ajv.compile(schema);
