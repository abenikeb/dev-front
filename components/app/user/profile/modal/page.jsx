import Modal from "@components/UI/Modal/Modal";
const ChangePassword = () => {
	const viewModal = true;
	const handleModalClose = false;
	return (
		<>
			<Modal show={viewModal} closeModal={handleModalClose}>
				<div>
					<h1>Hello modal</h1>
				</div>
			</Modal>
		</>
	);
};
export default ChangePassword;
