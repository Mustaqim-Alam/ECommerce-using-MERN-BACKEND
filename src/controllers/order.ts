import { tryCatch } from "../Middlewares/error.js";
import { NewOrderRequestBody } from "../Types/types.js";

export const newOrder = tryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>) => {}
);
