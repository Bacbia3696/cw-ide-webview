import "antd/dist/antd.css";
import _ from "lodash";
import { Button, Select } from "antd";
import { ReactComponent as IconSelect } from "../../assets/icons/code.svg";
import { ReactComponent as IconChain } from "../../assets/icons/chain.svg";
import { useState } from "react";
import { ChainInfoWithExplorer } from "src/stores/chain";
import MyDropZone from "src/components/DropZone";

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
  const defaultChainName = useState(window.chainStore.current.chainName);
  const [chainInfos, setChainInfos] = useState(window.chainStore.chainInfos);
  const [jsonFileContent, setJsonFileContent] = useState(
    {} as ChainInfoWithExplorer
  );
  const [jsonFileName, setJsonFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  const handleJsonFile = (file: JsonFile) => {
    setJsonFileContent(file.content);
    setJsonFileName(file.fileName || "");
    setUpdateMessage("");
  };

  const onAddChain = () => {
    try {
      setErrorMessage("");
      if (jsonFileContent.chainId) {
        window.chainStore.addChain(jsonFileContent);
        // set chain to auto trigger new chain store
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
        defaultValue={defaultChainName}
        style={{ width: 240 }}
        suffixIcon={<IconSelect />}
        onSelect={(value) => {
          window.chainStore.setChain(value);
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
          <Button onClick={onAddChain} className="primary-button">
            Add new chain
          </Button>
          <Button onClick={onRemoveChain} className="remove-button">
            Remove chain
          </Button>
        </div>
        {_.isEmpty(jsonFileContent) && (
          <div
            style={{
              display: "flex",
              cursor: "pointer",
              fontFamily: "Courier",
            }}
          >
            <MyDropZone
              setSchema={null}
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
                setJsonFileContent({} as ChainInfoWithExplorer);
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
