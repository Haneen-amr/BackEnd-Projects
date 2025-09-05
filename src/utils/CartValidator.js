const Ajv = require("ajv");
const ajv = new Ajv();

// Add to Cart schema
const addToCartSchema = {
    type: "object",
    properties: {
        product: { 
            type: "string" 
        },
        quantity: { 
            type: "integer", 
            minimum: 1 
        }
    },
    required: ["product"],
    additionalProperties: false
};

// Update Cart schema
const updateCartSchema = {
    type: "object",
    properties: {
        product: { 
            type: "string" 
        },
        quantity: { 
            type: "integer", 
            minimum: 1 
        }
    },
    required: ["product", "quantity"],
    additionalProperties: false
};

// Remove item schema (optional)
const removeFromCartSchema = {
    type: "object",
    properties: {
        product: { 
            type: "string" 
        },
        quantity: { 
            type: "integer", 
            minimum: 1 
        }
    },
    required: ["product"],
    additionalProperties: false
};

module.exports = {
    validateAddToCart: ajv.compile(addToCartSchema),
    validateUpdateCart: ajv.compile(updateCartSchema),
    validateRemoveFromCart: ajv.compile(removeFromCartSchema)
};
