import React from "react";

const SuccessAlert = ({ show, message }) =>
  show ? (
    <div className="fixed bottom-8 left-1/2 z-50 transform -translate-x-1/2">
      <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg text-xl font-bold animate-fade-in-out">
        {message}
      </div>
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(40px);}
            10% { opacity: 1; transform: translateY(0);}
            90% { opacity: 1; transform: translateY(0);}
            100% { opacity: 0; transform: translateY(40px);}
          }
          .animate-fade-in-out {
            animation: fadeInOut 2s;
          }
        `}
      </style>
    </div>
  ) : null;

export default SuccessAlert;