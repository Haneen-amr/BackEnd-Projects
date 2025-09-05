const validator = require("../utils/AuthValidator");

//For MW -> export route handler function
module.exports = (req, res, nxt) => {
    const valid = validator(req.body);

    console.log("VALIDATION RESULT:", valid);
    if (!valid) {
        console.log("VALIDATION ERRORS:", validator.errors);
    }

    if (valid) {
        req.valid = 1;
        nxt(); // next middleware
    } 
    
    else {
        res.status(403).send("Invalid input data");
    }
};