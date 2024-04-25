import { useState } from "react";
import { Modal, Button } from "antd";
import "./UserDetailsModal.css";

const UserDetailsModal = ({ visible, onClose, record }) => {
  return (
    <Modal
      title="User Details"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      className="user-details-modal"
    >
      <div className="user-details-container">

        <p className="detail-label">Fullname:</p>
        <p className="detail-value">{`${record && record.username}`}</p>

        <p className="detail-label">Email:</p>
        <p className="detail-value">{record && record.email}</p>

        <p className="detail-label">Phone:</p>
        <p className="detail-value">{record && record.phoneNumber}</p>

        <p className="detail-label">Role:</p>
        <p className="detail-value">{`${record && record.role}`}</p>

        <p className="detail-label">Last Login:</p>
        <p className="detail-value">{record && record.lastLogin}</p>

        <p className="detail-label">Status:</p>
        <p className="detail-value">{record && record.status}</p>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
