export const getDepartures = async (req, res, next) => {
    try {
        return "Success";
    } catch (error) {
        next(error);
    }
}
