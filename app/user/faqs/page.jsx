"use client";
import React, { useEffect, useState } from "react";
import ForumCard from "@components/Dashboard/Forum";
import { saveFroum, getForums } from "@app/api-services/forumService";
import { getUserData } from "@app/api-services/authService";
import { message } from "antd";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const FAQ = () => {
  const router = useRouter();
  const [editorHtml, setEditorHtml] = useState("");

  const handleChange = (html) => {
    setEditorHtml(html);
  };

  const handleForumSubmit = async (e) => {
    e.preventDefault();

    setIsSubmit(true);

    const newForumData = {
      ...forumData,
      content: editorHtml,
    };

    try {
      // Assuming doSubmit is an asynchronous function
      doSubmit(newForumData);

      // Clear the input fields
      setForumData({ ...forumData, title: "", content: "" });

      // Close the modal
      document.getElementById("my_modal_5").close();

      // Show success message
      message.success("Forum submitted successfully!");

      setViewModal(false);
    } catch (error) {
      message.error("Something went wrong!");

      console.error("Submission failed:", error);
    }
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
    "code", // Added 'code' format
  ];

  const [viewModal, setViewModal] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [forumUpData, setForumUpData] = useState([]);
  const [forumData, setForumData] = useState({
    title: "",
    content: "",
    author_id: "",
    author_firstName: "",
    author_lastName: "",
    created_at: new Date(),
    updated_at: new Date(),
    upVote: 0,
    downVote: 0,
    replies: [],
  });
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const startUp = async () => {
      const user = getUserData();
      if (user) {
        setUserData(user);
        setForumData({
          ...forumData,
          author_id: user.id,
          author_firstName: user.firstName,
          author_lastName: user.lastName,
        });
      }
      const { data } = await getForums();
      setForumUpData(data);
    };
    startUp();
  }, []);

  const filterFourms = (searchtext) => {
    const regex = new RegExp(searchtext, "i");
    let fitered = forumUpData.filter(
      (forum) =>
        regex.test(forum.title) ||
        regex.test(forum.sub_title) ||
        regex.test(forum.content)
    );
    return fitered;
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterFourms(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const onAskQuestion = () => {
    if (userData?.id) return document.getElementById("my_modal_5").showModal();
    return router.push("/guest/login");
  };

  const doSubmit = (forum) => {
    let newForum = [...forumUpData];
    let x = newForum.concat(forum);
    setForumUpData(x);
    saveFroum(forum);
    setIsSubmit(false);
  };

  return (
    <section className="flex w-full flex-col items-center justify-start">
      {/* SERACH SECTION */}
      <div className="mb-8 flex h-16 w-5/6 flex-row items-center justify-start">
        <div className="w-1/5">
          <Button
            style={{ width: "90%", height: "47px" }}
            onClick={() => onAskQuestion()}
          >
            Ask Question
          </Button>
        </div>

        <div className="h-full w-4/5">
          <form className="flex-center h-full w-full">
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearchChange}
              required
              className="focus:ring; peer block h-12 w-full rounded-md border border-gray-200 bg-white py-2.5 pl-5 pr-12 font-satoshi text-sm font-medium shadow-md focus:border-lime-500 focus:outline-none focus:ring-offset-2"
            />
          </form>
        </div>
      </div>
      {/* SERACH SECTION */}

      {searchText ? (
        <ForumCard data={searchedResults} user={userData} />
      ) : (
        <ForumCard data={forumUpData} user={userData} />
      )}

      <dialog id="my_modal_5" className="modal">
        <div className="modal-box w-3/4 max-w-4xl">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Hello!</h3>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">
                  <CloseOutlined />
                </button>
              </form>
            </div>
          </div>
          <p>Feel free to ask any questions here.</p>
          <form
            onSubmit={handleForumSubmit}
            className="flex w-full flex-col items-center gap-y-5 py-5"
          >
            <input
              type="text"
              placeholder="Topic Title"
              value={forumData["title"]}
              onChange={(e) =>
                setForumData({ ...forumData, title: e.target.value })
              }
              required
              className="focus:ring-2; peer block w-full rounded-md border border-gray-500 bg-white py-2 pl-5 pr-12 font-satoshi text-sm font-medium focus:border-lime-500 focus:outline-none"
            />

            <ReactQuill
              value={editorHtml}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              style={{ width: "100%", height: "100px" }}
            />
            <Button
              disabled={isSubmit}
              type="primary"
              htmlType="submit"
              className="self-end mt-10"
              style={{ backgroundColor: "green", color: "white" }}
            >
              Post Question
            </Button>
          </form>
        </div>
      </dialog>
    </section>
  );
};

export default FAQ;
