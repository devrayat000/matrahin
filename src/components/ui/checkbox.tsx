const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center  cursor-pointer">
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 text-blue-600"
        checked={checked}
        onChange={onChange}
      />
      <span className="ml-2">{label}</span>
    </label>
  );
};

export default Checkbox;
