"use client";

import {
  Table,
  Button,
  Space,
  Modal,
  Input,
  Select,
  Popconfirm,
  message,
  Form,
  Tag,
  Tabs,
  Radio,
} from "antd";

import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  checkUserStatus,
  sendEmailVerification,
} from "../../api-services/userService";
import { useState, useEffect, use } from "react";
import moment from "moment";
import http from "@app/api-services/httpService";
import { validateForm } from "./validation";
import { getUserData } from "@app/api-services/authService";
import RegisterModal from "@components/RegisterModal";
import JoinTeamModal from "./JoinTeamModal";
import UserDetailsModal from "./UserDetailsModal";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

import axios from "axios";
const { confirm } = Modal;
const { TabPane } = Tabs;

const merchantUrl = "https://developer.ethiotelecom.et/v2/merchant-info";

const base_url = "https://developer.ethiotelecom.et/v2";

const { Option } = Select;

const Teams = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPermissionRole, setUserPermissionRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [isAuthorizedToAccessTeamInfo, setAuthorizetoAccessTeamInfo] =
    useState(false);
  const [isAuthorizedToAccessTeaInfo, setIsAuthorizedToAccessTeamInfo] =
    useState(false);
  const [incompletePopup, setIncompletePopup] = useState(false);
  const [modalPopup, setModalPopup] = useState(false);
  const [completeStatus, setCompleteStatus] = useState();

  const [userData, setUserData] = useState([]);
  const [pendUserData, setPendUserData] = useState(null);
  const [user, setUser] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);

  const [firstName, setFirstName] = useState("1");
  const [lastName, setLastName] = useState("");

  const [roleId, setRoleId] = useState("1");
  const [email, setEmail] = useState("");
  const [accountTenantId, setAccountTenantId] = useState("1");
  const [instanceId, setInstanceId] = useState("1");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [languageLocaleKey, setLanguageLocaleKey] = useState("1");

  const [loading, setLoading] = useState(true);

  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0); // 1 minutes in seconds

  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [emailVerificationError, setEmailVerificationError] = useState(null);
  const [joinTeamModalVisible, setJoinTeamModalVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [merchantDataSource, setMerchantDataSource] = useState([]);
  const [merchIndex, setMerchIndex] = useState(0);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      let userSession = getUserData();
      const userDataResponse = await http.get(`${base_url}/user`);

      const response = await http.get(
        `${merchantUrl}/by-team-user/${userSession.id}`
      );
      const data = await response.data;

      console.log({ reponseData: data[merchIndex] });

      if (data && Array.isArray(data)) {
        setMerchantDataSource(data);
        const merchantDataResponse = data[merchIndex];

        const userDataArray = userDataResponse.data;
        const merchantDataArray = merchantDataResponse?.teamUsers || [];
        console.log({
          merchantDataArray,
        });

        setUserPermissionRole(() => {
          const foundUser = merchantDataResponse?.teamUsers.find(
            (user) => user.id === userSession.id
          );
          return foundUser?.role ?? "Developer";
        });

        const mappedData = [];

        for (const user of merchantDataArray) {
          const matchingUser = userDataArray.find((u) => u._id === user.id);

          if (matchingUser) {
            const commonFields = {
              key: `${mappedData.length + 1}`,
              no: `${mappedData.length + 1}`,
              username: `${matchingUser?.firstName}.${matchingUser?.lastName}`,
              email: matchingUser.email,
              phoneNumber: matchingUser.tel,
              role: matchingUser.role,
              lastLogin: moment(matchingUser.createdAt).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
              status: matchingUser?.status,
              unique_id: matchingUser._id,
            };

            mappedData.push(commonFields);
          }
        }

        setUserData(mappedData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    const user = getUserData();
    try {
      const params = {
        agent_id: "10007e22x21ndetq",
        accountTenantId: "938c40e321864bdbb885ce5590e742ad",
        instanceId: "15",
        userId: user.id,
      };
      const queryString = Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");

      const url = `${base_url}/user/roles?${queryString}`;

      const { data: rolesData } = await http.get(url);

      setRoles(rolesData);
      console.log({ rolesData });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkMerchantStatus = async (user_id) => {
    try {
      const response = await checkUserStatus(user_id);
      const status = response.data.status;
      setCompleteStatus(status);

      if (status === "pending") {
        setAuthorizetoAccessTeamInfo(true);
      } else if (status === "undefined") {
        setAuthorizetoAccessTeamInfo(false);
      } else if (status === "completed") {
        setAuthorizetoAccessTeamInfo(true);
      } else {
        setAuthorizetoAccessTeamInfo(false);
      }
    } catch (ex) {
      console.error(`Error:`, ex);
    }
  };

  const getUserInfoAndSetUserId = (user) => {
    setUserId(user?.id);
  };

  const fetchUserStatus = async () => {
    try {
      let userSession = getUserData();
      console.log({ userSession });
      const response = await http.get(
        `https://developer.ethiotelecom.et/v2/user/${userSession.id}`
      );
      const userStatus = response.data?.status;

      setPendUserData(response.data);

      console.log({ userStatus });
      setIsAuthorizedToAccessTeamInfo(userStatus === "active");
      setAuthorizetoAccessTeamInfo(userStatus === "active");
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  async function atStartUp() {
    let user = getUserData();
    setUser(user);

    const user_id = user?.id;
    if (!user_id) return router.push("/guest/login");

    checkMerchantStatus(user.id);
    fetchRoles();
    getUserInfoAndSetUserId(user);
    fetchUserStatus();
  }

  useEffect(() => {
    atStartUp();
  }, []);

  useEffect(() => {
    fetchData();
  }, [merchIndex]);

  useEffect(() => {
    let timer;

    if (countdown > 0 && !isSending) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown, isSending]);

  const handleDelete = async (record) => {
    let orginalState = userData;
    try {
      const response = await http.delete(
        `${base_url}/user/${record.unique_id}`
      );
      if (response.status === 200) {
        message.success(
          `Member ${response?.data?.username} Deleted successfully!`
        );

        const userData = orginalState.filter(
          (m) => m.unique_id !== record.unique_id
        );
        console.log({
          userData,
          orginalState,
        });
        setUserData(userData);
        setIsModalOpen(false);
      } else {
        message.error("Failed to Delete. Please try again.");
        setUserData(orginalState);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error(error.response.data);
        setUserData(orginalState);
      } else {
        console.error("Error Deleting Team:", error);
        message.error(
          "An error occurred while Deleting the user. Please try again."
        );
        setIsModalOpen(false);
        setUserData(orginalState);
      }
    }
  };

  const handleStatusChange = async (record, selectedStatus) => {
    try {
      const updatedUserData = userData.map((user) => {
        if (user.unique_id === record.unique_id) {
          return { ...user, status: selectedStatus };
        }
        return user;
      });
      setUserData(updatedUserData);
      await http.put(
        `https://developer.ethiotelecom.et/v2/user/update-user-status`,
        {
          userId: record.unique_id,
          status: selectedStatus,
        }
      );
    } catch (error) {}
  };

  const showConfirm = (value, record) => {
    confirm({
      title: "Are you sure you want to change the user status?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleStatusChange(record, value);
      },
      okText: "OK",
      okButtonProps: { className: "btn btn-sm btn-secondary" },
    });
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "Developer" ? "orange" : "gray"}>{role}</Tag>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <>
          {userPermissionRole === "Admin" || userPermissionRole === "admin" ? (
            <>
              {record.status !== "approved" || record.status !== "initial" ? (
                <Select
                  style={{ width: 120 }}
                  value={record.status}
                  onChange={(value) => showConfirm(value, record)}
                >
                  <Option value="active">
                    <Tag color="green">Active</Tag>
                  </Option>
                  {record.status === "active" && (
                    <Option value="suspended">
                      <Tag color="red">Suspended</Tag>
                    </Option>
                  )}
                </Select>
              ) : (
                <Tag color="green">Active</Tag>
              )}
            </>
          ) : (
            <Tag color="green">
              {record.status === "approved" || record.status === "initial"
                ? "active"
                : record.status}
            </Tag>
          )}
        </>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          {/* <Button type="link" onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Button> */}
          <Button type="link" onClick={() => handleView(record)}>
            <EyeOutlined />
          </Button>
          {userPermissionRole === "Admin" && (
            <Popconfirm
              title="Are you sure to delete this member?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    let additionalParams = {
      otp: "default",
      verifyed: true,
      captchaCode: "default",
    };

    let newValue = { ...values, ...additionalParams };
    try {
      const response = await http.post(
        `${base_url}/user/register-agent-user`,
        newValue
      );

      if (response.status === 200) {
        message.success("Team Added successfully!");
        setIsModalOpen(false);
        form.resetFields();
      } else {
        message.error("Failed to Add. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error(error.response.data);
        form.resetFields();
        return;
      } else {
        console.error("Error sending invitation:", error);
        message.error(
          "An error occurred while sending the invitation. Please try again."
        );
        setIsModalOpen(false);
      }
    }
  };

  const startCountdown = () => {
    setCountdown(60); // Reset the countdown
  };

  const handleValidationErrors = (error) => {
    const newErrors = {};
    error.details.forEach((detail) => {
      newErrors[detail.context.key] = detail.message;
    });
    setErrors(newErrors);
    // setIsSubmitting(false);
  };

  const handleSendVerificationCode = async (event) => {
    event.preventDefault();
    let userData = {
      email,
    };
    const { error } = validateForm(userData);

    if (!isSending && countdown === 0) {
      console.log(userData);
      if (error) {
        console.log(error);
        handleValidationErrors(error);
        return;
      } else {
        setEmailVerificationError(null);
        // Call your backend service to send email verification
        setIsSending(true);
        console.log("first");
        const response = await sendEmailVerification(userData.email);

        setIsSending(false);
        startCountdown();
      }
    }
  };

  const handleCreateTeam = async () => {
    try {
      if (completeStatus === "pending") {
        setStatusLoading(true);
        setModalPopup(true);
        setStatusLoading(false);
      } else if (completeStatus === "undefined") {
        setIncompletePopup(true);
        setStatusLoading(false);
      } else if (completeStatus === "completed") {
        setStatusLoading(true);
        setModalPopup(true);
        setStatusLoading(false);
      } else {
        setIncompletePopup(true);
        setStatusLoading(false);
      }

      setCompleteStatus(status);
      console.log("complete status " + status);
    } catch (ex) {
      if (ex.response?.status === 400) {
        console.log("EX", ex);
      } else {
        console.log("something went wrong", ex);
      }
    }
  };

  const showSuccessToast = () => {
    message.success(
      "Company Registered Successfuly. Please wait for Approval."
    );
  };

  const handleCloseIncompleteModal = () => {
    setIncompletePopup(false);
  };

  const handleCloseModal = () => {
    setModalPopup(false);
  };

  const handleJoinTeam = (searchTerm) => {
    console.log(`Joining team with searchTerm: ${searchTerm}`);
    setJoinTeamModalVisible(false); // Close the modal
  };

  const handleOpenJoinTeam = () => {
    setJoinTeamModalVisible(true);
  };

  const handleCancelJoinTeamModal = () => {
    setJoinTeamModalVisible(false);
  };

  const handleEdit = (record) => {
    console.log({ record });
  };

  const handleView = (record) => {
    console.log({ record });
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleCloseModal_ = () => {
    setModalVisible(false);
    setSelectedRecord(null);
  };

  const [dataSource, setDataSource] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchTeamsData = async () => {
      try {
        const response = await http.get(
          `${merchantUrl}/by-team-user/${getUserData().id}`
        );
        const data = await response.data;
        console.log({ data });
        if (data) {
          setMerchantDataSource(data);
          let formattedData;

          if (Array.isArray(data)) {
            formattedData = data.map((item, index) => ({
              key: index,
              No: index,
              userId: item.userId["$oid"],
              developerTeamName: item.developerTeamName,
              companyName: item.companyName,
              short_code: item.short_code,
              fullName: item.fullName,
            }));
            console.log({
              xx: formattedData[0],
            });
          } else {
            // Case: The response is an object
            formattedData = [
              {
                key: data._id,
                userId: data.userId["$oid"],
                developerTeamName: data.developerTeamName,
                companyName: data.companyName,
                short_code: data.short_code,
                fullName: data.fullName,
              },
            ];
          }

          setDataSource(formattedData);
          setSelectedTeam(formattedData[0]); // Default to the first team
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamsData();
  }, []);

  const teamListColumn = [
    {
      title: "Developer Team Name",
      dataIndex: "developerTeamName",
      key: "developerTeamName",
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Business Short Code",
      dataIndex: "short_code",
      key: "short_code",
    },
    {
      title: "Owner Name",
      dataIndex: "fullName",
      key: "fullName",
    },
  ];

  const columnsWithRowNumber = [
    {
      title: "#",
      dataIndex: "rowNumber",
      key: "rowNumber",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    ...teamListColumn,
  ];

  // alert(userPermissionRole);

  return (
    <div>
      {(isAuthorizedToAccessTeamInfo || isAuthorizedToAccessTeaInfo) && (
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <h1 className="text-xl font-bold mb-2">Organization Information</h1>
          <p className="text-gray-600 mb-4">View organizations</p>
          <div>
            <Table
              size="small"
              rowSelection={{
                type: "radio",
                onSelect: (record) => {
                  setSelectedTeam(record);
                  setMerchIndex(record.key);
                },
                selectedRowKeys: selectedTeam ? [selectedTeam.key] : [],
              }}
              columns={columnsWithRowNumber}
              dataSource={dataSource}
              pagination={false}
              bordered
              showHeader
            />
          </div>
        </div>
      )}

      {(isAuthorizedToAccessTeamInfo || isAuthorizedToAccessTeaInfo) && (
        <>
          <h1 className="text-3xl font-semibold my-4">
            Organization Members {userPermissionRole}
          </h1>

          {(userPermissionRole === "Admin" ||
            userPermissionRole === "admin") && (
            <button
              className="btn btn-sm bg-lime-500 text-white text-sm hover:bg-lime-600"
              onClick={showModal}
              style={{ marginBottom: "16px" }}
            >
              <PlusCircleOutlined className="mr-2" />
              Add New Member
            </button>
          )}
        </>
      )}

      <Modal
        title="Add New Members"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={userId}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter the email" }]}
            validateStatus={errors.email ? "error" : ""}
            help={
              errors.email && (
                <span style={{ color: "red" }}>{errors.email}</span>
              )
            }
          >
            <Input
              placeholder="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </Form.Item>

          <Form.Item
            label="Enter Verification Code"
            style={{ marginBottom: 0 }}
          >
            <Form.Item
              name="enterVerificationCode"
              style={{ display: "inline-block", width: "calc(70% - 8px)" }}
              rules={[
                {
                  required: true,
                  message: "Please enter the verification code",
                },
              ]}
            >
              <Input placeholder="Verification Code" type="text" required />
            </Form.Item>

            <Form.Item
              style={{ display: "inline-block", width: "calc(30% - 8px)" }}
            >
              <button
                className={
                  countdown > 0
                    ? "w-full ml-3 rounded-md border border-gray-50 bg-lime-500 py-2 px-5 text-white transition-all hover:bg-lime-300 hover:text-black text-center text-sm font-inter flex items-center justify-center;"
                    : "w-full ml-3 rounded-md border border-gray-50 bg-lime-500 py-2 px-5 text-white transition-all hover:bg-lime-300 hover:text-black text-center text-sm font-inter flex items-center justify-center cursor-pointer"
                }
                type="button"
                onClick={handleSendVerificationCode}
              >
                {isSending
                  ? "Sending..."
                  : countdown > 0
                  ? `Resend in ${Math.floor(countdown / 60)}:${countdown % 60}`
                  : "Send"}
              </button>
            </Form.Item>
          </Form.Item>

          <Form.Item label="Full Name" style={{ marginBottom: 0 }}>
            <Form.Item
              name="firstName"
              style={{ display: "inline-block", width: "calc(50% - 8px)" }}
              rules={[
                { required: true, message: "Please enter your first name" },
              ]}
            >
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
            </Form.Item>
            <span
              style={{
                display: "inline-block",
                width: "16px",
                textAlign: "center",
              }}
            ></span>
            <Form.Item
              name="lastName"
              style={{ display: "inline-block", width: "calc(50% - 8px)" }}
              rules={[
                { required: true, message: "Please enter your last name" },
              ]}
            >
              <Input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </Form.Item>
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter the password" }]}
          >
            <Input placeholder="Password" type="password" />
          </Form.Item>
          <Form.Item name="tel" label="Phone">
            <Input placeholder="Phone" type="text" />
          </Form.Item>
          <Form.Item
            name="userId"
            initialValue={userId}
            style={{ display: "none" }}
          >
            <Input
              type="hidden"
              onChange={(e) => setUserId(e.target.value)}
              value={userId}
            />
          </Form.Item>
          <Form.Item
            name="instanceId"
            initialValue={instanceId}
            style={{ display: "none" }}
          >
            <Input type="hidden" value="instanceId" />
          </Form.Item>
          <Form.Item
            name="accountTenantId"
            initialValue="accountTenantId"
            style={{ display: "none" }}
          >
            <Input type="hidden" value="accountTenantId" />
          </Form.Item>
          <Form.Item
            name="languageLocaleKey"
            initialValue="languageLocaleKey"
            style={{ display: "none" }}
          >
            <Input type="hidden" value="languageLocaleKey" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select Role">
              <Option value="Developer">Developer</Option>
            </Select>
          </Form.Item>
          <div className="w-full flex justify-end">
            <span></span>
            <button
              type="submit"
              className="btn btn-sm bg-lime-500 text-white hover:bg-lime-600"
            >
              Add Member
            </button>
          </div>
        </Form>
      </Modal>
      {/* Table section */}
      <div className="p-4">
        {isAuthorizedToAccessTeamInfo || isAuthorizedToAccessTeaInfo ? (
          <div>
            <Table
              dataSource={userData}
              columns={columns}
              loading={loading}
              rowKey="id"
              pagination={{ pageSize: 6 }}
            />
          </div>
        ) : (
          <div className="text-center">
            {pendUserData?.status === "pending" ? (
              <div className="mb-4 p-6 bg-gray-100 border border-gray-300 rounded-md shadow-md">
                <p className="text-xl font-bold text-orange-500">
                  Your request is pending approval.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Your organization join request is currently under review.
                  Please be patient while our team processes your request. You
                  will be notified once the approval process is complete.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-2xl font-bold">
                  You have no organization yet.
                </p>
                <p className="mb-4 text-lg">
                  To get started, create a new organization or join an existing
                  one.
                </p>
                <div className="flex flex-wrap md:flex-raw justify-center items-center">
                  <button
                    onClick={handleCreateTeam}
                    className="btn btn-sm bg-lime-500 text-white text-sm hover:bg-lime-600 mb-2 md:mb-0 mr-0 md:mr-2"
                    style={{ minWidth: "250px" }} // Set minimum width for desktop view
                  >
                    Create New Organization
                  </button>

                  <button
                    onClick={handleOpenJoinTeam}
                    className="btn btn-sm bg-white text-lime-500 border border-lime-500 text-sm hover:border-lime-600 hover:text-lime-600"
                    style={{ minWidth: "250px" }} // Set minimum width for desktop view
                  >
                    Join Organization
                  </button>
                </div>
                {/* <div className="flex flex-wrap justify-center items-center space-x-4">
                  <button
                    onClick={handleCreateTeam}
                    className="btn btn-sm bg-lime-500 text-white text-sm hover:bg-lime-600"
                  >
                    Create New Organization
                  </button>

                  <button
                    onClick={handleOpenJoinTeam}
                    className="btn btn-sm bg-white text-lime-500 border border-lime-500 text-sm hover:border-lime-600 hover:text-lime-600"
                  >
                    Join Organization
                  </button>
                </div> */}

                <JoinTeamModal
                  visible={joinTeamModalVisible}
                  handleJoinTeam={handleJoinTeam}
                  handleCancel={handleCancelJoinTeamModal}
                />
              </>
            )}
          </div>
        )}
      </div>
      <UserDetailsModal
        visible={modalVisible}
        onClose={handleCloseModal_}
        record={selectedRecord}
      />

      {incompletePopup === true ? (
        <RegisterModal
          user_id={user?.id}
          showPopup={incompletePopup}
          successMessage={showSuccessToast}
          onCloseModal={handleCloseIncompleteModal}
        />
      ) : (
        ""
      )}
      {modalPopup === true ? (
        <Modal
          tshowPopup={modalPopup}
          onCloseModel={handleCloseModal}
          title="Pending"
          description="Your request has been submitted. Please wait for approval."
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Teams;
