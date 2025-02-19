// import express, { Request, Response } from "express";
// import dotenv from "dotenv";
// import bodyParser from "body-parser";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// /* ROUTE IMPORTS */
// import projectRoutes from "./routes/projectRoutes";
// import taskRoutes from "./routes/taskRoutes";
// import searchRoutes from "./routes/searchRoutes";
// import userRoutes from "./routes/userRoutes";
// import teamRoutes from "./routes/teamRoutes";


// //subabase


// /* CONFIGURATIONS */
// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());

// /* ROUTES */
// app.get("/", (req, res) => {
//   res.send("This is home route");
// });

// app.use("/projects", projectRoutes);
// app.use("/tasks", taskRoutes);
// app.use("/search", searchRoutes);
// app.use("/users", userRoutes);
// app.use("/teams", teamRoutes);

// /* SERVER */
// const port = Number(process.env.PORT) || 3001;
// app.listen(port, "0.0.0.0", () => {
//   console.log(`Server running on part ${port}`);
// });

// app.get("/api/users", async (req, res) => {
//   return res.json({ message: "Hello World" });
// });


import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
/* ROUTE IMPORTS */
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";

/* 🔥 Supabase Import */
import { supabase } from "./lib/supabase";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);

/* 🔥 Example: Fetching users from Supabase */
app.get("/api/users", async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    return res.status(500).json({ message: `Error fetching users: ${error.message}` });
  }

  return res.json(data);
});

/* SERVER */
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`🔥 Server running on port ${port}`);
});

