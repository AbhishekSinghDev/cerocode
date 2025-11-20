import { getSession } from "@/server/better-auth/server";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

const LoginPage = async () => {
  const session = await getSession();

  if (session) {
    return redirect("/");
  }

  return <LoginForm />;
};

export default LoginPage;
