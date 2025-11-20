"use client";

import Logo from "@/components/shared/logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/server/better-auth/client";
import {
  IconAlertCircle,
  IconCheck,
  IconDeviceDesktop,
  IconLoader2,
  IconShieldCheck,
  IconX,
} from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type DeviceInfo = {
  userCode: string;
  clientId?: string;
  scope?: string;
  expiresAt?: Date;
};

export default function ApproveDeviceAuthorization() {
  const { data: session } = authClient.useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userCode = searchParams.get("user_code");

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isLoadingDevice, setIsLoadingDevice] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!session?.user && !isLoadingDevice) {
      router.push(`/login?redirect=/device/approve?user_code=${userCode}`);
    }
  }, [session, router, userCode, isLoadingDevice]);

  useEffect(() => {
    // Fetch device information
    const fetchDeviceInfo = async () => {
      if (!userCode) {
        setError("Invalid device code");
        setIsLoadingDevice(false);
        return;
      }

      try {
        const response = await authClient.device({
          query: { user_code: userCode },
        });

        if (response.data) {
          setDeviceInfo({
            userCode,
            // These properties may or may not be returned
            clientId: (response.data as any).clientId,
            scope: (response.data as any).scope,
            expiresAt: (response.data as any).expiresAt
              ? new Date((response.data as any).expiresAt)
              : undefined,
          });
        }
      } catch (err) {
        setError("Failed to load device information");
      } finally {
        setIsLoadingDevice(false);
      }
    };

    fetchDeviceInfo();
  }, [userCode]);

  const handleApprove = async () => {
    if (!userCode) return;

    setIsProcessing(true);
    setError(null);

    try {
      await authClient.device.approve({
        userCode: userCode,
      });

      toast.success("Device approved successfully!", {
        description: "You can now return to your device",
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
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
      setError("Failed to deny device. Please try again.");
      toast.error("Failed to deny device");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingDevice) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/20 px-4">
        <div className="flex flex-col items-center gap-4">
          <IconLoader2 className="h-8 w-8 animate-spin text-[#FF6B6B]" />
          <p className="text-muted-foreground">Loading device information...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null; // Will redirect via useEffect
  }

  if (!userCode || error) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/20 px-4">
        <Card className="w-full max-w-md border-2 border-destructive/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "Invalid device code"}
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => router.push("/device")}
              className="w-full mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format user code for display
  const formattedCode =
    deviceInfo?.userCode.match(/.{1,4}/g)?.join("-") || userCode;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/20 px-4">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute left-1/4 top-0 -z-10 h-96 w-96 rounded-full bg-[#FF6B6B]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#06B6D4]/20 blur-3xl" />

      <Card className="w-full max-w-md border-2 border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex items-center justify-center rounded-2xl bg-[#FF6B6B]/10 p-3">
              <IconShieldCheck className="h-8 w-8 text-[#FF6B6B]" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">
              Authorize Device
            </CardTitle>
            <CardDescription className="text-base">
              A device is requesting access to your account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center gap-3">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="h-10 w-10 rounded-full ring-2 ring-[#FF6B6B]/20"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-[#FF6B6B]/20 flex items-center justify-center">
                  <span className="text-[#FF6B6B] font-semibold">
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-sm">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Device Code Display */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <IconDeviceDesktop className="h-4 w-4 text-muted-foreground" />
              <span>Device Code</span>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <p className="text-center text-2xl font-mono font-semibold tracking-widest text-[#FF6B6B]">
                {formattedCode}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          {(deviceInfo?.clientId || deviceInfo?.scope) && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              {deviceInfo.clientId && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Client ID:</span>
                  <span className="font-medium">{deviceInfo.clientId}</span>
                </div>
              )}
              {deviceInfo.scope && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Scope:</span>
                  <span className="font-medium">{deviceInfo.scope}</span>
                </div>
              )}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
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
              className="w-full bg-[#FF6B6B] hover:bg-[#FF6B6B]/90"
            >
              {isProcessing ? (
                <>
                  <IconLoader2 className="animate-spin mr-2 h-5 w-5" />
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
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <IconLoader2 className="animate-spin mr-2 h-5 w-5" />
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Secure Authorization
              </span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Only approve if you recognize this request and are actively trying
              to sign in from another device.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Logo className="h-5 w-5" />
              <span className="text-xs font-medium text-muted-foreground">
                Powered by <span className="text-[#FF6B6B]">CERO</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
