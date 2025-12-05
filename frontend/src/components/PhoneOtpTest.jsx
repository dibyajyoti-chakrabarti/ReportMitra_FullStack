// src/components/PhoneOtpTest.jsx
import React, { useState, useEffect } from "react";
import { auth, setupRecaptcha, signInWithPhoneNumber } from "../firebase";

const PhoneOtpTest = ({ onVerified }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [status, setStatus] = useState("");
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Create reCAPTCHA once when component mounts
  useEffect(() => {
    try {
      const verifier = setupRecaptcha("recaptcha-container");
      setRecaptchaReady(true);

      // optional cleanup
      return () => {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
      };
    } catch (e) {
      console.error("Failed to init reCAPTCHA", e);
    }
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!recaptchaReady || !window.recaptchaVerifier) {
      setStatus("reCAPTCHA not ready yet. Please wait a moment and try again.");
      return;
    }

    setStatus("Sending OTP...");

    try {
      const formatted =
        phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;

      const result = await signInWithPhoneNumber(
        auth,
        formatted,
        window.recaptchaVerifier
      );
      setConfirmationResult(result);
      setStatus("OTP sent! Use the code you set in Firebase (for test numbers).");
    } catch (err) {
      console.error(err);
      setStatus("Failed to send OTP. Check console for details.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!confirmationResult) {
      setStatus("Send OTP first.");
      return;
    }

    try {
      const cred = await confirmationResult.confirm(otp);
      console.log("Firebase user:", cred.user);
      setStatus("✅ Phone verified successfully!");

      if (onVerified) {
        onVerified({
          phoneNumber,
          firebaseUid: cred.user.uid,
        });
      }
    } catch (err) {
      console.error(err);
      setStatus("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="max-w-md border rounded-md p-3 text-sm">
      <form onSubmit={handleSendOtp} className="flex flex-col gap-2">
        <label className="font-medium">
          Phone number (India, without +91):
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="9876543210"
            className="mt-1 w-full border rounded px-2 py-1"
            required
          />
        </label>
        <button
          type="submit"
          className="self-start mt-1 rounded bg-blue-600 text-white px-3 py-1 text-xs md:text-sm"
        >
          Send OTP
        </button>
      </form>

      {/* reCAPTCHA container – must stay mounted */}
      <div id="recaptcha-container" className="mt-2" />

      {confirmationResult && (
        <form onSubmit={handleVerifyOtp} className="mt-3 flex flex-col gap-2">
          <label className="font-medium">
            Enter OTP:
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="mt-1 w-full border rounded px-2 py-1"
              required
            />
          </label>
          <button
            type="submit"
            className="self-start rounded bg-green-600 text-white px-3 py-1 text-xs md:text-sm"
          >
            Verify OTP
          </button>
        </form>
      )}

      {status && <p className="mt-2 text-xs text-gray-700">{status}</p>}
    </div>
  );
};

export default PhoneOtpTest;
