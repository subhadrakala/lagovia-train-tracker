import { ZodError } from "zod";

/*
* validateRequest
* 
* Validates the request against the provided schema.
* 
* @param {object} schema - The schema to validate against
* @returns {function} - The validation middleware
*/
export const validateRequest = (schema) => async (req, res, next) => {
    try {
        if (schema.params) {
            Object.assign(req.params, await schema.params.parseAsync(req.params));
        }
        if (schema.body) {
            Object.assign(req.body, await schema.body.parseAsync(req.body));
        }
        if (schema.query) {
            Object.assign(req.query, await schema.query.parseAsync(req.query));
        }
        if (schema.response) {
            const originalJson = res.json;
            res.json = function (body) {
                if (this.statusCode >= 200 && this.statusCode < 300) {
                    try {
                        const validatedBody = schema.response.parse(body);
                        return originalJson.call(this, validatedBody);
                    } catch (error) {
                        const errorMessage = error.errors ? error.errors[0].message : error.message;
                        console.error('Response validation error:', errorMessage);
                        return originalJson.call(this.status(500), { error: `Response Validation Failed: ${errorMessage}` });
                    }
                }
                return originalJson.call(this, body);
            };
        }
        next();

    } catch (error) {
        let errorMessage;

        if (error instanceof ZodError) {
            errorMessage = error.issues[0].message;
        } else {
            errorMessage = error.message;
        }

        console.error('Error validating request:', errorMessage);
        return res.status(400).json({ error: errorMessage });
    }
};