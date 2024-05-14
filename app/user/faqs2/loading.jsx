import Image from "next/image";

const Loading = () => {
	return (
		<div className="w-full flex-center justify-center">
			<Image
				src="assets/icons/loading-rolling.svg"
				width={50}
				height={50}
				alt="loader"
				className="object-contain"
			/>
		</div>
	);
};

export default Loading;


