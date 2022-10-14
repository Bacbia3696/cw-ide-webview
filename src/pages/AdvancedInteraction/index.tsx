import { LoadingOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import _, { isNil } from "lodash";
import { useRef, useState } from "react";
import ReactJson from "react-json-view";
import CosmUpload from "src/components/CosmUpload";
import CosmAddress from "src/components/CosmAddress";
import CustomForm from "src/components/CustomForm";
import CustomInput from "src/components/CustomInput";
import CustomNetwork from "src/components/CustomNetwork";
import CustomSelect from "src/components/CustomSelect";
import MyDropZone from "src/components/DropZone";
import HandleOptions from "src/components/HandleOptions";
import CosmJsFactory from "src/lib/cosmjs-factory";
import { parseGasLimits } from "src/lib/utils";
import { updateSchemaFile } from "src/stores/contract/slice";
import { useAppDispatch } from "src/stores/hooks";
import "../../themes/style.scss";
import "./style.scss";

const antIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "#7954FF" }} spin />
);

interface AdvancedInteractionProps {
  updateChain: any;
  gasData: any;
  mnemonic: any;
}

const AdvancedInteraction: React.FC<AdvancedInteractionProps> = ({
  children,
  updateChain,
  gasData,
  mnemonic,
}) => {
  const [interactOption, setInteractOption] = useState("query");
  const [contractAddr, setContractAddr] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resultJson, setResultJson] = useState({});
  const [isInteractionLoading, setIsInteractionLoading] = useState(false);
  const [resultTxHash, setResultTxHash] = useState(null);
  const [queryMessage, setQueryMessage] = useState("");
  const [executeMessage, setExecuteMessage] = useState("");
  const [migrateMessage, setMigrateMessage] = useState("");
  const [querySchema, setQuerySchema] = useState({});
  const [handleSchema, setHandleSchema] = useState({});
  const [migrateSchema, setMigrateSchema] = useState({});
  const [codeId, setCodeId] = useState("");
  const [migrateContractAddr, setMigrateContractAddr] = useState("");
  const handleOptionsRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const dispatch = useAppDispatch();

  const handleJsonFile = (file: { fileName: string; content: any }) => {
    setFileName(file.fileName);
    dispatch(updateSchemaFile(file.content));
  };

  const handleRemove = () => {
    setFileName("");
    dispatch(updateSchemaFile({}));
  };

  const onHandle = async (data) => {
    setErrorMessage("");
    setResultTxHash(null);
    setIsInteractionLoading(true);
    let cosmJs = new CosmJsFactory(window.chainStore.current);
    try {
      console.log("data: ", executeMessage);
      console.log("data: ", data);
      let finalMessage = executeMessage;
      if (data) finalMessage = JSON.stringify(data);
      const queryResult = await cosmJs.current.execute({
        mnemonic,
        address: contractAddr,
        handleMsg: finalMessage,
        gasAmount: { amount: gasData.gasPrice, denom: gasData.gasDenom },
        gasLimits: parseGasLimits(gasData.gasLimits),
        handleOptions: handleOptionsRef.current,
      });
      console.log("query result: ", queryResult);
      setResultJson({ data: queryResult });
    } catch (error) {
      setErrorMessage(String(error));
    }
    setIsInteractionLoading(false);
  };

  const onQuery = async (data) => {
    console.log("onQuery", "data", data);
    setErrorMessage("");
    setResultTxHash(null);
    setIsInteractionLoading(true);
    let cosmJs = new CosmJsFactory(window.chainStore.current);
    try {
      let finalMessage = queryMessage;
      if (data) finalMessage = JSON.stringify(data || "");
      const queryResult = await cosmJs.current.query(
        contractAddr,
        finalMessage
      );
      console.log("query result: ", queryResult);
      setResultJson({ data: queryResult });
    } catch (error) {
      setErrorMessage(String(error));
    }
    setIsInteractionLoading(false);
  };

  const onMigrate = async (schemaUploaded) => {
    setErrorMessage("");
    setResultTxHash(null);
    setIsInteractionLoading(true);
    let cosmJs = new CosmJsFactory(window.chainStore.current);

    try {
      let finalMessage =
        isNil(migrateMessage) || migrateMessage === "" ? {} : migrateMessage;
      if (schemaUploaded) finalMessage = JSON.stringify(schemaUploaded);
      const migrateResult = await cosmJs.current.migrate({
        mnemonic,
        address: migrateContractAddr,
        codeId: !_.isNil(codeId) && parseInt(codeId),
        handleMsg: JSON.stringify(finalMessage),
        gasAmount: { amount: gasData.gasPrice, denom: gasData.gasDenom },
        gasLimits: parseGasLimits(gasData.gasLimits),
      });
      console.log("Migrate result: ", migrateResult);
      setResultJson({ data: migrateResult });
      setResultTxHash(migrateResult);
    } catch (error) {
      setErrorMessage(String(error));
    }
    setIsInteractionLoading(false);
  };

  const queryForm = (
    <div>
      <div className="contract-address">
        <span>Contract Query </span>
      </div>
      <div className="wrap-form">
        {(_.isEmpty(querySchema) && (
          <div style={{ marginBottom: "24px" }}>
            <CustomInput
              inputHeader="Query message"
              input={queryMessage}
              setInput={setQueryMessage}
              placeholder="eg. {}"
            />
            <Button onClick={() => onQuery(null)} className="primary-button">
              Query
            </Button>
          </div>
        )) || (
            <div style={{ marginBottom: "10px" }}>
              <CustomForm
                schema={querySchema}
                onSubmit={(data) => onQuery(data)}
              />
            </div>
          )}
      </div>
    </div>
  );

  const migrateForm = (
    <div>
      <div className="contract-address">
        <span>Contract Migrate </span>
      </div>
      <div className="wrap-form">
        <CustomInput
          inputHeader="Code Id"
          input={codeId}
          setInput={setCodeId}
        />
        {children}

        {_.isEmpty(migrateSchema) && (
          <div style={{ marginBottom: "24px", marginTop: 14 }}>
            <CustomInput
              inputHeader="Migrate message"
              input={migrateMessage}
              setInput={setMigrateMessage}
              placeholder="eg. {}"
            />
            <Button
              onClick={() => {
                onMigrate(null);
              }}
              className="primary-button"
            >
              Migrate
            </Button>
          </div>
        )}
        {!_.isEmpty(migrateSchema) && (
          <div style={{ marginBottom: "10px", marginTop: 14 }}>
            <CustomForm
              schema={migrateSchema}
              onSubmit={(data) => onMigrate(data)}
            />
          </div>
        )}
      </div>
    </div>
  );

  const executionForm = (
    <div>
      <div className="contract-address">
        <span>Contract Execute </span>
      </div>
      <div className="wrap-form">
        {children}
        <HandleOptions handleOptionsRef={handleOptionsRef} />
        {_.isEmpty(handleSchema) && (
          <div style={{ marginBottom: "10px" }}>
            <CustomInput
              inputHeader="Execute message"
              input={executeMessage}
              setInput={setExecuteMessage}
              placeholder="eg. {}"
            />
            <Button
              onClick={() => {
                onHandle(null);
              }}
              className="primary-button"
            >
              Execute
            </Button>
          </div>
        )}
        {!_.isEmpty(handleSchema) && (
          <div>
            <CustomForm
              schema={handleSchema}
              onSubmit={(data) => onHandle(data)}
            />
          </div>
        )}
      </div>
    </div>
  );

  const form =
    interactOption === "execute"
      ? executionForm
      : "query"
        ? queryForm
        : "migration"
          ? migrateForm
          : null;

  const result = (
    <div style={{ marginTop: "10px" }}>
      <ReactJson
        collapseStringsAfterLength={20}
        name={false}
        displayObjectSize={true}
        src={resultJson}
        theme={"ocean"}
      />
    </div>
  );

  return (
    <div className="cosm-body">
      <CustomNetwork updateChain={updateChain} />
      <CosmUpload />
      <CosmAddress />

      <div className="app-divider" />
      {(fileName && (
        <div>
          <div>{`file name: ${fileName}`}</div>
          <Button onClick={handleRemove} className="remove-secondary">
            Remove CosmWasm schema
          </Button>
        </div>
      )) || (
          <MyDropZone
            setJson={handleJsonFile}
            dropZoneText={"Upload the CosmWasm schema"}
          />
        )}
      <CustomSelect
        displayMigrateOption={true}
        setInteractOption={setInteractOption}
      />
      {form}
      <div className="app-divider" />

      {!isInteractionLoading ? (
        <>
          {errorMessage && (
            <div className="contract-address">
              <span style={{ color: "red" }}>Error message </span>
              <p>{errorMessage}</p>
            </div>
          )}
          {resultTxHash && (
            <div className="contract-address">
              <span style={{ color: "white" }}>Result Tx hash: </span>
              <p>{resultTxHash}</p>
            </div>
          )}
        </>
      ) : (
        <div className="deploying">
          <Spin indicator={antIcon} />
          <span>Invoking ...</span>
        </div>
      )}

      {!_.isEmpty(resultJson) && result}
    </div>
  );
};

export default AdvancedInteraction;
