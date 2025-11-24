"use client";

import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { IconBrandGithub, IconLoader2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const LoginForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    data: session,
    isPending: sessionPending,
    error: sessionError,
  } = authClient.useSession();

  const handleGitHubSignIn = async () => {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    });
  };

  if (sessionPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <IconLoader2 className="animate-spin h-10 w-10 text-muted-foreground" />
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error: {sessionError.message}</p>
      </div>
    );
  }

  if (session) {
    router.push("/");
    return;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/20 px-4">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute left-1/4 top-0 -z-10 h-96 w-96 rounded-full bg-[#FF6B6B]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#06B6D4]/20 blur-3xl" />

      <Card className="w-full max-w-md border-2 border-border/50 bg-card/50 p-8 backdrop-blur">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center flex items-center flex-col">
            <Logo className="h-12 w-12" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome to <span className="text-[#FF6B6B]">CERO</span>
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue your journey
            </p>
          </div>

          {/* GitHub OAuth Button */}
          <Button
            onClick={handleGitHubSignIn}
            size="lg"
            className="w-full bg-[#FF6B6B] cursor-pointer text-base hover:bg-[#FF6B6B]/90"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <IconLoader2 className="animate-spin mr-2 h-5 w-5" />
                Authenticating...
              </>
            ) : (
              <>
                <IconBrandGithub className="mr-2 h-5 w-5" /> Continue with
                GitHub
              </>
            )}
          </Button>

          {/* Footer Text */}
          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
