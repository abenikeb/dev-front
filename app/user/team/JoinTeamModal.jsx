import { useState } from "react";
import { Modal, Input, Button, message, Spin } from "antd";
import { getUserData } from "@app/api-services/authService";
import http from "@app/api-services/httpService";
import { CheckOutlined } from "@ant-design/icons";
import { API_END_POINT } from "@app/api-services/httpConstant";

const JoinTeamModal = ({ visible, handleCancel }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [joinButtonDisabled, setJoinButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [teamOwner, setTeamOwner] = useState(null);
  const handleSearchChange = async (value) => {
    setSearchTerm(value);
    setTeamOwner(null);

    try {
      const { data } = await http.get(
        `${API_END_POINT}/merchant-info/check-developer?name=${value}`
      );

      setSearchResult(
        data !== "" && data?.developerTeamName
          ? "The Team Name Available"
          : "The Team Name Not Exist"
      );

      if (data !== "" && data?.developerTeamName) {
        setTeamOwner({
          name: `${data.fullName}`,
          email: `${data.contactEmail}`,
          merchantCode: `${data?.short_code}`,
          companyName: `${data.companyName}`,
          phone: `${data.contactPhone}`,
        });
      }

      setJoinButtonDisabled(!data || !data?.developerTeamName);
    } catch (error) {
      console.error("Error searching for team:", error);
      setSearchResult("Error");
      setJoinButtonDisabled(true);
    }
  };

  const handleSearchTeam = async () => {
    setLoading(true);
    try {
      const { data } = await http.post(
        `${API_END_POINT}/user/request-join-User`,
        {
          searchTerm,
          userId: getUserData().id,
        }
      );

      setTimeout(() => {
        setLoading(false);
        message.success("Team join request sent successfully");
        handleCancel();
        setSearchTerm("");
        setTeamOwner(null);
        window.location.href = "/user/team";
      }, 2000);
    } catch (error) {
      if (error.status === 400) {
        message.error("Error sending team join request");
        console.log("Error sending team join request:", error?.data);
      } else {
        message.error("Error sending team join request");
        console.log("Error sending team join request:", error?.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Join Team"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <button
          key="cancelButton"
          className="btn btn-sm bg-gray-200 text-black text-sm hover:bg-gray-300 mr-2 mt-3"
          onClick={handleCancel}
        >
          Cancel
        </button>,
        <Button
          className={`btn btn-sm ${
            searchResult === "Available"
              ? "bg-green-500 text-white font-bold"
              : "bg-green-500 text-white"
          } text-sm hover:bg-lime-600`}
          onClick={handleSearchTeam}
          disabled={loading || searchTerm === ""}
          icon={loading && <Spin />}
        >
          Request to Join
        </Button>,
      ]}
    >
      <p className="mb-1">Search and join the team.</p>
      <Input
        placeholder="Search team"
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <div
        className={
          searchResult === "The Team Name Available"
            ? "text-green-500 "
            : "text-red-500"
        }
      >
        {!teamOwner?.name && searchResult}
        {teamOwner?.name && (
          <div className="text-lg my-3 flex flex-row">
            <div className="px-[0.45rem] py-[0.1rem] border-2 border-lime-500 rounded-full flex justify-center items-center mr-2">
              <CheckOutlined style={{ fontSize: "12px", color: "#52c41a" }} />{" "}
            </div>
            {`${teamOwner?.companyName}`}
          </div>
        )}

        {teamOwner?.name && (
          <div className="grid grid-cols-2 text-black gap-1">
            <p style={{ fontWeight: "normal", marginBottom: 0 }}>
              {`Company Name: `}
              <span style={{ fontWeight: "bold" }}>
                {teamOwner?.companyName}
              </span>
            </p>
            <p style={{ fontWeight: "normal", marginBottom: 0 }}>
              {`Merchant Code: `}
              <span style={{ fontWeight: "bold" }}>
                {teamOwner?.merchantCode}
              </span>
            </p>
            <p style={{ fontWeight: "normal", marginBottom: 0 }}>
              {`Owner Name: `}
              <span style={{ fontWeight: "bold" }}>{teamOwner?.name}</span>
            </p>
            <p style={{ fontWeight: "normal", marginBottom: 0 }}>
              {`Owner Phone: `}
              <span style={{ fontWeight: "bold" }}>{teamOwner?.phone}</span>
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default JoinTeamModal;
