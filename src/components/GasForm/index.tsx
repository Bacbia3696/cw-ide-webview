import "antd/dist/antd.css";
import _ from "lodash";
import CustomInput from "src/components/CustomInput";

interface GasFormProps {
  gasData: any;
  setGasData: any;
}

const GasForm: React.FC<GasFormProps> = ({ gasData, setGasData, children }) => {
  const setGasPrice = (input) => setGasData({ ...gasData, gasPrice: input });
  const setGasDenom = (input) => setGasData({ ...gasData, gasDenom: input });
  const setGasLimit = (rawInput) => {
    console.log("raw input: ", rawInput);
    if (!rawInput) {
      setGasData({ ...gasData, gasLimits: "" });
    } else {
      const input = parseInt(rawInput);
      setGasData({ ...gasData, gasLimits: input });
    }
  };
  return (
    <div className="wrap-form">
      <CustomInput
        inputHeader="Gas price"
        input={gasData.gasPrice}
        setInput={setGasPrice}
        placeholder="eg. 2000"
      />
      <CustomInput
        inputHeader="Gas denom"
        input={gasData.gasDenom}
        setInput={setGasDenom}
        placeholder="eg. nshr"
      />
      <CustomInput
        type="number"
        inputHeader="Gas limit"
        input={gasData.gasLimits}
        setInput={setGasLimit}
        placeholder="eg. 200000000"
      />
      {children}
    </div>
  );
};

export default GasForm;
