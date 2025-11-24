import { Suspense } from "react";
import DeviceAuthorizationForm from "./authorization-form";

const DeviceAuthorizationPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <DeviceAuthorizationForm />
    </Suspense>
  );
};

export default DeviceAuthorizationPage;
