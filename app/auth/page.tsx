"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { ReCAPTCHA } from "react-google-recaptcha";

// Replace with your real site key
const RECAPTCHA_SITE_KEY = "YOUR_RECAPTCHA_SITE_KEY";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // toggle login/signup
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toggleMode = () => setIsLogin(!isLogin);

  const onSubmit = (data: any) => {
    if (!captchaValue) {
      alert("Please verify the reCAPTCHA!");
      return;
    }

    if (isLogin) {
      // Call your login API
      console.log("Login data:", data);
    } else {
      // Call your signup API
      console.log("Signup data:", data);
    }
  };

  return (
    <div className="min-h-screen font-montserrat flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <img src="/logowhite.png" alt="Abia Tech Hub Logo"  className="h-20 invert flex mx-auto"/>
        <h2 className="text-2xl font-bold mt-5 mb-6 text-center text-gray-900 dark:text-white">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                {...register("name", { required: !isLogin })}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">Name is required</span>
              )}
            </div>
          )}

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">Email is required</span>
            )}
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">Password is required</span>
            )}
          </div>

          {/* reCAPTCHA */}
          <div className="my-4">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(value) => setCaptchaValue(value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
