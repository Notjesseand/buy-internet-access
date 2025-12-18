// "use client";

// import { useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { CheckCircle2, Copy, Loader2 } from "lucide-react";
// import { PaystackButton } from "react-paystack";

// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogAction,
// } from "@radix-ui/react-alert-dialog";

// import {
//   AlertDialogHeader,
//   AlertDialogFooter,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

// /* ---------------- TYPES ---------------- */
// type Credentials = {
//   user: string;
//   pass: string;
// };

// /* ---------------- COMPONENT ---------------- */
// export default function PaymentClient() {
//   const searchParams = useSearchParams();

//   /* ---------------- PARAMS ---------------- */
//   const plan = searchParams.get("plan") ?? "Basic";

//   /* ---------------- PLAN CONFIG ---------------- */
//   const PLAN_CONFIG: Record<string, { price: number; duration: string }> = {
//     Basic: { price: 1000, duration: "24 Hours" },
//     Weekly: { price: 5000, duration: "7 Days" },
//     Monthly: { price: 15000, duration: "30 Days" },
//   };

//   const { price, duration } = PLAN_CONFIG[plan] ?? PLAN_CONFIG.Basic;

//   /* ---------------- STATE ---------------- */
//   const [email, setEmail] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [copied, setCopied] = useState(false);

//   const [creds, setCreds] = useState<Credentials>({
//     user: "",
//     pass: "",
//   });

//   /* ---------------- HANDLERS ---------------- */
//   async function handlePaymentSuccess() {
//     setIsProcessing(true);

//     try {
//       // Call your backend API that creates MikroTik user
//       const res = await fetch("/api/create-user", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email,
//           plan,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to create hotspot user");
//       }

//       const data = await res.json();

//       setCreds({
//         user: data.username,
//         pass: data.password,
//       });

//       setShowSuccess(true);
//     } catch (err) {
//       console.error(err);
//       alert("Payment succeeded, but activation failed.");
//     } finally {
//       setIsProcessing(false);
//     }
//   }

//   function handleCopy() {
//     navigator.clipboard.writeText(
//       `Username: ${creds.user}\nPassword: ${creds.pass}`
//     );
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   }

//   function connectNow() {
//     window.location.href = "http://192.168.10.1/login";
//   }

//   /* ---------------- RENDER ---------------- */
//   return (
//     <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-4 font-montserrat">
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

//             {/* SUMMARY */}
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

//             {/* EMAIL */}
//             <input
//               type="email"
//               placeholder="Enter email for receipt"
//               className="w-full py-3 px-4 rounded-xl mb-6 outline-none border border-zinc-700 bg-zinc-800 text-white focus:ring-2 focus:ring-green-500"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />

//             {/* PAYSTACK */}
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

//       {/* SUCCESS MODAL */}
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

//       {/* PROCESSING OVERLAY */}
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


// // server side code 
// // app/payment/paymentClient.tsx
// "use client";

// import { useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { CheckCircle2, Copy, Loader2 } from "lucide-react";
// import { PaystackButton } from "react-paystack";

// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogAction,
// } from "@radix-ui/react-alert-dialog";

// import {
//   AlertDialogHeader,
//   AlertDialogFooter,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

// /* ---------------- TYPES ---------------- */
// type Credentials = {
//   user: string;
//   pass: string;
// };

// export default function PaymentClient() {
//   const searchParams = useSearchParams();
//   const plan = searchParams.get("plan") ?? "Basic";

//   /* ---------------- PLAN CONFIG ---------------- */
//   const PLAN_CONFIG: Record<string, { price: number; duration: string }> = {
//     Basic: { price: 1000, duration: "24 Hours" },
//     Weekly: { price: 5000, duration: "7 Days" },
//     Monthly: { price: 15000, duration: "30 Days" },
//   };

//   const { price, duration } = PLAN_CONFIG[plan] ?? PLAN_CONFIG.Basic;

//   /* ---------------- STATE ---------------- */
//   const [email, setEmail] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [copied, setCopied] = useState(false);

//   const [creds, setCreds] = useState<Credentials>({
//     user: "",
//     pass: "",
//   });

//   /* ---------------- HANDLERS ---------------- */
//   async function handlePaymentSuccess() {
//     setIsProcessing(true);

