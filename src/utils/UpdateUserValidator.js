const Ajv = require("ajv");
const ajv = new Ajv();


const schema = ({
    type: "object",
    properties: {
        name: { 
            type: "string", 
            minLength: 3,
            maxLength: 50
        },
        email: { 
            type: "string", 
            pattern: ".+@.+\\..+"
        },
        password: { 
            type: "string", 
            minLength: 5 
        },
        phone: { 
            type: "string" 
        },
        street: { 
            type: "string" 
        },
        apartment: { 
            type: "string" 
        },
        city: { 
            type: "string" 
        },
        country: { 
            type: "string"
        },
        isAdmin: { 
            type: "boolean" 
        }
    },
    additionalProperties: false
});


module.exports = ajv.compile(schema)