import { Suspense } from "react";
import ApproveDeviceAuthorization from "./approve-form";

const ApproveDeviceAuthorizationPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <ApproveDeviceAuthorization />
    </Suspense>
  );
};

export default ApproveDeviceAuthorizationPage;
