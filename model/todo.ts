import { ObjectId } from "mongodb";

export interface Todo {
  _id?: ObjectId;
  Task: string;
  Priority: string;
  Deadline: Date;
  isDone: boolean;
}
