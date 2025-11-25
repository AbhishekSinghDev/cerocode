"use client";

import {
  IconAlertCircle,
  IconCheck,
  IconDeviceDesktop,
  IconLoader2,
  IconShieldCheck,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Logo from "@/components/shared/logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function ApproveDeviceAuthorization() {
  const { data: session } = authClient.useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userCode = searchParams.get("user_code");

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!session?.user) {
      const currentPath = `/device/approve?user_code=${userCode}`;
      const redirectUrl = encodeURIComponent(currentPath);
      router.push(`/login?redirect=${redirectUrl}`);
    }
  }, [session, router, userCode]);

  const handleApprove = async () => {
    if (!userCode) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { data, error } = await authClient.device.approve({
        userCode: userCode,
      });

      if (data?.success) {
        toast.success("Device approved successfully!", {
          description: "You can now return to your device",
        });
      }

      if (error) {
        setError("Failed to approve device. Please try again.");
        toast.error("Failed to approve device");
        return;
      }

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to approve device. Please try again.");
      toast.error("Failed to approve device");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeny = async () => {
    if (!userCode) return;

    setIsProcessing(true);
    setError(null);

    try {
      await authClient.device.deny({
        userCode: userCode,
      });

      toast.info("Device authorization denied");

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to deny device. Please try again.");
      toast.error("Failed to deny device");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!userCode || error) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
        <div className="absolute inset-0 grid-lines" />
        <div className="relative z-10 w-full max-w-sm">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 backdrop-blur-sm">
            <Alert variant="destructive" className="border-red-500/20 bg-transparent">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>{error || "Invalid device code"}</AlertDescription>
            </Alert>
            <Button
              onClick={() => router.push("/device")}
              className="mt-4 w-full"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
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
          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-2xl bg-[#00ff41]/10 p-3">
                <IconShieldCheck className="h-8 w-8 text-[#00ff41]" />
              </div>
            </div>
            <h1 className="mb-2 text-xl font-bold">Authorize Device</h1>
            <p className="text-sm text-muted-foreground">
              A device is requesting access to your account
            </p>
          </div>

          {/* User Info */}
          <div className="mb-6 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              {session?.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  height={40}
                  width={40}
                  className="h-10 w-10 rounded-full ring-2 ring-[#00ff41]/20"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00ff41]/10">
                  <span className="font-semibold text-[#00ff41]">
                    {session?.user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{session?.user.name}</p>
                <p className="text-xs text-muted-foreground">{session?.user.email}</p>
              </div>
            </div>
          </div>

          {/* Device Code Display */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconDeviceDesktop className="h-4 w-4" />
              <span>Device Code</span>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-black/20 p-4">
              <p className="text-center font-mono text-2xl font-semibold tracking-widest text-[#00ff41]">
                {userCode.match(/.{1,4}/g)?.join("-")}
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 border-red-500/20 bg-red-500/10">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              size="lg"
              className="w-full bg-[#00ff41] font-medium text-black hover:bg-[#00ff41]/90"
            >
              {isProcessing ? (
                <>
                  <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <IconCheck className="mr-2 h-5 w-5" />
                  Approve Device
                </>
              )}
            </Button>

            <Button
              onClick={handleDeny}
              disabled={isProcessing}
              size="lg"
              variant="outline"
              className="w-full border-white/10 hover:border-white/20"
            >
              {isProcessing ? (
                <>
                  <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <IconX className="mr-2 h-5 w-5" />
                  Deny Access
                </>
              )}
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="mb-4 text-xs text-muted-foreground">
              Only approve if you recognize this request
            </p>
            <div className="flex justify-center">
              <Logo size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
