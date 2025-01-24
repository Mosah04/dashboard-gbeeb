"use server";
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { parseStringify } from "../utils";
import { createAdminClient, createSessionClient } from "../appwrite.config";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const registerParticipant = async (participantImage, participant) => {
  let file;

  const { storage, databases } = await createAdminClient();

  const blobFile = new Blob([participantImage], {
    type: participantImage.type,
  });
  const inputFile = InputFile.fromBuffer(blobFile, participantImage.name);

  file = await storage.createFile(
    process.env.NEXT_PUBLIC_BUCKET_ID,
    ID.unique(),
    inputFile
  );

  const newParticipant = await databases.createDocument(
    process.env.DATABASE_ID,
    process.env.PARTICIPANTS_COLLECTION_ID,
    ID.unique(),
    {
      imageId: file?.$id || null,
      imageURL: `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`,
      ...participant,
    }
  );

  return parseStringify(newParticipant);
};

export const getParticipants = async () => {
  const sessionCookie = (await cookies()).get("session");
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    const { documents: participants } = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.PARTICIPANTS_COLLECTION_ID,
      [Query.orderDesc("$createdAt")]
    );
    return { participants };
  } catch (error) {
    console.log("Erreur lors de la récupératon des participants", error);
    throw new Error("Erreur lors de la récupératon des participants");
  }
};

export const updateParticipant = async (participant) => {
  const sessionCookie = (await cookies()).get("session");
  try {
    const { databases } = await createSessionClient(sessionCookie.value);

    const updatedParticipant = await databases.updateDocument(
      participant.$databaseId,
      participant.$collectionId,
      participant.$id,
      cleanSpecialAttributes(participant)
    );

    if (!updatedParticipant)
      throw new Error("Failed to update the participant");

    revalidatePath("/participants");

    return { updatedParticipant };
  } catch (error) {
    console.log("Erreur lors de la modification du participant", error);
    throw new Error("Erreur lors de la modification du participant");
  }
};

const cleanSpecialAttributes = (data) => {
  const keys = Object.keys(data);
  keys.forEach((key) => {
    if (key.startsWith("$")) delete data[key];
  });
  return data;
};

export const deleteParticipant = async (participant) => {
  const sessionCookie = (await cookies()).get("session");
  try {
    const { databases, storage } = await createSessionClient(
      sessionCookie.value
    );

    await storage.deleteFile(
      process.env.NEXT_PUBLIC_BUCKET_ID,
      participant.imageId
    );

    await databases.deleteDocument(
      participant.$databaseId,
      participant.$collectionId,
      participant.$id
    );

    revalidatePath("/participants");

    return;
  } catch (error) {
    console.log("Erreur lors de la suppression du participant", error);
    throw new Error("Erreur lors de la suppression du participant");
  }
};
