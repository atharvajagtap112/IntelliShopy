import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        <p className="text-gray-700 text-lg font-semibold">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default Loading;