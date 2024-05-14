"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Spin, Row, Col, Select } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { getUserData } from "@app/api-services/authService";
import { API_END_POINT } from "@app/api-services/httpConstant";
import http from "@app/api-services/httpService";

const { Option } = Select;

const businessCategories = [
  "IT",
  "Software",
  "Finance",
  "Healthcare",
  "Retail",
  "Manufacturing",
  "Education",
  "Consulting",
  "Hospitality",
];

const CompleteRegistrationForm = ({ userId, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    developerTeamName: "",
    companyName: "",
    businessCategory: "",
    officialWebsite: "ethiotelecom.et",
    contactPersonName: "",
    contactPhone: "",
    contactEmail: "",
  });

  const handleInputChange = (changedValues) => {
    setUserData({ ...userData, ...changedValues });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let randomString = Math.random().toString(36).substring(2, 4);

      const requestData = {
        userId,
        developerTeamName: userData.companyName.toLowerCase() + randomString,
        companyName: userData.companyName.toLowerCase() + randomString,
        businessCategory: userData.businessCategory,
        contactPersonName: `${getUserData().firstName} ${
          getUserData().lastName
        }`,
        contactPhone: userData.contactPhone,
        contactEmail: userData.contactEmail,
        officialWebsite: "www.ethiotelecom.et",
        username: userData.contactEmail,
        fullName: `${getUserData().firstName} ${getUserData().lastName}`,
        teamUsers: [{ id: userId, role: "admin" }],
      };

      const response = await http.post(
        `${API_END_POINT}/merchant-info/`,
        requestData
      );

      if (response.status === 201) {
        message.success(
          "Your team registration has been submitted successfully."
        );
        closeModal();
      }
    } catch (error) {
      message.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getUserInfoAndSetEmail = () => {
    const user = getUserData();
    setUserData({
      ...userData,
      contactEmail: user?.email,
    });
  };

  useEffect(() => {
    getUserInfoAndSetEmail();
  }, []);

  return (
    <Form onFinish={handleSubmit} layout="vertical">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            label="Organization Name"
            name="companyName"
            rules={[
              {
                required: true,
                message: "Please enter your Organization Name.",
              },
              {
                pattern: /^[a-zA-Z0-9]*$/,
                message: "Please enter only letters and numbers.",
              },
              { max: 20, message: "Please enter a maximum of 20 characters." },
            ]}
          >
            <Input
              onChange={(e) =>
                handleInputChange({ companyName: e.target.value })
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Business Category" name="businessCategory">
            <Select
              placeholder="Select Business Category"
              onChange={(value) =>
                handleInputChange({ businessCategory: value })
              }
              getPopupContainer={(trigger) => trigger.parentElement}
            >
              {businessCategories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            label="Contact Phone"
            name="contactPhone"
            rules={[
              {
                required: true,
                message: "Please enter Contact Person's Number.",
              },
              {
                pattern: /^9\d{8}$/, // Ensure it starts with 9 and is followed by exactly 8 digits
                message:
                  "Please enter a valid Contact Phone starting with 9 and consisting of exactly 9 digits.",
              },
            ]}
          >
            <Input
              onChange={(e) =>
                handleInputChange({ contactPhone: e.target.value })
              }
              addonBefore="+251"
              placeholder="9XXXXXXXX"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Contact E-Mail"
            name="contactEmail"
            rules={[
              {
                // required: true,
                message: "Please enter Contact Person's Email.",
              },
              { type: "email", message: "Please enter a valid email address." },
            ]}
          >
            <Input
              value={userData.contactEmail}
              readOnly
              placeholder={userData.contactEmail}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row justify="end">
        <Col>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              width: 120,
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
            }}
          >
            {loading ? (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />}
              />
            ) : (
              "Submit"
            )}
          </Button>
          <Button
            type="primary"
            onClick={closeModal}
            style={{ width: 120, marginLeft: 16, backgroundColor: "#668cff" }}
          >
            Skip
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CompleteRegistrationForm;
