import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const { formErrors, fieldErrors } = error.flatten();
      const firstError =
        Object.values(fieldErrors)?.[0]?.[0] || formErrors?.[0] || "Validation failed";
      return res.status(400).json({
        success: false,
        message: firstError,
        formErrors,
        fieldErrors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default validate;