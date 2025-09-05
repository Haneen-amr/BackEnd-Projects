const cartValidator = require("../utils/CartValidator");


function validate(schemaValidator) {
    return (req, res, next) => {
        const valid = schemaValidator(req.body);
        console.log("VALIDATION RESULT:", valid);

        if (!valid) {
            console.log("VALIDATION ERRORS:", schemaValidator.errors);
            return res.status(400).json({
                success: false,
                errors: schemaValidator.errors
            });
        }
        next();
    };
}

module.exports = {
    validateAddtoCart: validate(cartValidator.validateAddToCart),
    validateUpdateCart: validate(cartValidator.validateUpdateCart),
    validateRemoveFromCart: validate(cartValidator.validateRemoveFromCart),
};