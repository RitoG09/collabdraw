import Canvas from "@/components/own/canvas/canvas";
import ProtectedRoute from "@/components/own/protectedRoute";
import React from "react";

function page() {
  return (
    <ProtectedRoute>
      <Canvas />
    </ProtectedRoute>
  );
}

export default page;
