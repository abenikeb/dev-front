"use client";
import { Form, Input, Button } from "antd";

const Support = () => {
  const onFinish = (values) => {
    console.log("Received values:", values);
    // You can handle the submission of feedback here
  };

  return (
    <div className="text-5xl justify-evenly items-center font-extrabold flex flex-row ">
      <img
        src="/assets/images/contactUs-removed.png"
        className="w-[50%] h-auto block"
        alt=""
      />
      <div className="w-1/2 bg-white rounded-lg shadow-sm p-10">
        <h2>Need Support?</h2>
        <h1>Contact Us</h1>
        <Form name="feedback_form" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Details"
            name="details"
            rules={[
              {
                required: true,
                message: "Please enter your feedback details!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Feedback
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Support;
