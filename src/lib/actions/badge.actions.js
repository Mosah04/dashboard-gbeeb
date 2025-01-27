"use server";

import { cookies } from "next/headers";
import { createSessionClient } from "../appwrite.config";

export const getFile = async (bucketId, fileId) => {
  const sessionCookie = (await cookies()).get("session");
  try {
    const { storage } = await createSessionClient(sessionCookie.value);
    const buffer = await storage.getFileView(bucketId, fileId);
    return Buffer.from(buffer);
  } catch (error) {
    console.log("Erreur lors de la récupératon du fichier", error);
    throw new Error("Erreur lors de la récupératon du fichier");
  }
};
