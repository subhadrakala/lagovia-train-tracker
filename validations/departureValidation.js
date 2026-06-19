import z from "zod";

export const departureValidation = {
    query: z.object({
        q: z.preprocess(
            (val) => val ?? "",
            z.string().min(3, "Station must have at least three letters").trim(),
        ),
    })
}