import clsx from "clsx";
import { useState } from "react";
import CustomInput from "src/components/CustomInput";
import "./style.scss";

interface CosmAddressProps {
  className?: string;
}

const CosmAddress: React.FC<CosmAddressProps> = ({ className }) => {
  const [contractAddr, setContractAddr] = useState("");

  return (
    <div className={clsx("wrap-form", className)}>
      <CustomInput
        inputHeader="Contract address"
        input={contractAddr}
        setInput={setContractAddr}
        placeholder="eg. shareledger1mms7cehvyx7pxp7lllt0mn47hz5ufxwfwc2t95"
      />
    </div>
  );
};

export default CosmAddress;
