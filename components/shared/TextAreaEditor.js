import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextAreaEditor = ({ value, onChange }) => {
	return (
		<ReactQuill
			value={value}
			onChange={onChange}
			placeholder="Write topic description..."
			className="w-full h-60"
		/>
	);
};

export default TextAreaEditor;
