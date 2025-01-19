import { NextRequest, NextResponse } from "next/server";
import auth from "@/auth";
import { permanentRedirect } from "next/navigation";

export async function POST(request) {
  try {
    const logoutSuccess = await auth.deleteSession();

    if (logoutSuccess) {
      return NextResponse.json(
        { success: true, message: "Déconnexion réussie" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Echec de la déconnexion" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
