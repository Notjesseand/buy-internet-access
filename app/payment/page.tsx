// // // app/payment/page.tsx
// // "use client";
// // import React, { useState } from "react";
// // import { useRouter, useSearchParams } from "next/navigation";
// // import { PaystackButton } from "react-paystack";
// // import { motion, AnimatePresence } from "framer-motion";
// // import {
// //   CheckCircle2,
// //   Loader2,
// //   Copy,
// //   Wifi,
// //   ShieldCheck,
// //   ArrowLeft,
// //   Sun,
// //   Moon,
// //   CreditCard,
// //   Clock,
// // } from "lucide-react";
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// // } from "@/components/ui/alert-dialog";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";

// // export default function PaymentPage() {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();

// //   // --- States ---
// //   const [email, setEmail] = useState("");
// //   const [isProcessing, setIsProcessing] = useState(false);
// //   const [showSuccess, setShowSuccess] = useState(false);
// //   const [creds, setCreds] = useState({ user: "", pass: "" });
// //   const [isDarkMode, setIsDarkMode] = useState(true);
// //   const [copied, setCopied] = useState(false);

// //   // --- Plan Data ---
// //   const plan = searchParams.get("plan") || "Internet Plan";
// //   const price = Number(searchParams.get("amount")) || 0;
// //   const duration = searchParams.get("duration") || "N/A";

// //   const modeClasses = {
// //     bg: isDarkMode ? "bg-[#09090b] text-white" : "bg-gray-50 text-gray-900",
// //     card: isDarkMode
// //       ? "bg-zinc-900/50 border-zinc-800"
// //       : "bg-white border-gray-200",
// //     textMuted: isDarkMode ? "text-zinc-400" : "text-gray-500",
// //     textMain: isDarkMode ? "text-white" : "text-gray-900",
// //     input: isDarkMode
// //       ? "bg-zinc-800 border-zinc-700 text-white"
// //       : "bg-white border-gray-300",
// //   };

// //   const handleCopy = () => {
// //     navigator.clipboard.writeText(`User: ${creds.user} | Pass: ${creds.pass}`);
// //     setCopied(true);
// //     setTimeout(() => setCopied(false), 2000);
// //   };

