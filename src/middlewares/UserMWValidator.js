const registerValidator = require("../utils/UsersValidator");
const updateValidator = require("../utils/UpdateUserValidator");


function validate(schemaValidator) {
    return (req, res, next) => {
        const valid = schemaValidator(req.body);

        console.log("VALIDATION RESULT:", valid);
        if (!valid) {
        console.log("VALIDATION ERRORS:", schemaValidator.errors);
        return res.status(403).json({
            success: false,
            errors: schemaValidator.errors
        });
        }

        next();
    };
}

module.exports = {
  validateRegister: validate(registerValidator),
  validateUpdate: validate(updateValidator)
};
