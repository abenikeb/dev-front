const InputField = ({ title, name, value, onChange, type = "text" }) => (
  <div className="input my-2 justify-center">
    <p>{title}</p>
    <input
      type={type}
      value={value}
      name={name}
      onChange={onChange}
      placeholder={title}
      required
    />
  </div>
);

export default InputField;