//     try {
//       const res = await fetch("/api/create-user", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, plan }),
//       });

//       if (!res.ok) throw new Error("Activation failed");

//       const data = await res.json();
//       setCreds({ user: data.username, pass: data.password });
//       setShowSuccess(true);
//     } catch (err) {
//       alert("Payment succeeded but activation failed");
//       console.error(err);
//     } finally {
//       setIsProcessing(false);
//     }
//   }

//   function handleCopy() {
//     navigator.clipboard.writeText(
//       `Username: ${creds.user}\nPassword: ${creds.pass}`
//     );
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   }

//   function connectNow() {
//     window.location.href = "http://192.168.10.1/login";
//   }

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-4">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="w-full max-w-md"
//       >
//         <Card className="bg-zinc-900/50 border-zinc-800 rounded-3xl border-t-4 border-t-green-500">
//           <CardContent className="p-8">
//             <h1 className="text-2xl font-bold text-center mb-6">
//               Confirm Purchase
//             </h1>

//             <div className="space-y-4 mb-6 bg-zinc-800/20 p-4 rounded-2xl">
//               <div className="flex justify-between">
//                 <span className="text-zinc-400">Plan</span>
//                 <span className="font-bold">{plan}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-zinc-400">Duration</span>
//                 <span className="font-bold">{duration}</span>
//               </div>
//               <div className="flex justify-between border-t pt-3">
//                 <span>Total</span>
//                 <span className="text-green-500 font-black">
//                   ₦{price.toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             <input
//               type="email"
//               placeholder="Enter email"
//               className="w-full py-3 px-4 rounded-xl mb-6 bg-zinc-800 border border-zinc-700"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />

//             {email.includes("@") ? (
//               <PaystackButton
//                 email={email}
//                 amount={price * 100}
//                 publicKey="pk_test_f4bb6faaa17361ba06f48b7f0308545df0675be3"
//                 text="Pay Now"
//                 onSuccess={handlePaymentSuccess}
//                 className="w-full bg-green-600 py-4 rounded-2xl font-bold"
//               />
//             ) : (
//               <Button disabled className="w-full py-6 rounded-2xl opacity-50">
//                 Enter valid email
//               </Button>
//             )}
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* SUCCESS */}
//       <AlertDialog open={showSuccess}>
//         <AlertDialogContent className="bg-zinc-900 text-white rounded-3xl">
//           <AlertDialogHeader>
//             <AlertDialogTitle className="text-center text-2xl">
//               WiFi Ready
//             </AlertDialogTitle>
//             <AlertDialogDescription className="text-center">
//               Use these credentials
//             </AlertDialogDescription>
//           </AlertDialogHeader>

//           <div className="bg-black/40 p-4 rounded-xl relative">
//             <button onClick={handleCopy} className="absolute top-2 right-2">
//               {copied ? <CheckCircle2 /> : <Copy />}
//             </button>
//             <p>Username: {creds.user}</p>
//             <p>Password: {creds.pass}</p>
//           </div>

//           <AlertDialogFooter>
//             <AlertDialogAction
//               onClick={connectNow}
//               className="bg-green-600 w-full py-4 rounded-xl"
//             >
//               Connect Now
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       <AnimatePresence>
//         {isProcessing && (
//           <motion.div className="fixed inset-0 bg-black/90 flex items-center justify-center">
//             <Loader2 className="w-16 h-16 animate-spin text-green-500" />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


// "use client";

// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import { PaystackButton } from "react-paystack";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   CheckCircle2,
//   Loader2,
//   Copy,
//   Wifi,
//   Sun,
//   Moon,
//   ArrowLeft,
// } from "lucide-react";

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

// export default function PaymentClient() {
//   const searchParams = useSearchParams();

//   // --- States ---
//   const [email, setEmail] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [creds, setCreds] = useState({ user: "", pass: "" });
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [copied, setCopied] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // --- Plan Data Configuration ---
//   const plan = searchParams.get("plan") || "Internet Plan";
//   const price = Number(searchParams.get("amount")) || 0;
//   const duration = searchParams.get("duration") || "N/A";

