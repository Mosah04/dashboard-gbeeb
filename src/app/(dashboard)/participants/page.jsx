import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { getParticipants } from "@/lib/actions/participant.action";

const Participants = async () => {
  let participants;
  try {
    const data = await getParticipants();
    participants = data.participants;
  } catch (error) {
    console.log(error);
  }

  return (
    <div>
      <DataTable columns={columns} data={participants} />
    </div>
  );
};

export default Participants;
