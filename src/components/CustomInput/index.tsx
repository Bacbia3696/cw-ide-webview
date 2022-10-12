import "antd/dist/antd.css";
import _ from "lodash";
import { Input } from "antd";

interface CustomInputProps {
  inputHeader?: any;
  input?: any;
  setInput?: any;
  placeholder?: any;
  type?: any;
}

const CustomInput: React.FC<CustomInputProps> = ({
  inputHeader,
  input,
  setInput,
  placeholder = "",
  type = "text",
}) => {
  return (
    <div className="input-form">
      <h4>{inputHeader}</h4>
      <Input
        placeholder={placeholder}
        value={input}
        onInput={(e: any) => setInput(e.target.value)}
        type={type}
      />
    </div>
  );
};

export default CustomInput;
