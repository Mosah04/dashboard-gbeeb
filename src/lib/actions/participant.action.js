import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { parseStringify } from "../utils";
import { createAdminClient, createSessionClient } from "../appwrite.config";

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

export const updateParticipantPayment = async (documentId, paymentDone) => {};
