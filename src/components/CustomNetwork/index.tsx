import "antd/dist/antd.css";
import _ from "lodash";
import { Button, Select } from "antd";
import { ReactComponent as IconSelect } from "../../assets/icons/code.svg";
import { ReactComponent as IconChain } from "../../assets/icons/chain.svg";
import { useState } from "react";
import { ChainInfoWithExplorer } from "src/stores/chain";
import MyDropZone from "src/components/DropZone";
import "./style.scss";

const { Option } = Select;

interface JsonFile {
  content: ChainInfoWithExplorer;
  fileName: string;
  chainId: string;
}

interface CustomNetworkProps {
  updateChain(_: string): void;
}

const CustomNetwork = ({ updateChain }: CustomNetworkProps) => {
  const [chainName, setChainName] = useState(
    window.chainStore.current.chainName
  );
  const [chainInfos, setChainInfos] = useState(window.chainStore.chainInfos);
  const [curChain, setCurChain] = useState({} as ChainInfoWithExplorer);
  const [jsonFileName, setJsonFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  const handleJsonFile = (file: JsonFile) => {
    setCurChain(file.content);
    setJsonFileName(file.fileName || "");
    setUpdateMessage("");
  };

  const onAddChain = () => {
    try {
      setErrorMessage("");
      if (curChain.chainId) {
        window.chainStore.addChain(curChain);
        // set chain to auto trigger new chain store
        window.chainStore.setChain(curChain.chainName);
        setChainName(curChain.chainName);
        setChainInfos(window.chainStore.chainInfos);
        setUpdateMessage("Successfully added the new chain");
      } else throw "Invalid chain data";
    } catch (error) {
      setErrorMessage(String(error));
      setUpdateMessage("");
    }
  };

  const onRemoveChain = () => {
    try {
      setErrorMessage("");
      window.chainStore.removeChain(window.chainStore.current.chainId);
      window.location.reload();
    } catch (error) {
      setErrorMessage(String(error));
      setUpdateMessage("");
    }
  };

  return (
    <div className="chain-select">
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconChain
          style={{
            width: "16px",
            height: "16px",
            marginRight: "5px",
            marginBottom: "8px",
          }}
        />
        <h3> Select chain name</h3>
      </div>
      <Select
        value={chainName}
        style={{ width: 240 }}
        suffixIcon={<IconSelect />}
        onSelect={(value) => {
          window.chainStore.setChain(value);
          setChainName(value);
          updateChain(value);
        }}
      >
        {chainInfos.map((info) => (
          <Option key={info.chainName} value={info.chainName}>
            {info.chainName}
          </Option>
        ))}
      </Select>
      <div className="chain-management">
        <div className="update-chain">
          <Button onClick={onAddChain}
            disabled={!jsonFileName}
            className="primary-button">
            Add new chain
          </Button>
          <Button onClick={onRemoveChain} className="remove-button">
            Remove chain
          </Button>
        </div>
        {_.isEmpty(curChain) && (
          <div
            style={{
              display: "flex",
              cursor: "pointer",
              fontFamily: "Courier",
            }}
          >
            <MyDropZone
              setJson={handleJsonFile}
              dropZoneText={
                "Upload the chain info json file here to add / remove chain"
              }
            />
          </div>
        )}
        {jsonFileName && (
          <div>
            <div
              style={{
                display: "flex",
                color: "#c4c6c9",
                fontFamily: "Courier",
                paddingBottom: "8px",
              }}
            >
              {`file name: ${jsonFileName}`}
            </div>
            <Button
              onClick={() => {
                // reset state
                setCurChain({} as ChainInfoWithExplorer);
                setJsonFileName("");
                setUpdateMessage("");
                setErrorMessage("");
              }}
              className="remove-secondary"
            >
              Remove json chain
            </Button>
          </div>
        )}
        {errorMessage && (
          <div className="contract-address">
            <span style={{ color: "red" }}>Error message </span>
            <p>{errorMessage}</p>
          </div>
        )}
        {updateMessage && (
          <div className="contract-address">
            <p>{updateMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomNetwork;
