import { NextRequest, NextResponse } from "next/server";
import auth from "@/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Appel à auth.createSession pour gérer la logique d'authentification
    const loginSuccess = await auth.createSession({ email, password });

    if (loginSuccess) {
      return NextResponse.json({
        success: true,
        message: "Connexion réussie !",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Identifiants invalides." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
