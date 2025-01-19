import { Client, Account, Databases, Storage } from "node-appwrite";

export const {
  NEXT_PUBLIC_PROJECT_ID,
  NEXT_PUBLIC_API_KEY,
  NEXT_PUBLIC_ENDPOINT,
} = process.env;

export const createAdminClient = async () => {
  const client = new Client()
    .setProject(NEXT_PUBLIC_PROJECT_ID)
    .setEndpoint(NEXT_PUBLIC_ENDPOINT)
    .setKey(NEXT_PUBLIC_API_KEY);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
};

export const createSessionClient = async (session) => {
  const client = new Client()
    .setProject(NEXT_PUBLIC_PROJECT_ID)
    .setEndpoint(NEXT_PUBLIC_ENDPOINT);

  if (session) {
    client.setSession(session);
  }

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};
