import auth from "@/auth";
import { LoginForm } from "@/components/login-form";
import { Toaster } from "@/components/ui/toaster";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await auth.getUser();

  if (user) {
    redirect("/");
  }
  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-primary p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium text-primary-foreground text-xl"
          >
            Dashboard GBEEB
          </a>
          <LoginForm />
        </div>
      </div>
      <Toaster />
    </>
  );
}
