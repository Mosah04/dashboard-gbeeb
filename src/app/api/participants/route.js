import { registerParticipant } from "@/lib/actions/participant.action";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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
