import React from "react";

const NavHead = ({ role, handleLogoClick }) => {
  const getRoleStyles = (role) => {
    switch (role?.toLowerCase()) {
      case "mentee":
        return {
          text: "Mentee",
          color: "text-[#00aebd]",
        };
      case "mentor":
        return {
          text: "Mentor",
          color: "text-[#1d5bbf]",
        };
      case "admin":
        return {
          text: "Admin",
          color:
            "bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] text-transparent bg-clip-text",
        };
      default:
        return {
          text: "My Logo",
          color: "text-gray-800",
        };
    }
  };

  const { text, color } = getRoleStyles(role);

  return (
    <div
      className="site-logo cursor-pointer flex items-center space-x-3 rtl:space-x-reverse"
      onClick={handleLogoClick}
    >
      <span
        className={`self-center text-3xl font-extrabold whitespace-nowrap ${color} transition-colors duration-300`}
      >
        {text}
      </span>
    </div>
  );
};

export default NavHead;
