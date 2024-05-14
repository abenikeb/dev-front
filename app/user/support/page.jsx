"use client";
import { Form, Input, Button, message } from "antd";
import http from "../../api-services/httpService";
import { API_END_POINT } from "../../api-services/httpConstant";
import { getUserData } from "../../api-services/authService";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MailOutlined, UserOutlined, SendOutlined } from "@ant-design/icons";

const Support = () => {
  const router = useRouter();
  const atStartUp = async () => {
    try {
      const userInfo = getUserData();

      // if (!userInfo) {
      //   return router.push("/guest/login");
      // }
    } catch (error) {
      console.error("An error occurred during startup:", error);
    }
  };

  useEffect(() => {
    atStartUp();
  }, []);

  const onFinish = async (values) => {
    try {
      await http.post(`${API_END_POINT}/user/support-feedback`, {
        email: getUserData().email,
        message: values.details,
      });
      message.success("Feedback submitted successfully!");
      window.location = "/user/support";
    } catch (error) {
      message.success("Error submitting feedback!");
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="text-5xl justify-evenly items-center flex flex-row">
      <img
        src="/assets/images/contactUs-removed.png"
        className="w-[50%] h-auto block"
        alt=""
      />
      <div className="w-1/2 bg-white rounded-lg shadow-sm p-10 mt-10">
        <h1 className="font-bold">Contact Us</h1>
        <br />
        <Form
          name="feedback_form"
          onFinish={onFinish}
          layout="vertical"
          className="flex flex-col"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter your name!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
              {
                required: true,
                message: "Please enter your email address!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Message"
            name="details"
            rules={[
              {
                required: true,
                message: "Please enter your feedback details!",
              },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 4 }}
              placeholder="Message details"
            />
          </Form.Item>

          <div className="self-end">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: "green" }}
                icon={<SendOutlined />}
              >
                Submit Feedback
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Support;
