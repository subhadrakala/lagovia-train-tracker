import express from 'express';
import * as controller from "../controller/departureController.js";
import { validateRequest } from "../middleware/validations.js";
import * as departureValidations from "../validations/departureValidation.js"
const router = express.Router();


router.route('/departures')
   .get(
        validateRequest(departureValidations.departureValidation), 
        async (req, res, next) => {
        try {
            const result = await controller.getDepartures(req, res, next);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    });

export default router;
   
