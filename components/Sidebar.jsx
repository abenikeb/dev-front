/** @format */
'use client';
import React, { useState } from 'react';
import DashboardSideNav from './UI/DashboardSideNav/DashboardSideNav';
import Image from 'next/image';

const Sidebar = ({ topics, onClickTopic, onClickLanguage }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [activeSubTopic, setActiveSubTopic] = useState(1);
	const [activeTopic, setActiveTopic] = useState(1);
	const [selectLanguage, setSelectLanguage] = useState("Python");
	const [activeMobileBar, setActiveMobileBar] = useState([]);
	const [viewModal, setViewModal] = useState(true);

	const filteredTopics = topics.filter((topic) =>
		topic.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleModalClose = () => {
		setViewModal(false);
	};

	const handleModalOpen = () => {
		setViewModal(true);
	};

	const
		handleOptionChange = (e) => {
			let newTopic = topics.filter((topic) => topic.id === Number(e.target.value))
			setActiveMobileBar(newTopic[0].subtopics)
			setActiveTopic(Number(e.target.value))
		}

	const handleSubTopicOptionChange = (e) => {
		setActiveSubTopic(e.target.value)
	}

	const handleLanguageSelect = (e) => {
		setSelectLanguage(e.target.value)
	}

	const handleNextAction = () => {
		onClickTopic(activeTopic, activeSubTopic);
		setViewModal(false)
		onClickLanguage(selectLanguage)
	}

	// for Mobile navigation only
	const DashboardSideNavCont = (
		<ul className="flex flex-col justify-start items-start w-3/4 text-black font-bold gap-y-3 sm:hidden">

			<li className="form-control w-full max-w-xs">
				<label className="label">
					<span className="label-text">Select App</span>
				</label>
				<select className="select select-bordered w-64 overflow-auto" onChange={handleOptionChange}>
					{filteredTopics.map((topic) =>
						<option key={topic.id} value={topic.id}>
							{topic.name}
						</option>)}
				</select>
			</li>


			<li className="form-control w-full max-w-xs">
				<label className="label">
					<span className="label-text">Select API</span>
				</label>
				<select className="select select-bordered w-64 overflow-auto" onChange={handleSubTopicOptionChange}>
					<option disabled selected>Pick API</option>
					{activeMobileBar.map((mb) =>
						<option key={mb.id} value={mb.id} className='w-full'>
							{mb.name}
						</option>)
					}
				</select>
			</li>


			<li className="form-control w-full max-w-xs">
				<label className="label">
					<span className="label-text">Select Language</span>
				</label>
				<select className="select select-secondary w-64 max-w-xs" onChange={handleLanguageSelect}>
					<option disabled selected>Pick your favorite language</option>
					<option value="JS">JavaScript</option>
					<option value="Python">Python</option>
					<option value="Java">Java</option>
					<option value="C#">C#</option>
					<option value="JSON">Node Js</option>
				</select>
			</li>

			<button onClick={handleNextAction} className='btn btn-block mt-5 bg-lime-500 text-white'>Next</button>
		</ul>
	);


	return (
		<>
			<div className='w-72 z-auto fixed left-0 top-12 md:top-12 pt-8 overflow-auto h-full'>
				{/* Desctop Nav */}
				<section className='sm:flex flex-col hidden bg-base-100 shadow-sm border-2 border-gray-100 h-full pt-6 w-full'>
					<input
						type="text"
						placeholder="Search topics..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="mini-search"
					/>
					<ul className="menu w-full h-full rounded-sm">
						{filteredTopics.map((topic) => (
							<li key={topic.id}>
								<details open={activeTopic === topic.id}>
									<summary className='font-semibold'>
										<template className='flex gap-2 tooltip tooltip-top text-sm' data-tip={`${topic.desc}`}>
											<Image
												src={topic.icon}
												alt="icon"
												width={17}
												height={17}
												className="card_img"
											/>
											<h3>{topic.name}</h3>
										</template>
									</summary>
									<ul>
										{topic.subtopics.map((subtopic) => (
											<li key={subtopic.uniqueKey}>
												<a className={activeSubTopic === subtopic.uniqueKey ? 'active' : ''} onClick={() => { onClickTopic(topic.id, subtopic.id), setActiveSubTopic(subtopic.uniqueKey) }}>{`${subtopic.id} ${subtopic.name}`}
												</a>
											</li>
										))}
									</ul>
								</details>
							</li>
						))}
					</ul>
				</section>

				{/* Mobile Nav */}
				<section className='sm:hidden flex relative'>
					<div className='flex bg-slate-300 h-20 items-center rounded-tr-xl rounded-br-xl absolute top-56'>
						<div>
							<Image
								src="/assets/icons/right.png"
								width={20}
								height={20}
								className='rounded-full'
								alt='profile'
								onClick={handleModalOpen}
							/>
						</div>
					</div>
				</section>
			</div>
			<DashboardSideNav
				show={viewModal}
				closeModal={handleModalClose}
			>
				{DashboardSideNavCont}
			</DashboardSideNav>
		</>
	)
};

export default Sidebar;


