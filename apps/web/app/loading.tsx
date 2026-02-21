
'use client';

import Lottie from "lottie-react";
import catAnimation from "../assets/cat-loading.json";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="w-64">
        <Lottie animationData={catAnimation} loop={true} />
      </div>
    </div>
  );
}