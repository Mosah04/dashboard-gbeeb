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

const participants = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    sex: "Male",
    phoneNumber: "123-456-7890",
    cell: "Cellule Alpha",
    church: "Grace Community Church",
    paymentDone: true,
    image: "https://example.com/images/john_doe.jpg",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    sex: "Female",
    phoneNumber: "234-567-8901",
    cell: "Cellule Beta",
    church: "Faith Baptist Church",
    paymentDone: false,
    image: "https://example.com/images/jane_smith.jpg",
  },
  {
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    sex: "Male",
    phoneNumber: "345-678-9012",
    cell: "Cellule Gamma",
    church: "Hope Fellowship",
    paymentDone: true,
    image: "https://example.com/images/michael_johnson.jpg",
  },
  {
    name: "Emily Davis",
    email: "emily.davis@example.com",
    sex: "Female",
    phoneNumber: "456-789-0123",
    cell: "Cellule Alpha",
    church: "Victory Church",
    paymentDone: false,
    image: "https://example.com/images/emily_davis.jpg",
  },
  {
    name: "David Wilson",
    email: "david.wilson@example.com",
    sex: "Male",
    phoneNumber: "567-890-1234",
    cell: "Cellule Omega",
    church: "Redeemer Church",
    paymentDone: true,
    image: "https://example.com/images/david_wilson.jpg",
  },
  {
    name: "Sophia Brown",
    email: "sophia.brown@example.com",
    sex: "Female",
    phoneNumber: "678-901-2345",
    cell: "Cellule Beta",
    church: "Living Word Church",
    paymentDone: true,
    image: "https://example.com/images/sophia_brown.jpg",
  },
  {
    name: "James Taylor",
    email: "james.taylor@example.com",
    sex: "Male",
    phoneNumber: "789-012-3456",
    cell: "Cellule Delta",
    church: "New Life Church",
    paymentDone: false,
    image: "https://example.com/images/james_taylor.jpg",
  },
  {
    name: "Olivia Anderson",
    email: "olivia.anderson@example.com",
    sex: "Female",
    phoneNumber: "890-123-4567",
    cell: "Cellule Gamma",
    church: "Christ the King Church",
    paymentDone: true,
    image: "https://example.com/images/olivia_anderson.jpg",
  },
  {
    name: "Daniel Martinez",
    email: "daniel.martinez@example.com",
    sex: "Male",
    phoneNumber: "901-234-5678",
    cell: "Cellule Alpha",
    church: "Grace Community Church",
    paymentDone: false,
    image: "https://example.com/images/daniel_martinez.jpg",
  },
  {
    name: "Mia Rodriguez",
    email: "mia.rodriguez@example.com",
    sex: "Female",
    phoneNumber: "123-456-7891",
    cell: "Cellule Omega",
    church: "Faith Baptist Church",
    paymentDone: true,
    image: "https://example.com/images/mia_rodriguez.jpg",
  },
  {
    name: "Christopher Garcia",
    email: "christopher.garcia@example.com",
    sex: "Male",
    phoneNumber: "234-567-8902",
    cell: "Cellule Beta",
    church: "Hope Fellowship",
    paymentDone: false,
    image: "https://example.com/images/christopher_garcia.jpg",
  },
  {
    name: "Amelia Martinez",
    email: "amelia.martinez@example.com",
    sex: "Female",
    phoneNumber: "345-678-9013",
    cell: "Cellule Delta",
    church: "Victory Church",
    paymentDone: true,
    image: "https://example.com/images/amelia_martinez.jpg",
  },
  {
    name: "Matthew Hernandez",
    email: "matthew.hernandez@example.com",
    sex: "Male",
    phoneNumber: "456-789-0124",
    cell: "Cellule Gamma",
    church: "Redeemer Church",
    paymentDone: false,
    image: "https://example.com/images/matthew_hernandez.jpg",
  },
  {
    name: "Isabella Lopez",
    email: "isabella.lopez@example.com",
    sex: "Female",
    phoneNumber: "567-890-1235",
    cell: "Cellule Alpha",
    church: "Living Word Church",
    paymentDone: true,
    image: "https://example.com/images/isabella_lopez.jpg",
  },
  {
    name: "Ethan Gonzalez",
    email: "ethan.gonzalez@example.com",
    sex: "Male",
    phoneNumber: "678-901-2346",
    cell: "Cellule Omega",
    church: "New Life Church",
    paymentDone: true,
    image: "https://example.com/images/ethan_gonzalez.jpg",
  },
  {
    name: "Ava Perez",
    email: "ava.perez@example.com",
    sex: "Female",
    phoneNumber: "789-012-3457",
    cell: "Cellule Beta",
    church: "Christ the King Church",
    paymentDone: false,
    image: "https://example.com/images/ava_perez.jpg",
  },
  {
    name: "Alexander Wilson",
    email: "alexander.wilson@example.com",
    sex: "Male",
    phoneNumber: "890-123-4568",
    cell: "Cellule Gamma",
    church: "Grace Community Church",
    paymentDone: true,
    image: "https://example.com/images/alexander_wilson.jpg",
  },
  {
    name: "Emma Clark",
    email: "emma.clark@example.com",
    sex: "Female",
    phoneNumber: "901-234-5679",
    cell: "Cellule Delta",
    church: "Faith Baptist Church",
    paymentDone: false,
    image: "https://example.com/images/emma_clark.jpg",
  },
  {
    name: "William Young",
    email: "william.young@example.com",
    sex: "Male",
    phoneNumber: "123-456-7892",
    cell: "Cellule Omega",
    church: "Hope Fellowship",
    paymentDone: true,
    image: "https://example.com/images/william_young.jpg",
  },
  {
    name: "Charlotte King",
    email: "charlotte.king@example.com",
    sex: "Female",
    phoneNumber: "234-567-8903",
    cell: "Cellule Alpha",
    church: "Victory Church",
    paymentDone: true,
    image: "https://example.com/images/charlotte_king.jpg",
  },
  {
    name: "Benjamin Scott",
    email: "benjamin.scott@example.com",
    sex: "Male",
    phoneNumber: "345-678-9014",
    cell: "Cellule Beta",
    church: "Redeemer Church",
    paymentDone: false,
    image: "https://example.com/images/benjamin_scott.jpg",
  },
  {
    name: "Harper Adams",
    email: "harper.adams@example.com",
    sex: "Female",
    phoneNumber: "456-789-0125",
    cell: "Cellule Gamma",
    church: "Living Word Church",
    paymentDone: true,
    image: "https://example.com/images/harper_adams.jpg",
  },
  {
    name: "Liam Hill",
    email: "liam.hill@example.com",
    sex: "Male",
    phoneNumber: "567-890-1236",
    cell: "Cellule Delta",
    church: "New Life Church",
    paymentDone: true,
    image: "https://example.com/images/liam_hill.jpg",
  },
  {
    name: "Grace Nelson",
    email: "grace.nelson@example.com",
    sex: "Female",
    phoneNumber: "678-901-2347",
    cell: "Cellule Omega",
    church: "Christ the King Church",
    paymentDone: false,
    image: "https://example.com/images/grace_nelson.jpg",
  },
  {
    name: "Noah Carter",
    email: "noah.carter@example.com",
    sex: "Male",
    phoneNumber: "789-012-3458",
    cell: "Cellule Alpha",
    church: "Grace Community Church",
    paymentDone: true,
    image: "https://example.com/images/noah_carter.jpg",
  },
];
