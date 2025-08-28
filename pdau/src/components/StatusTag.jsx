import React from "react";

const StatusTag = ({ text }) => {
  return (
    <div className="inline-block px-4 py-2 bg-purple-300 text-black font-bold rounded-lg shadow-md border border-black">
      {text}
    </div>
  );
};

export default StatusTag;
