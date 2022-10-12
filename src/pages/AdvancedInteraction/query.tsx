import { Button } from "antd";
import { useState } from "react";
import CustomInput from "src/components/CustomInput";
import MyDropZone from "src/components/DropZone";
import _ from "lodash";
import CustomForm from "src/components/CustomForm";
import CosmJsFactory from "src/lib/cosmjs-factory";

const QueryForm: React.FC = () => {
  const [querySchema, setQuerySchema] = useState({});
  const [queryMessage, setQueryMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resultTxHash, setResultTxHash] = useState(null);
  const [isInteractionLoading, setIsInteractionLoading] = useState(false);
  const [contractAddr, setContractAddr] = useState("");
  const [resultJson, setResultJson] = useState({});

  const onQuery = async (data) => {
    setErrorMessage("");
    setResultTxHash(null);
    setIsInteractionLoading(true);
    let cosmJs = new CosmJsFactory(window.chainStore.current);
    try {
      let finalMessage = queryMessage;
      if (data) finalMessage = JSON.stringify(data);
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

  let fallbackForm = (
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
      <div style={{ cursor: "pointer", fontFamily: "Courier" }}>
        <MyDropZone
          setSchema={setQuerySchema}
          setJson={null}
          dropZoneText={"Upload the schema file"}
        />
      </div>
    </div>
  );

  let schemaForm = (
    <div style={{ marginBottom: "10px" }}>
      <CustomForm schema={querySchema} onSubmit={(data) => onQuery(data)} />
      <Button
        onClick={() => {
          setQuerySchema({});
        }}
        className="remove-button"
      >
        Remove schema form
      </Button>
    </div>
  );

  return (
    <div>
      <div className="contract-address">
        <span>Contract Query </span>
      </div>
      <div className="wrap-form">
        {(_.isEmpty(querySchema) && fallbackForm) || schemaForm}
      </div>
    </div>
  );
};

export default QueryForm;