//   // --- Theme Classes ---
//   const theme = {
//     bg: isDarkMode ? "bg-[#09090b] text-white" : "bg-gray-50 text-gray-900",
//     card: isDarkMode
//       ? "bg-zinc-900/50 border-zinc-800"
//       : "bg-white border-gray-200 shadow-xl",
//     textMuted: isDarkMode ? "text-zinc-400" : "text-gray-500",
//     textMain: isDarkMode ? "text-white" : "text-gray-900",
//     input: isDarkMode
//       ? "bg-zinc-800 border-zinc-700 text-white"
//       : "bg-white border-gray-300 text-gray-900",
//   };

//   const handleCopy = () => {
//     navigator.clipboard.writeText(`User: ${creds.user} | Pass: ${creds.pass}`);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handlePaymentSuccess = async (ref: any) => {
//     setIsProcessing(true);
//     try {
//       const res = await fetch("/api/create-user", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, plan, reference: ref.reference }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setCreds({
//           user: data.credentials.username,
//           pass: data.credentials.password,
//         });
//         setShowSuccess(true);
//       } else {
//         alert("Payment verified, but router failed. Please contact support.");
//       }
//     } catch (e) {
//       console.error(e);
//       alert("An error occurred during account activation.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (!mounted) return null;

//   return (
//     <div
//       className={`min-h-screen ${theme.bg} flex flex-col items-center justify-center px-4 font-montserrat transition-colors duration-300`}
//     >
//       {/* Theme Toggle & Back Button */}
//       <div className="fixed top-6 left-6 right-6 flex justify-between items-center max-w-5xl mx-auto w-full">
//         <button
//           onClick={() => window.history.back()}
//           className={`p-2 rounded-full hover:bg-zinc-500/10 transition-colors ${theme.textMain}`}
//         >
//           <ArrowLeft className="w-6 h-6" />
//         </button>
//         <button
//           onClick={() => setIsDarkMode(!isDarkMode)}
//           className={`p-2 rounded-full hover:bg-zinc-500/10 transition-colors ${theme.textMain}`}
//         >
//           {isDarkMode ? (
//             <Sun className="w-6 h-6" />
//           ) : (
//             <Moon className="w-6 h-6" />
//           )}
//         </button>
//       </div>

//       {/* --- Main Payment Card --- */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md"
//       >
//         <Card
//           className={`${theme.card} rounded-3xl overflow-hidden border-t-4 border-t-green-500 shadow-2xl`}
//         >
//           <CardContent className="p-8">
//             <h1
//               className={`text-2xl font-black text-center mb-6 uppercase tracking-tight ${theme.textMain}`}
//             >
//               Confirm Purchase
//             </h1>