// //   const handlePaymentSuccess = async (ref: any) => {
// //     setIsProcessing(true);
// //     try {
// //       const res = await fetch("/api/create-user", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ email, plan, reference: ref.reference }),
// //       });
// //       const data = await res.json();
// //       if (data.success) {
// //         setCreds({
// //           user: data.credentials.username,
// //           pass: data.credentials.password,
// //         });
// //         setShowSuccess(true);
// //       } else {
// //         alert(
// //           "Payment OK, but router failed. Screenshot this: " + ref.reference
// //         );
// //       }
// //     } catch (e) {
// //       console.error(e);
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   return (
// //     <div
// //       className={`min-h-screen ${modeClasses.bg} flex items-center justify-center px-4 font-montserrat transition-colors`}
// //     >
// //       {/* --- Main UI --- */}
// //       <motion.div
// //         initial={{ opacity: 0 }}
// //         animate={{ opacity: 1 }}
// //         className="w-full max-w-md"
// //       >
// //         <Card
// //           className={`${modeClasses.card} rounded-3xl overflow-hidden border-t-4 border-t-green-500 shadow-2xl`}
// //         >
// //           <CardContent className="p-8">
// //             <h1
// //               className={`text-2xl font-bold text-center mb-6 ${modeClasses.textMain}`}
// //             >
// //               Confirm Purchase
// //             </h1>

// //             <div className="space-y-4 mb-6 bg-zinc-800/20 p-4 rounded-2xl border border-zinc-800/50">
// //               <div className="flex justify-between">
// //                 <span className={modeClasses.textMuted}>Plan</span>
// //                 <span className={`font-bold ${modeClasses.textMain}`}>
// //                   {plan}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className={modeClasses.textMuted}>Duration</span>
// //                 <span className={`font-bold ${modeClasses.textMain}`}>
// //                   {duration}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between border-t border-zinc-800 pt-3">
// //                 <span className={modeClasses.textMuted}>Total</span>
// //                 <span className="text-xl font-black text-green-500">
// //                   ₦{price.toLocaleString()}
// //                 </span>
// //               </div>
// //             </div>

// //             <input
// //               type="email"
// //               placeholder="Enter email for receipt"
// //               className={`w-full py-3 px-4 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-green-500 border ${modeClasses.input}`}
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //             />

// //             {email.includes("@") ? (
// //               <PaystackButton
// //                 email={email}
// //                 amount={price * 100}
// //                 publicKey="pk_test_f4bb6faaa17361ba06f48b7f0308545df0675be3"
// //                 text="Proceed to Payment"
// //                 onSuccess={handlePaymentSuccess}
// //                 className="w-full bg-green-600 py-4 rounded-2xl font-bold text-white hover:bg-green-500 transition-all"
// //               />
// //             ) : (
// //               <Button disabled className="w-full py-6 rounded-2xl opacity-50">
// //                 Enter Valid Email
// //               </Button>
// //             )}
// //           </CardContent>
// //         </Card>
// //       </motion.div>

// //       {/* --- SUCCESS POPUP --- */}
// //       <AlertDialog open={showSuccess} onOpenChange={setShowSuccess} >
// //         <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-3xl font-montserrat max-w-sm">
// //           <AlertDialogHeader>
// //             <div className="flex justify-center mb-4">
// //               <div className="bg-green-500/10 p-4 rounded-full">
// //                 <CheckCircle2 className="w-12 h-12 text-green-500" />
// //               </div>
// //             </div>
// //             <AlertDialogTitle className="text-center text-2xl font-black">
// //               WiFi Ready!
// //             </AlertDialogTitle>
// //             <AlertDialogDescription className="text-center text-zinc-400">
// //               Use these credentials on the login page.
// //             </AlertDialogDescription>
// //           </AlertDialogHeader>

// //           <div className="bg-black/40 border border-zinc-800 rounded-2xl p-5 space-y-4 my-2 relative group">
// //             <button
// //               onClick={handleCopy}
// //               className="absolute top-2 right-2 text-zinc-500 hover:text-green-500 transition-colors"
// //             >
// //               {copied ? (
// //                 <CheckCircle2 className="w-4 h-4 text-green-500" />
// //               ) : (
// //                 <Copy className="w-4 h-4" />
// //               )}
// //             </button>
// //             <div className="flex justify-between items-center">
// //               <span className="text-[10px] uppercase tracking-tighter text-zinc-500">
// //                 Username
// //               </span>
// //               <span className="font-mono text-lg font-bold text-green-400">
// //                 {creds.user}
// //               </span>
// //             </div>
// //             <div className="flex justify-between items-center">
// //               <span className="text-[10px] uppercase tracking-tighter text-zinc-500">
// //                 Password
// //               </span>
// //               <span className="font-mono text-lg font-bold text-green-400">
// //                 {creds.pass}
// //               </span>
// //             </div>
// //           </div>

// //           <AlertDialogFooter>
// //             <AlertDialogAction
// //               onClick={() => (window.location.href = "http://192.168.20.1")}
// //               className="bg-green-600 hover:bg-green-700 w-full py-6 rounded-xl font-bold"
// //             >
// //               Connect Now
// //             </AlertDialogAction>
// //           </AlertDialogFooter>
// //         </AlertDialogContent>
// //       </AlertDialog>

// //       {/* --- PROCESSING OVERLAY --- */}
// //       <AnimatePresence>
// //         {isProcessing && (
// //           <motion.div
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             exit={{ opacity: 0 }}
// //             className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-center px-6"
// //           >
// //             <div className="relative mb-6">
// //               <Loader2 className="w-16 h-16 text-green-500 animate-spin" />
// //               <Wifi className="w-6 h-6 text-white absolute inset-0 m-auto" />
// //             </div>
// //             <h2 className="text-2xl font-black text-white mb-2">
// //               Activating Access...
// //             </h2>
// //             <p className="text-zinc-500 max-w-xs">
// //               Connecting to Abia Tech Hub router to set up your account. Don&apos;t
// //               close this window.
// //             </p>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </div>
// //   );
// // }

// "use client";

// import React, { useState } from "react";
// import dynamic from "next/dynamic";
// import { useSearchParams } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { CheckCircle2, Loader2, Copy, Wifi } from "lucide-react";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// /* ---------------- PAYSTACK (SSR SAFE) ---------------- */
// const PaystackButton = dynamic(
//   () => import("react-paystack").then((mod) => mod.PaystackButton),
//   { ssr: false }
// );

// export default function PaymentPage() {
//   const searchParams = useSearchParams();

//   /* ---------------- STATE ---------------- */
//   const [email, setEmail] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [copied, setCopied] = useState(false);

//   const [creds, setCreds] = useState({
//     user: "",
//     pass: "",
//   });

//   /* ---------------- PLAN DATA ---------------- */
//   const plan = searchParams.get("plan") || "Internet Plan";
//   const price = Number(searchParams.get("amount")) || 0;
//   const duration = searchParams.get("duration") || "N/A";

//   /* ---------------- HELPERS ---------------- */
//   const handleCopy = () => {
//     if (typeof window !== "undefined") {
//       navigator.clipboard.writeText(
//         `Username: ${creds.user} | Password: ${creds.pass}`
//       );
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   const connectNow = () => {
//     if (typeof window !== "undefined") {
//       window.location.href = "http://192.168.20.1";
//     }
//   };

//   const handlePaymentSuccess = async (ref: any) => {
//     setIsProcessing(true);

//     try {
//       const res = await fetch("/api/create-user", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email,
//           plan,
//           reference: ref.reference,
//         }),
//       });

//       const data = await res.json();

//       if (!data.success) {
//         alert("Payment succeeded but router failed. Contact support.");
//         return;
//       }

//       setCreds({
//         user: data.credentials.username,
//         pass: data.credentials.password,
//       });

//       setShowSuccess(true);
//     } catch (err) {
//       console.error(err);
//       alert("Unexpected error. Please contact support.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-4 font-montserrat">
//       {/* ---------- MAIN CARD ---------- */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="w-full max-w-md"
//       >
//         <Card className="bg-zinc-900/50 border-zinc-800 rounded-3xl shadow-2xl border-t-4 border-t-green-500">
//           <CardContent className="p-8">
//             <h1 className="text-2xl font-bold text-center mb-6">
//               Confirm Purchase
//             </h1>

//             {/* ---------- SUMMARY ---------- */}
//             <div className="space-y-4 mb-6 bg-zinc-800/20 p-4 rounded-2xl border border-zinc-800/50">
//               <div className="flex justify-between">
//                 <span className="text-zinc-400">Plan</span>
//                 <span className="font-bold">{plan}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span className="text-zinc-400">Duration</span>
//                 <span className="font-bold">{duration}</span>
//               </div>

//               <div className="flex justify-between border-t border-zinc-800 pt-3">
//                 <span className="text-zinc-400">Total</span>
//                 <span className="text-xl font-black text-green-500">
//                   ₦{price.toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             {/* ---------- EMAIL ---------- */}
//             <input
//               type="email"
//               placeholder="Enter email for receipt"
//               className="w-full py-3 px-4 rounded-xl mb-6 outline-none border border-zinc-700 bg-zinc-800 text-white focus:ring-2 focus:ring-green-500"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />

//             {/* ---------- PAY ---------- */}
//             {email.includes("@") ? (
//               <PaystackButton
//                 email={email}
//                 amount={price * 100}
//                 publicKey="pk_test_f4bb6faaa17361ba06f48b7f0308545df0675be3"
//                 text="Proceed to Payment"
//                 onSuccess={handlePaymentSuccess}
//                 className="w-full bg-green-600 py-4 rounded-2xl font-bold hover:bg-green-500 transition-all"
//               />
//             ) : (
//               <Button disabled className="w-full py-6 rounded-2xl opacity-50">
//                 Enter valid email
//               </Button>
//             )}
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* ---------- SUCCESS MODAL ---------- */}
//       <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
//         <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-3xl max-w-sm">
//           <AlertDialogHeader>
//             <div className="flex justify-center mb-4">
//               <div className="bg-green-500/10 p-4 rounded-full">
//                 <CheckCircle2 className="w-12 h-12 text-green-500" />
//               </div>
//             </div>

//             <AlertDialogTitle className="text-center text-2xl font-black">
//               WiFi Ready!
//             </AlertDialogTitle>

//             <AlertDialogDescription className="text-center text-zinc-400">
//               Use these credentials to log in.
//             </AlertDialogDescription>
//           </AlertDialogHeader>

//           <div className="bg-black/40 border border-zinc-800 rounded-2xl p-5 space-y-4 my-2 relative">
//             <button
//               onClick={handleCopy}
//               className="absolute top-2 right-2 text-zinc-500 hover:text-green-500"
//             >
//               {copied ? (
//                 <CheckCircle2 className="w-4 h-4 text-green-500" />
//               ) : (
//                 <Copy className="w-4 h-4" />
//               )}
//             </button>

//             <div className="flex justify-between">
//               <span className="text-[10px] uppercase text-zinc-500">
//                 Username
//               </span>
//               <span className="font-mono text-lg font-bold text-green-400">
//                 {creds.user}
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-[10px] uppercase text-zinc-500">
//                 Password
//               </span>
//               <span className="font-mono text-lg font-bold text-green-400">
//                 {creds.pass}
//               </span>
//             </div>
//           </div>

//           <AlertDialogFooter>
//             <AlertDialogAction
//               onClick={connectNow}
//               className="bg-green-600 hover:bg-green-700 w-full py-6 rounded-xl font-bold"
//             >
//               Connect Now
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* ---------- PROCESSING OVERLAY ---------- */}
//       <AnimatePresence>
//         {isProcessing && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center"
//           >
//             <Loader2 className="w-16 h-16 text-green-500 animate-spin mb-4" />
//             <p className="text-zinc-400">Activating your internet access…</p>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

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
