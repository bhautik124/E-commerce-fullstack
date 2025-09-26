import React, { useEffect } from "react";
import { toast } from "react-toastify";

// Custom Toast Component similar to your reference
const CustomToast = ({ text, type, icon, closeToast }) => {
  
  // Auto close after 2 seconds as backup
  useEffect(() => {
    const timer = setTimeout(() => {
      if (closeToast) {
        closeToast();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [closeToast]);
  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-600 border-green-500";
      case "error":
        return "bg-red-600 border-red-500";
      case "info":
        return "bg-blue-600 border-blue-500";
      case "warning":
        return "bg-orange-600 border-orange-500";
      default:
        return "bg-gray-600 border-gray-500";
    }
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-white font-medium text-sm
        ${getStyles()}
        border-l-4 backdrop-blur-sm
        animate-slide-in-down
      `}
      style={{
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{text}</span>
    </div>
  );
};

// Professional toast configuration with shorter time
const defaultToastConfig = {
  autoClose: 2000, // 2 seconds auto close
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  closeButton: false,
  style: {
    background: "transparent",
    boxShadow: "none",
    padding: 0,
    margin: 0,
  },
};

// Success toast with custom component
export const showSuccessToast = (message, customConfig = {}) => {
  toast(
    ({ closeToast }) => <CustomToast text={message} type="success" icon="✓" closeToast={closeToast} />,
    { ...defaultToastConfig, ...customConfig }
  );
};

// Error toast with custom component
export const showErrorToast = (message, customConfig = {}) => {
  toast(
    ({ closeToast }) => <CustomToast text={message} type="error" icon="✕" closeToast={closeToast} />,
    { ...defaultToastConfig, ...customConfig }
  );
};

// Info toast with custom component
export const showInfoToast = (message, customConfig = {}) => {
  toast(
    ({ closeToast }) => <CustomToast text={message} type="info" icon="ℹ" closeToast={closeToast} />,
    { ...defaultToastConfig, ...customConfig }
  );
};

// Warning toast with custom component
export const showWarningToast = (message, customConfig = {}) => {
  toast(
    ({ closeToast }) => <CustomToast text={message} type="warning" icon="⚠" closeToast={closeToast} />,
    { ...defaultToastConfig, ...customConfig }
  );
};

// Generic toast with custom type
export const showToast = (message, type = "info", customConfig = {}) => {
  const icons = {
    success: "✓",
    error: "✕", 
    info: "ℹ",
    warning: "⚠"
  };
  
  toast(
    ({ closeToast }) => <CustomToast text={message} type={type} icon={icons[type]} closeToast={closeToast} />,
    { ...defaultToastConfig, ...customConfig }
  );
};