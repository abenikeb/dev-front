"use client";
import { useEffect, useState } from "react";
import Modal from "@components/UI/Modal/Modal";
import ForumCard from "@components/Dashboard/Forum";
import { saveFroum, getForums } from "./../../api-services/forumService"
import Button from "@components/UI/Button/Button";
import userSession from "@lib/hooks/userSession";
import { getUserData } from "@app/api-services/authService";

const forums = [
	{
		id: 1,
		title: "Forum Topic One",
		createAt: "2 mins ago",
		image: "/assets/images/forumUser.svg",
		sub_title: "Lorem ipsum dolor sit amet",
		content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
	},
	{
		id: 2,
		title: "Forum Topic Two",
		createAt: "4 mins ago",
		image: "/assets/images/forumUser.svg",
		sub_title: "Lorem ipsum dolor sit amet",
		content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
	},
	{
		id: 3,
		title: "Forum Topic Three",
		createAt: "1 day ago",
		image: "/assets/images/forumUser.svg",
		sub_title: "Lorem ipsum dolor sit amet",
		content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
	},
];
const Forum = () => {
	const session = userSession()
	const [viewModal, setViewModal] = useState(false);
	const [forumUpData, setForumUpData] = useState([])
	const [forumData, setForumData] = useState({
		title: '',
		content: '',
		author_id: '',
		author_firstName: '',
		author_lastName:'',
		created_at: new Date(),
		updated_at: new Date(),
		upVote: 0,
		downVote: 0,
	})
	// Search states
	const [searchText, setSearchText] = useState("");
	const [searchTimeout, setSearchTimeout] = useState(null);
	const [searchedResults, setSearchedResults] = useState([]);

	useEffect(() => {
		let user = getUserData()
		if (typeof user !== "undefined" || user !== null) setForumData({ ...forumData, author_id: user?.id, author_firstName: user?.firstName, author_lastName: user?.lastName,})
		
		const r = async () => {
			let { data } = await getForums()
			console.log("data",data)
			setForumUpData(data)
		}
		r()
	}, [])

	const filterFourms = (searchtext) => {
		const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
		return forums.filter(
			(forum) =>
				regex.test(forum.title) ||
				regex.test(forum.sub_title) ||
				regex.test(forum.content)
		);
	};

	const handleModalClose = () => {
		setViewModal(false);
	};

	const handleModalOpen = () => {
		setViewModal(true);
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

	const doSubmit = (forum) => {
		let newForum = [...forumUpData]
		let x = newForum.concat(forum)
		setForumUpData(x)
		saveFroum(forum)
	}

	const handleForumSubmit = (e) => {
		e.preventDefault();
		console.log(forumData)
		doSubmit(forumData)
		setViewModal(false)

	}

	const ForumModal = (
		// Modal comoponent
		<div>
			<form onSubmit={handleForumSubmit} className="w-full flex flex-col justify-center items-center gap-y-5 px-12 pt-5">
				<input
					type="text"
					placeholder="Topic Title"
					value={forumData['title']}
					onChange={(e) => setForumData({ ...forumData, title: e.target.value })}
					required
					className="block w-full h-20 rounded-md border border-gray-500 bg-white py-2.5 font-satoshi pl-5 pr-12 text-sm font-medium focus:border-lime-500 focus:outline-none focus:ring-2; peer"
				/>

				<input
					type="text-area"
					placeholder="Topic Description ..."
					value={forumData['content']}
					onChange={(e) => setForumData({ ...forumData, content: e.target.value })}
					required
					className="block w-full text-start h-64 rounded-md border border-gray-500 bg-white py-2.5 font-satoshi pl-5 pr-12 text-sm font-medium focus:border-lime-500 focus:outline-none focus:ring-2; peer"
				/>

				<button type="submit" className="btn bg-lime-500 text-white">
					POST
				</button>

				{/* <Button
					onBtnAction={handleModalOpen}
					btn_class="btn-filled"
					label="POST" /> */}
			</form>
		</div>
	);

	return (
		<section className="w-full flex flex-col justify-start items-center">
			{/* SERACH SECTION */}
			<div className="w-5/6 flex flex-row justify-start items-center h-16 mb-8">
				<div className="w-4/5 h-full">
					<form className="w-full flex-center h-full">
						<input
							type="text"
							placeholder="Search for a topic or a forum"
							value={searchText}
							onChange={handleSearchChange}
							required
							className="block w-full h-12 rounded-md border border-gray-200 bg-white py-2.5 font-satoshi pl-5 pr-12 text-sm shadow-md font-medium focus:border-lime-500 focus:outline-none focus:ring-offset-2 focus:ring; peer"
						/>
					</form>
				</div>
				{typeof session?.user?.id !== "undefined" && <div className="w-1/5 pl-5">
					<Button
						onBtnAction={handleModalOpen}
						btn_class="btn-filled"
						label="NEW TOPIC"></Button>
				</div>}

			</div>
			{/* SERACH SECTION */}

			{searchText ? (
				<ForumCard data={searchedResults} />
			) : (
				<ForumCard data={forumUpData} />
			)}

			<Modal show={viewModal} closeModal={handleModalClose}>
				{ForumModal}
			</Modal>
		</section>
	);
};

export default Forum;
