import { registerParticipant } from "@/lib/actions/participant.action";
import { createSessionClient } from "@/lib/appwrite.config";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";

// export async function GET(req) {
//   const sessionCookie = (await cookies()).get("session");
//   try {
//     const { databases } = await createSessionClient(sessionCookie.value);
//     const { documents: participants } = await databases.listDocuments(
//       process.env.DATABASE_ID,
//       process.env.PARTICIPANTS_COLLECTION_ID,
//       [Query.orderDesc("$createdAt")]
//     );
//     return NextResponse.json({ participants }, { status: 200 });
//   } catch (error) {
//     console.log("Erreur lors de la lecture", error);
//     return NextResponse.json({ message: "Access Denied" }, { status: 403 });
//   }
// }

export async function POST(req) {
  const headersList = await headers();
  const authToken = headersList.get("Authorization");

  if (!authToken || authToken !== `Bearer ${process.env.GOOGLE_KEY}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const formData = await req.formData();

  if (!formData) {
    return NextResponse.json(
      { success: false, message: "No data received" },
      { status: 500 }
    );
  }

  const participant = {
    name: formData.get("name"),
    church: formData.get("church"),
    email: formData.get("email"),
    sex: formData.get("sex"),
    phoneNumber: formData.get("phoneNumber"),
    cell: formData.get("cell"),
    birthYear: formData.get("birthYear"),
    status: formData.get("status"),
    maritalStatus: formData.get("maritalStatus"),
    paymentMode: formData.get("paymentMode"),
  };

  try {
    const registeredParticipant = await registerParticipant(
      formData.get("image"),
      participant
    );
    if (registeredParticipant) revalidatePath("/paticipants");
    return NextResponse.json(
      { success: true, participant: registeredParticipant },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while processing the data.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// export async function PATCH(req) {
//   const sessionCookie = (await cookies()).get("session");
//   try {
//     const { databases } = await createSessionClient(sessionCookie.value);
//     const participant = await req.json();

//     const updatedParticipant = await databases.updateDocument(
//       participant.$databaseId,
//       participant.$collectionId,
//       participant.$id,
//       cleanSpecialAttributes(participant)
//     );

//     if (!updatedParticipant)
//       throw new Error("Failed to update the participant payment state");

//     revalidatePath("/participants");

//     return NextResponse.json(
//       { success: true, participant: updatedParticipant },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       {
//         error: "An error occurred while processing the data.",
//         details: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

// const cleanSpecialAttributes = (data) => {
//   const keys = Object.keys(data);
//   keys.forEach((key) => {
//     if (key.startsWith("$")) delete data[key];
//   });
//   return data;
// };
