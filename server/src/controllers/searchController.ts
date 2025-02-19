// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const search = async (req: Request, res: Response): Promise<void> => {
//   const { query } = req.query;
//   try {
//     const tasks = await prisma.task.findMany({
//       where: {
//         OR: [
//           { title: { contains: query as string } },
//           { description: { contains: query as string } },
//         ],
//       },
//     });

//     const projects = await prisma.project.findMany({
//       where: {
//         OR: [
//           { name: { contains: query as string } },
//           { description: { contains: query as string } },
//         ],
//       },
//     });

//     const users = await prisma.user.findMany({
//       where: {
//         OR: [{ username: { contains: query as string } }],
//       },
//     });
//     res.json({ tasks, projects, users });
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error performing search: ${error.message}` });
//   }
// };

import { Request, Response } from "express";
import { supabase } from "../lib/supabase"; // Import Supabase client

export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  
  try {
    if (!query) {
      res.status(400).json({ message: "Query parameter is required" });
      return;
    }

    // 🚀 Search for tasks (title or description contains query)
    const { data: tasks, error: tasksError } = await supabase
      .from("Task")
      .select("*")
      .or(`title.ilike.%${query}%, description.ilike.%${query}%`);

    if (tasksError) throw new Error(tasksError.message);

    // 🚀 Search for projects (name or description contains query)
    const { data: projects, error: projectsError } = await supabase
      .from("Project")
      .select("*")
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`);

    if (projectsError) throw new Error(projectsError.message);

    // 🚀 Search for users (username contains query)
    const { data: users, error: usersError } = await supabase
      .from("User")
      .select("*")
      .ilike("username", `%${query}%`);

    if (usersError) throw new Error(usersError.message);

    res.json({ tasks, projects, users });

  } catch (error: any) {
    res.status(500).json({ message: `Error performing search: ${error.message}` });
  }
};
