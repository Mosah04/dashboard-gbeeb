import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { cookies } from "next/headers";

async function getParticipants() {
  const sessionCookie = (await cookies()).get("session");

  try {
    const response = await fetch(
      (process.env.NEXT_PUBLIC_DEPLOYMENT_URL || "http://localhost:8080") +
        "/api/participants",
      {
        headers: {
          Cookie: `session=${sessionCookie.value}`,
        },
      }
    );
    if (response.ok) {
      const { participants } = await response.json();
      return participants;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération", error);
  }
}

const Participants = async () => {
  const data = await getParticipants();
  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Participants;
