// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const getTasks = async (req: Request, res: Response): Promise<void> => {
//   const { projectId } = req.query;
//   try {
//     const tasks = await prisma.task.findMany({
//       where: {
//         projectId: Number(projectId),
//       },
//       include: {
//         author: true,
//         assignee: true,
//         comments: true,
//         attachments: true,
//       },
//     });
//     res.json(tasks);
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error retrieving tasks: ${error.message}` });
//   }
// };

// export const createTask = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const {
//     title,
//     description,
//     status,
//     priority,
//     tags,
//     startDate,
//     dueDate,
//     points,
//     projectId,
//     authorUserId,
//     assignedUserId,
//   } = req.body;
//   try {
//     const newTask = await prisma.task.create({
//       data: {
//         title,
//         description,
//         status,
//         priority,
//         tags,
//         startDate,
//         dueDate,
//         points,
//         projectId,
//         authorUserId,
//         assignedUserId,
//       },
//     });
//     res.status(201).json(newTask);
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error creating a task: ${error.message}` });
//   }
// };

// export const updateTaskStatus = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { taskId } = req.params;
//   const { status } = req.body;
//   try {
//     const updatedTask = await prisma.task.update({
//       where: {
//         id: Number(taskId),
//       },
//       data: {
//         status: status,
//       },
//     });
//     res.json(updatedTask);
//   } catch (error: any) {
//     res.status(500).json({ message: `Error updating task: ${error.message}` });
//   }
// };

// export const getUserTasks = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { userId } = req.params;
//   try {
//     const tasks = await prisma.task.findMany({
//       where: {
//         OR: [
//           { authorUserId: Number(userId) },
//           { assignedUserId: Number(userId) },
//         ],
//       },
//       include: {
//         author: true,
//         assignee: true,
//       },
//     });
//     res.json(tasks);
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error retrieving user's tasks: ${error.message}` });
//   }
// };


import { Request, Response } from "express";
import { supabase } from "../lib/supabase";  // Import Supabase client

// 🚀 Get tasks for a specific project
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const { data: tasks, error } = await supabase
      .from("Task")
      .select("*, author:User!TaskAuthor(*), assignee:User!TaskAssignee(*), comments:Comment(*), attachments:Attachment(*)")
      .eq("projectId", Number(projectId));

    if (error) throw new Error(error.message);

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving tasks: ${error.message}` });
  }
};

// 🚀 Create a new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;

  try {
    const { data: newTask, error } = await supabase
      .from("Task")
      .insert([{
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating a task: ${error.message}` });
  }
};

// 🚀 Update task status
export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const { data: updatedTask, error } = await supabase
      .from("Task")
      .update({ status })
      .eq("id", Number(taskId))
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating task: ${error.message}` });
  }
};

// 🚀 Get tasks for a specific user
export const getUserTasks = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const { data: tasks, error } = await supabase
      .from("Task")
      .select("*, author:User!TaskAuthor(*), assignee:User!TaskAssignee(*)")
      .or(`authorUserId.eq.${userId}, assignedUserId.eq.${userId}`);

    if (error) throw new Error(error.message);

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving user's tasks: ${error.message}` });
  }
};
