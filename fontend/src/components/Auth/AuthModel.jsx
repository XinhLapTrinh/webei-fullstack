// components/Auth/AuthModal.jsx
import React, { useState } from "react";
import { Modal, Tabs } from "antd";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const AuthModal = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState("signin");

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        items={[
          {
            label: "Đăng nhập",
            key: "signin",
            children: <SignInForm onSuccess={onClose} />,
          },
          {
            label: "Đăng ký",
            key: "signup",
            children: <SignUpForm onSuccess={onClose} />,
          },
        ]}
      />
    </Modal>
  );
};

export default AuthModal;


