// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";

//   // Import Supabase client
// // import {supabase } from "../../lib/supabase.js";







// const prisma = new PrismaClient();

// export const getUsers = async (req: Request, res: Response): Promise<void> => {
// export const getUsers = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const users = await prisma.user.findMany();
//     res.json(users);
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error retrieving users: ${error.message}` });
//   }
// };

// export const getUser = async (req: Request, res: Response): Promise<void> => {
//   const { cognitoId } = req.params;
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         cognitoId: cognitoId,
//       },
//     });

//     res.json(user);
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error retrieving user: ${error.message}` });
//   }
// };

// export const postUser = async (req: Request, res: Response) => {
//   try {
//     const {
//       username,
//       cognitoId,
//       profilePictureUrl = "i1.jpg",
//       teamId = 1,
//     } = req.body;
//     const newUser = await prisma.user.create({
//       data: {
//         username,
//         cognitoId,
//         profilePictureUrl,
//         teamId,
//       },
//     });
//     res.json({ message: "User Created Successfully", newUser });
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error retrieving users: ${error.message}` });
//   }
// };

import { Request, Response } from "express";
import { supabase } from "../lib/supabase";  // Import Supabase client

// 🚀 Get all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: users, error } = await supabase.from("User").select("*");

    if (error) throw new Error(error.message);

    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving users: ${error.message}` });
  }
};

// 🚀 Get a single user by Cognito ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId } = req.params;
  try {
    const { data: user, error } = await supabase
      .from("User")
      .select("*")
      .eq("cognitoId", cognitoId)
      .single();

    if (error) throw new Error(error.message);

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving user: ${error.message}` });
  }
};

// 🚀 Create a new user
export const postUser = async (req: Request, res: Response) => {
  try {
    const { username, cognitoId, profilePictureUrl = "i1.jpg", teamId = 1 } = req.body;

    const { data: newUser, error } = await supabase
      .from("User")
      .insert([{ username, cognitoId, profilePictureUrl, teamId }]);

    if (error) throw new Error(error.message);

    res.json({ message: "User Created Successfully", newUser });
  } catch (error: any) {
    res.status(500).json({ message: `Error creating user: ${error.message}` });
  }
};
