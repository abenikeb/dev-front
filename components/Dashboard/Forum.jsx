"use client";
import React, { useState } from "react";
import { Editor, EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { Modal, Button } from "antd";
import { saveFroum } from "@app/api-services/forumService";
// import { Editor as Editors } from "react-draft-wysiwyg";
import "draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ForumCard = ({ data }) => {
  const [replyForum, setReplyForum] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [replyContent, setReplyContent] = useState("");

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
      ["link", "image", "video", "code"], // Added 'code' option
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
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
    console.log({ forum });
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setReplyForum(null);
    setModalVisible(false);
    setEditorState(EditorState.createEmpty());
    setReplyContent("");
  };

  const handleSubmit = () => {
    const contentState = editorHtml.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const content = JSON.stringify(rawContentState);

    const forum = {
      id: replyForum._id,
      replies: [
        {
          message: content,
          author_id: replyForum.author_id,
        },
      ],
    };
    // You can perform your submission logic here, e.g., make a POST request
    console.log("Content to submit:", forum);
    saveFroum(forum);
    // Close the modal after submission
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
              <li key={index} style={{ width: "100%", marginBottom: "10px" }}>
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Editor
                    editorState={EditorState.createWithContent(
                      convertFromRaw(JSON.parse(reply.message))
                    )}
                    readOnly={true}
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
      // timeZoneName: "short",
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
          <li className="flex flex-row gap-x-5 py-5 text-black">
            <div className="flex flex-col">
              <div className="flex flex-row justify-between">
                <section>
                  <p className="mb-2 text-2xl font-semibold text-gray-900">
                    {forum.title}
                  </p>
                  <p className="mb-2 text-xs text-gray-500">
                    Asked {formatCounterDate(forum.created_at.toString())}
                  </p>
                </section>
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
              <div className="py-3 px-7">
                <Editor
                  editorState={EditorState.createWithContent(
                    convertFromRaw(JSON.parse(forum.content))
                  )}
                  readOnly={true}
                />

                {renderReplySection(forum)}
                <div className="mt-10 w-32">
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      document.getElementById("my_modal_4").showModal();
                      handleReply(forum);
                    }}
                  >
                    Reply
                  </button>
                  {/* <Button onClick={() => handleReply(forum)}>Reply</Button> */}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
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
          {/* <Editors
            editorState={editorState}
            onEditorStateChange={setEditorState}
            toolbar={{
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },
              blockType: { inDropdown: true },
              emoji: { inDropdown: true },
              // You can add other options here as needed
            }}
            wrapperClassName="w-full h-full border border-gray-500 rounded-md"
            editorClassName="bg-white p-2"
          /> */}

          <div className="modal-action">
            <form method="dialog">
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-sm mr-2 bg-lime-500 text-white"
              >
                Submit
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
