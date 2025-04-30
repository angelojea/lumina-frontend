import { date, InferType, object, string } from "yup";
import { generateId } from "../utils/functions";
export const taskSchema = object({
  id: string().default(generateId()).required(""),
  name: string().label("Name").required(),
  description: string().label("Description").default("").meta({ rows: 5 }).required(),
  createdOn: date().label("Created On").default(new Date()),
  deadline: date().label("Deadline").default(new Date()),
  status: string().label("Status").default("new"),
});

export type Task = InferType<typeof taskSchema>;
