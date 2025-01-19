import { cookies } from "next/headers";
import { createAdminClient, createSessionClient } from "./lib/appwrite.config";

const auth = {
  user: null,
  sessionCookie: null,
  getUser: async () => {
    auth.sessionCookie = (await cookies()).get("session");
    try {
      const { account } = await createSessionClient(auth.sessionCookie?.value);
      auth.user = await account.get();
    } catch (error) {
      console.log(error);

      auth.user = null;
      auth.sessionCookie = null;
    }
    return auth.user;
  },
  createSession: async (data) => {
    "use server";
    try {
      const { email, password } = data;
      const { account } = await createAdminClient();
      const session = await account.createEmailPasswordSession(email, password);

      (await cookies()).set("session", session.secret, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        expires: new Date(session.expire),
        path: "/",
      });

      return true;
    } catch (error) {
      console.error("Erreur lors de la création de la session :", error);
      return false;
    }
  },
  deleteSession: async () => {
    "use server";
    auth.sessionCookie = (await cookies()).get("session");
    try {
      const { account } = await createSessionClient(auth.sessionCookie?.value);
      await account.deleteSession("current");
    } catch (error) {
      console.error(
        "Erreur lors de la déconnexion auth.deleteSession() :",
        error
      );
      return false;
    }
    (await cookies()).delete("session");
    auth.user = null;
    auth.sessionCookie = null;
    return true;
  },
};

export default auth;
