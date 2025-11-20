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
import { Input } from "@/components/ui/input";
import { authClient } from "@/server/better-auth/client";
import {
  IconAlertCircle,
  IconDeviceMobile,
  IconLoader2,
} from "@tabler/icons-react";
import { useState, type FormEvent } from "react";

const DeviceAuthorizationForm = () => {
  const [userCode, setUserCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Format the code: remove dashes and convert to uppercase
      const formattedCode = userCode.trim().replace(/-/g, "").toUpperCase();

      if (!formattedCode) {
        setError("Please enter a device code");
        setIsLoading(false);
        return;
      }

      // Check if the code is valid using GET /device endpoint
      const response = await authClient.device({
        query: { user_code: formattedCode },
      });

      if (response.data) {
        // Redirect to approval page
        window.location.href = `/device/approve?user_code=${formattedCode}`;
      }
    } catch (err) {
      setError("Invalid or expired code. Please check and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format input as user types (add dash after 4 characters)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/-/g, "");

    // Limit to 8 characters (4-4 format)
    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    // Add dash after 4 characters
    if (value.length > 4) {
      value = `${value.slice(0, 4)}-${value.slice(4)}`;
    }

    setUserCode(value);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/20 px-4">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute left-1/4 top-0 -z-10 h-96 w-96 rounded-full bg-[#FF6B6B]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#06B6D4]/20 blur-3xl" />

      <Card className="w-full max-w-md border-2 border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex items-center justify-center rounded-2xl bg-[#FF6B6B]/10 p-3">
              <IconDeviceMobile className="h-8 w-8 text-[#FF6B6B]" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">
              Device Authorization
            </CardTitle>
            <CardDescription className="text-base">
              Enter the code displayed on your device to authorize it
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="device-code"
                className="text-sm font-medium text-foreground"
              >
                Device Code
              </label>
              <Input
                id="device-code"
                type="text"
                value={userCode}
                onChange={handleInputChange}
                placeholder="ABCD-1234"
                className="text-center text-lg tracking-widest font-mono h-12"
                disabled={isLoading}
                maxLength={9} // 8 chars + 1 dash
                autoComplete="off"
                autoFocus
              />
              <p className="text-xs text-muted-foreground text-center">
                Enter the 8-character code shown on your device
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <IconAlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#FF6B6B] hover:bg-[#FF6B6B]/90"
              disabled={isLoading || !userCode}
            >
              {isLoading ? (
                <>
                  <IconLoader2 className="animate-spin mr-2 h-5 w-5" />
                  Verifying...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>

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
            <p className="text-sm text-muted-foreground">
              This code will expire in 30 minutes
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
};

export default DeviceAuthorizationForm;
