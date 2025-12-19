
import dynamic from "next/dynamic";
import { Suspense } from "react";

const PaymentClient = dynamic(() => import("./paymentClient"), { ssr: false });

export default function PaymentPage() {
  return (
    <Suspense fallback={null}>
      <PaymentClient />
    </Suspense>
  );
}