//             <div
//               className={`space-y-4 mb-8 ${
//                 isDarkMode ? "bg-zinc-800/30" : "bg-gray-100"
//               } p-5 rounded-2xl border ${
//                 isDarkMode ? "border-zinc-800/50" : "border-gray-200"
//               }`}
//             >
//               <div className="flex justify-between items-center">
//                 <span className={theme.textMuted}>Selected Plan</span>
//                 <span className={`font-bold ${theme.textMain}`}>{plan}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className={theme.textMuted}>Validity</span>
//                 <span className={`font-bold ${theme.textMain}`}>
//                   {duration}
//                 </span>
//               </div>
//               <div
//                 className={`flex justify-between items-center border-t ${
//                   isDarkMode ? "border-zinc-800" : "border-gray-200"
//                 } pt-4 mt-2`}
//               >
//                 <span className={`font-bold ${theme.textMain}`}>
//                   Grand Total
//                 </span>
//                 <span className="text-2xl font-black text-green-500">
//                   ₦{price.toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             <div className="space-y-2 mb-6">
//               <label
//                 className={`text-xs uppercase font-bold tracking-widest ml-1 ${theme.textMuted}`}
//               >
//                 Email for Receipt
//               </label>
//               <input
//                 type="email"
//                 placeholder="example@mail.com"
//                 className={`w-full py-4 px-5 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 border transition-all ${theme.input}`}
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             {email.includes("@") && email.length > 5 ? (
//               <PaystackButton
//                 email={email}
//                 amount={price * 100}
//                 publicKey="pk_test_f4bb6faaa17361ba06f48b7f0308545df0675be3"
//                 text="Secure Checkout"
//                 onSuccess={handlePaymentSuccess}
//                 className="w-full bg-green-600 py-5 rounded-2xl font-black text-white hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/20 transition-all active:scale-[0.98]"
//               />
//             ) : (
//               <Button
//                 disabled
//                 className="w-full py-7 rounded-2xl opacity-40 font-bold bg-zinc-700"
//               >
//                 Continue to Payment
//               </Button>
//             )}
//             <p
//               className={`text-center text-[10px] mt-4 uppercase tracking-widest font-medium ${theme.textMuted}`}
//             >
//               Encrypted & Secure Payment by Paystack
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* --- SUCCESS POPUP --- */}
//       <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
//         <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-[2rem] font-montserrat max-w-sm p-8 shadow-2xl border-t-4 border-green-500">
//           <AlertDialogHeader>
//             <div className="flex justify-center mb-6">
//               <div className="bg-green-500/10 p-5 rounded-full ring-8 ring-green-500/5">
//                 <CheckCircle2 className="w-14 h-14 text-green-500" />
//               </div>
//             </div>
//             <AlertDialogTitle className="text-center text-3xl font-black tracking-tight">
//               WiFi Activated!
//             </AlertDialogTitle>
//             <AlertDialogDescription className="text-center text-zinc-400 text-base mt-2">
//               Your credentials are ready. Use them on the login page to start
//               browsing.
//             </AlertDialogDescription>
//           </AlertDialogHeader>

//           <div className="bg-black/40 border border-zinc-800 rounded-2xl p-6 space-y-5 my-6 relative overflow-hidden group">
//             <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
//               <Wifi className="w-12 h-12" />
//             </div>

//             <button
//               onClick={handleCopy}
//               className="absolute top-4 right-4 text-zinc-500 hover:text-green-500 transition-all active:scale-90"
//             >
//               {copied ? (
//                 <CheckCircle2 className="w-5 h-5 text-green-500" />
//               ) : (
//                 <Copy className="w-5 h-5" />
//               )}
//             </button>

//             <div className="flex flex-col">
//               <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 mb-1">
//                 Hotspot Username
//               </span>
//               <span className="font-mono text-xl font-bold text-green-400 tracking-wider">
//                 {creds.user}
//               </span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 mb-1">
//                 Hotspot Password
//               </span>
//               <span className="font-mono text-xl font-bold text-green-400 tracking-wider">
//                 {creds.pass}
//               </span>
//             </div>
//           </div>

//           <AlertDialogFooter>
//             <AlertDialogAction
//               onClick={() => (window.location.href = "http://192.168.20.1")}
//               className="bg-green-600 hover:bg-green-700 w-full py-7 rounded-2xl font-black text-lg shadow-xl shadow-green-500/10 transition-all"
//             >
//               Connect Now
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* --- PROCESSING OVERLAY --- */}
//       <AnimatePresence>
//         {isProcessing && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center text-center px-6"
//           >
//             <div className="relative mb-8">
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                 className="w-24 h-24 border-4 border-green-500/20 border-t-green-500 rounded-full"
//               />
//               <Wifi className="w-8 h-8 text-white absolute inset-0 m-auto animate-pulse" />
//             </div>
//             <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
//               Configuring Access...
//             </h2>
//             <p className="text-zinc-500 max-w-xs text-lg leading-relaxed">
//               We are connecting to the Abia Tech Hub router to authorize your
//               device.
//             </p>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaystackButton } from "react-paystack";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Copy,
  Wifi,
  Sun,
  Moon,
  ArrowLeft,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- States ---
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix for Hydration & window is not defined
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- Plan Data Configuration ---
  const plan = searchParams.get("plan") || "Internet Plan";
  const price = Number(searchParams.get("amount")) || 0;
  const duration = searchParams.get("duration") || "N/A";

  // --- Theme Classes (Original Design) ---
  const theme = {
    bg: isDarkMode ? "bg-[#09090b] text-white" : "bg-gray-50 text-gray-900",
    card: isDarkMode
      ? "bg-zinc-900/50 border-zinc-800"
      : "bg-white border-gray-200 shadow-xl",
    textMuted: isDarkMode ? "text-zinc-400" : "text-gray-500",
    textMain: isDarkMode ? "text-white" : "text-gray-900",
    input: isDarkMode
      ? "bg-zinc-800 border-zinc-700 text-white"
      : "bg-white border-gray-300 text-gray-900",
  };

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(
        `User: ${creds.user} | Pass: ${creds.pass}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePaymentSuccess = async (ref: any) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan, reference: ref.reference }),
      });
      const data = await res.json();
      if (data.success) {
        setCreds({
          user: data.credentials.username,
          pass: data.credentials.password,
        });
        setShowSuccess(true);
      } else {
        alert(
          "Payment OK, but router failed. Screenshot this: " + ref.reference
        );
      }
    } catch (e) {
      console.error(e);
      alert("Activation failed. Please check your internet and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen ${theme.bg} flex flex-col items-center justify-center px-4 font-montserrat transition-colors duration-300`}
    >
      {/* --- Top Navigation & Theme Toggle --- */}
      <div className="fixed top-6 left-6 right-6 flex justify-between items-center max-w-5xl mx-auto w-full">
        <button
          onClick={() => router.back()}
          className={`p-2 rounded-full hover:bg-zinc-500/10 transition-colors ${theme.textMain}`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-full hover:bg-zinc-500/10 transition-colors ${theme.textMain}`}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* --- Main Card --- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card
          className={`${theme.card} rounded-3xl overflow-hidden border-t-4 border-t-green-500 shadow-2xl`}
        >
          <CardContent className="p-8">
            <h1
              className={`text-2xl font-bold text-center mb-6 ${theme.textMain}`}
            >
              Confirm Purchase
            </h1>

            <div
              className={`space-y-4 mb-6 ${
                isDarkMode ? "bg-zinc-800/20" : "bg-gray-100/50"
              } p-4 rounded-2xl border ${
                isDarkMode ? "border-zinc-800/50" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between">
                <span className={theme.textMuted}>Plan</span>
                <span className={`font-bold ${theme.textMain}`}>{plan}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textMuted}>Duration</span>
                <span className={`font-bold ${theme.textMain}`}>
                  {duration}
                </span>
              </div>
              <div
                className={`flex justify-between border-t ${
                  isDarkMode ? "border-zinc-800" : "border-gray-200"
                } pt-3`}
              >
                <span className={theme.textMuted}>Total</span>
                <span className="text-xl font-black text-green-500">
                  ₦{price.toLocaleString()}
                </span>
              </div>
            </div>

            <input
              type="email"
              placeholder="Enter email for receipt"
              className={`w-full py-3 px-4 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-green-500 border transition-all ${theme.input}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {email.includes("@") ? (
              <PaystackButton
                email={email}
                amount={price * 100}
                publicKey="pk_test_f4bb6faaa17361ba06f48b7f0308545df0675be3"
                text="Proceed to Payment"
                onSuccess={handlePaymentSuccess}
                className="w-full bg-green-600 py-4 rounded-2xl font-bold text-white hover:bg-green-500 transition-all active:scale-[0.98]"
              />
            ) : (
              <Button disabled className="w-full py-6 rounded-2xl opacity-50">
                Enter Valid Email
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* --- ORIGINAL POPUP UI --- */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-3xl font-montserrat max-w-sm">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-500/10 p-4 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl font-black">
              WiFi Ready!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-zinc-400">
              Use these credentials on the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="bg-black/40 border border-zinc-800 rounded-2xl p-5 space-y-4 my-2 relative group">
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 text-zinc-500 hover:text-green-500 transition-colors"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-tighter text-zinc-500">
                Username
              </span>
              <span className="font-mono text-lg font-bold text-green-400">
                {creds.user}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-tighter text-zinc-500">
                Password
              </span>
              <span className="font-mono text-lg font-bold text-green-400">
                {creds.pass}
              </span>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "http://192.168.20.1";
                }
              }}
              className="bg-green-600 hover:bg-green-700 w-full py-6 rounded-xl font-bold"
            >
              Connect Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- PROCESSING OVERLAY --- */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-center px-6"
          >
            <div className="relative mb-6">
              <Loader2 className="w-16 h-16 text-green-500 animate-spin" />
              <Wifi className="w-6 h-6 text-white absolute inset-0 m-auto" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">
              Activating Access...
            </h2>
            <p className="text-zinc-500 max-w-xs">
              Connecting to Abia Tech Hub router to set up your account.
              Don&apos;t close this window.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}