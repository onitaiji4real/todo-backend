import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { connectToDatabase } from "../util/MongoDB";
import { Todo } from "../model/todo";
import { ObjectId } from "mongodb";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT;

app.get("/say/hello/world", (req, res) => {
  res.send("Hello world");
});

app.get("/todos", async (req, res) => {
  const db = await connectToDatabase();
  const todos = await db.collection("tasklist").find().toArray();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const db = await connectToDatabase();
  const newTodo: Todo = req.body;
  const result = await db.collection("tasklist").insertOne(newTodo);
  const insertedTodo = await db
    .collection("tasklist")
    .findOne({ _id: result.insertedId });
  res.json(insertedTodo);
});

app.put("/todos/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const todoId = req.params.id;
    const updatedFields = req.body;

    const result = await db
      .collection("tasklist")
      .updateOne({ _id: new ObjectId(todoId) }, { $set: updatedFields });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const updatedTodo = await db
      .collection("tasklist")
      .findOne({ _id: new ObjectId(todoId) });

    res.json(updatedTodo);
  } catch (err) {
    err instanceof Error
      ? res.status(500).json({ error: err.message })
      : res.status(500).json({ error: "Unknown error" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const db = await connectToDatabase();
  const todoId = req.params.id;

  try {
    const result = await db
      .collection("tasklist")
      .deleteOne({ _id: new ObjectId(todoId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  } catch (err) {
    err instanceof Error
      ? res.status(500).json({ error: err.message })
      : res.status(500).json({ error: "unknown error" });
  }
});

//根據objectId 修改該項todo task 或是 priority 或是deadline或是status
//根據objectId 刪除該項task
//根據restful api 來實作這項todo 的變更
app.listen(port, () => {
  console.log(`app now listing on port: ${port}`);
});
