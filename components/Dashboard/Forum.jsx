"use client";
import React, { useState } from "react";
import { saveFroum } from "@app/api-services/forumService";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import { Button, Badge, Space } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ForumCard = ({ data, user }) => {
  const [replyForum, setReplyForum] = useState(null);
  const [editorHtml, setEditorHtml] = useState("");

  const handleChange = (html) => {
    setEditorHtml(html);
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video", "code"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "code",
  ];

  const handleReply = (forum) => {
    setReplyForum(forum);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setReplyForum(null);
    setModalVisible(false);
    setReplyContent("");
  };

  const handleSubmit = () => {
    const content = editorHtml;

    const forum = {
      id: replyForum._id,
      replies: [
        {
          message: content,
          author_id: replyForum.author_id,
        },
      ],
    };
    saveFroum(forum);
    handleModalCancel();
  };

  const renderReplySection = (forum) => {
    if (forum?.replies && forum?.replies?.length > 0) {
      return (
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "10px",
            marginTop: "20px",
          }}
        >
          <h4 style={{ marginBottom: "5px" }}>1 Answers</h4>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {forum.replies.map((reply, index) => (
              <li
                key={index}
                style={{ width: "100%", marginBottom: "20px", display: "flex" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginRight: "10px",
                  }}
                >
                  <Button
                    type="text"
                    shape="circle"
                    icon={
                      <UpOutlined
                        style={{ fontSize: "20px", color: "#1890ff" }}
                      />
                    }
                  />
                  <Badge count={0} showZero style={{ margin: "5px" }}>
                    <Button
                      type="text"
                      shape="circle"
                      icon={
                        <DownOutlined
                          style={{ fontSize: "20px", color: "#ff4d4f" }}
                        />
                      }
                    />
                  </Badge>
                </div>
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    flex: 1,
                  }}
                >
                  <ReactQuill
                    value={reply.message}
                    readOnly={true}
                    theme={"bubble"}
                    style={{ color: "black", fontSize: "16px" }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return null;
    }
  };

  function formatDate(date) {
    const formattedDate = new Date(date);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return formattedDate.toLocaleDateString(undefined, options);
  }

  function formatCounterDate(date) {
    const currentDate = new Date();
    const providedDate = new Date(date);
    const timeDifference = currentDate - providedDate;

    // Convert time difference to seconds
    const secondsDifference = Math.floor(timeDifference / 1000);

    if (secondsDifference < 60) {
      return `${secondsDifference} second${
        secondsDifference === 1 ? "" : "s"
      } ago`;
    }

    // Convert time difference to minutes
    const minutesDifference = Math.floor(secondsDifference / 60);

    if (minutesDifference < 60) {
      return `${minutesDifference} minute${
        minutesDifference === 1 ? "" : "s"
      } ago`;
    }

    // Convert time difference to hours
    const hoursDifference = Math.floor(minutesDifference / 60);

    if (hoursDifference < 24) {
      return `${hoursDifference} hour${hoursDifference === 1 ? "" : "s"} ago`;
    }

    // Convert time difference to days
    const daysDifference = Math.floor(hoursDifference / 24);

    if (daysDifference < 30) {
      return `${daysDifference} day${daysDifference === 1 ? "" : "s"} ago`;
    }

    // Convert time difference to months
    const monthsDifference = Math.floor(daysDifference / 30);

    if (monthsDifference < 12) {
      return `${monthsDifference} month${
        monthsDifference === 1 ? "" : "s"
      } ago`;
    }

    // Convert time difference to years
    const yearsDifference = Math.floor(monthsDifference / 12);

    return `${yearsDifference} year${yearsDifference === 1 ? "" : "s"} ago`;
  }

  return (
    <div className="flex w-5/6 flex-col justify-start rounded-lg border border-gray-200 bg-slate-50 bg-white/20 bg-clip-padding px-8 shadow-md backdrop-blur-lg backdrop-filter">
      {data.length === 0 && (
        <p className="flex h-56 w-full items-center justify-center">
          No Data Found
        </p>
      )}
      <ul className="divide-y">
        {data.map((forum) => (
          <li className="flex flex-row gap-x-5 py-5">
            <div className="flex flex-col w-full">
              <div className="flex flex-row justify-between">
                <div>
                  <p className="mb-2 text-2xl font-semibold text-gray-900">
                    {forum.title}
                  </p>
                  <p className="mb-2 text-xs text-gray-500">
                    Asked {formatCounterDate(forum.created_at.toString())}
                  </p>
                </div>
                <div className="flex flex-row">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-100 text-lg font-bold text-white mr-2">
                    <img
                      src="/assets/images/avater1.png"
                      className="h-10 w-10 rounded-lg"
                      alt="User"
                    />
                  </div>
                  <div>
                    <div className="text-sm text-black mb-1">
                      By {forum.author_firstName + " " + forum.author_lastName}
                    </div>
                    <p className="mb-2 text-sm text-gray-500">
                      {formatDate(forum.created_at.toString())}
                    </p>
                  </div>
                </div>
              </div>
              <hr />
              <div>
                <ReactQuill
                  value={forum.content}
                  readOnly={true}
                  theme={"bubble"}
                  style={{ color: "black", fontSize: "500" }}
                />

                {renderReplySection(forum)}
                {user && user.email === "adisu.feyisa@ethiotelecom.et" ? (
                  <div className="mt-10 w-32">
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        document.getElementById("my_modal_4").showModal();
                        handleReply(forum);
                      }}
                    >
                      Your Answer
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {/* Modal */}
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-1/2 max-w-5xl">
          <p className="py-4 mb-5">
            {" "}
            Replying to: {replyForum?.author_firstName}
          </p>
          <ReactQuill
            value={editorHtml}
            onChange={handleChange}
            modules={modules}
            formats={formats}
          />

          <div className="modal-action">
            <form method="dialog">
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-sm mr-2 bg-lime-500 text-white"
              >
                Post Your Answer
              </button>
              <button className="btn btn-sm">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ForumCard;
