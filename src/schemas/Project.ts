import { InferType, object, string } from "yup";
import { generateId } from "../utils/functions";
export const projectSchema = object({
  id: string().default(generateId()).required(""),
  name: string().label("Name").required(),
  //   description: string().label("Description").default("").meta({ rows: 5 }).required(),
  //   createdOn: date().label("Created On").default(new Date()),
  //   deadline: date().label("Deadline").default(new Date()),
  //   status: string().label("Status").default("new"),
  //   userId: string().label("User").default(""),
});

export type Project = InferType<typeof projectSchema>;
