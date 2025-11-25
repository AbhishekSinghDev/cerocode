"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconAlertCircle, IconDeviceMobile, IconLoader2 } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import Logo from "@/components/shared/logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { deviceAuthorizationSchema } from "@/lib/zod-schema";

const DeviceAuthorizationForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm({
    resolver: zodResolver(deviceAuthorizationSchema),
    defaultValues: {
      userCode: "",
    },
  });

  const onSubmit = useCallback(
    async (data: { userCode: string }) => {
      try {
        const response = await authClient.device({
          query: { user_code: data.userCode },
        });

        console.log("Device authorization response:", response);

        if (response.data) {
          router.push(`/device/approve?user_code=${data.userCode}`);
        }

        if (response.error) {
          form.setError("root", {
            message:
              response.error.error_description || "An error occurred. Please try again.",
          });
        }
      } catch (err) {
        console.error(err);
        form.setError("root", {
          message: "Invalid or expired code. Please check and try again.",
        });
      }
    },
    [router, form]
  );

  // Auto-submit if user_code is in query params
  useEffect(() => {
    const userCode = searchParams.get("user_code");
    if (userCode && !form.formState.isSubmitting) {
      form.setValue("userCode", userCode);
      form.handleSubmit(onSubmit)();
    }
  }, [searchParams, form, onSubmit]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      {/* Grid background */}
      <div className="absolute inset-0 grid-lines" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Card */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-2xl bg-[#00ff41]/10 p-3">
                <IconDeviceMobile className="h-8 w-8 text-[#00ff41]" />
              </div>
            </div>
            <h1 className="mb-2 text-xl font-bold">Device Authorization</h1>
            <p className="text-sm text-muted-foreground">
              Enter the code displayed on your device
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ABCD-1234"
                        type="text"
                        className="h-12 border-white/10 bg-white/[0.02] text-center font-mono text-lg tracking-widest focus:border-[#00ff41]/50"
                        disabled={form.formState.isSubmitting}
                        maxLength={9}
                        autoComplete="off"
                        autoFocus
                      />
                    </FormControl>
                    <FormDescription className="text-center">
                      Enter the 8-character code shown on your device
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <Alert variant="destructive" className="border-red-500/20 bg-red-500/10">
                  <IconAlertCircle className="h-4 w-4" />
                  <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#00ff41] font-medium text-black hover:bg-[#00ff41]/90"
                disabled={form.formState.isSubmitting || !form.formState.isDirty}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center">
            <p className="mb-4 text-xs text-muted-foreground">
              This code will expire in 30 minutes
            </p>
            <div className="flex justify-center">
              <Logo size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceAuthorizationForm;
