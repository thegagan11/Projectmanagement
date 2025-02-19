// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const getTeams = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const teams = await prisma.team.findMany();

//     const teamsWithUsernames = await Promise.all(
//       teams.map(async (team: any) => {
//         const productOwner = await prisma.user.findUnique({
//           where: { userId: team.productOwnerUserId! },
//           select: { username: true },
//         });

//         const projectManager = await prisma.user.findUnique({
//           where: { userId: team.projectManagerUserId! },
//           select: { username: true },
//         });

//         return {
//           ...team,
//           productOwnerUsername: productOwner?.username,
//           projectManagerUsername: projectManager?.username,
//         };
//       })
//     );

//     res.json(teamsWithUsernames);
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error retrieving teams: ${error.message}` });
//   }
// };

import { Request, Response } from "express";
import { supabase } from "../lib/supabase";  // Import Supabase client

// 🚀 Get all teams with product owner and project manager usernames
export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all teams
    const { data: teams, error: teamsError } = await supabase.from("Team").select("*");

    if (teamsError) throw new Error(teamsError.message);

    // Fetch user details for product owners and project managers
    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        const { data: productOwner, error: productOwnerError } = await supabase
          .from("User")
          .select("username")
          .eq("userId", team.productOwnerUserId)
          .single();

        const { data: projectManager, error: projectManagerError } = await supabase
          .from("User")
          .select("username")
          .eq("userId", team.projectManagerUserId)
          .single();

        return {
          ...team,
          productOwnerUsername: productOwner?.username || null,
          projectManagerUsername: projectManager?.username || null,
        };
      })
    );

    res.json(teamsWithUsernames);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving teams: ${error.message}` });
  }
};

