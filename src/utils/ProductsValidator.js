const Ajv = require("ajv");
const ajv = new Ajv();


const productSchema = ({
    type: "object",
    properties: {
        name: {
            type: "string",
            pattern: "^[A-Z][a-z]*( [A-Z][a-z]*)*$"
        }, 
        price: {
            type: "number", 
            minimum: 0
        },
        stock: { 
            type: "number", 
            minimum: 0
        },
        image: {
            type: "string"
        },
        images: {
            type: "array",
            items: { type: "string" },
            minItems: 1
        },
        description: {
            type: "string"
        },
        category: {
              type: "string"
        }
  },
  required: ["name", "price", "stock", "description", "category"],
  additionalProperties: false    
});


const productUpdateSchema = {
    type: "object",
    properties: {
        name: {
            type: "string",
            pattern: "^[A-Z][a-z]*( [A-Z][a-z]*)*$"
        }, 
        price: {
            type: "number", 
            minimum: 0
        },
        stock: { 
            type: "number", 
            minimum: 0
        },
        description: {
            type: "string"
        },
        category: {
            type: "string"
        }
    }
};

module.exports = {
  validateProduct: ajv.compile(productSchema),
  validateProductUpdate: ajv.compile(productUpdateSchema),
};