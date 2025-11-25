"use client";

import { IconBrandGithub, IconLoader2 } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { data: session, isPending: sessionPending } = authClient.useSession();
  const redirectUrl = searchParams.get("redirect");

  useEffect(() => {
    // Redirect authenticated users
    if (session?.user) {
      // Decode the redirect URL to get the full path with query params
      const destination = redirectUrl ? decodeURIComponent(redirectUrl) : "/";
      router.push(destination);
    }
  }, [session, router, redirectUrl]);

  const handleGitHubSignIn = async () => {
    startTransition(async () => {
      // Decode redirect URL to ensure proper callback after OAuth
      const callbackURL = redirectUrl ? decodeURIComponent(redirectUrl) : "/";
      await authClient.signIn.social({
        provider: "github",
        callbackURL,
      });
    });
  };

  if (sessionPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <IconLoader2 className="animate-spin h-8 w-8 text-[#00ff41]" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      {/* Grid background */}
      <div className="absolute inset-0 grid-lines" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Card */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-6 flex justify-center">
              <Logo showText={false} size="lg" />
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
              Welcome to <span className="text-muted-foreground">cero</span>
              <span className="text-[#00ff41]">code</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {redirectUrl ? "Sign in to authorize your device" : "Sign in to continue"}
            </p>
          </div>

          {/* GitHub OAuth Button */}
          <Button
            onClick={handleGitHubSignIn}
            size="lg"
            className="w-full cursor-pointer bg-[#00ff41] font-medium text-black hover:bg-[#00ff41]/90"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <IconBrandGithub className="mr-2 h-5 w-5" />
                Continue with GitHub
              </>
            )}
          </Button>

          {/* Footer Text */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
