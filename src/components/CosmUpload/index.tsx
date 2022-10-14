import { Button, Spin } from "antd";
import clsx from "clsx";
import { useEffect, useState } from "react";
import MyDropZone from "src/components/DropZone";
import { useAppDispatch, useAppSelector } from "src/stores/hooks";
import {
  selectError,
  selectIsLoading,
  selectResult,
  uploadCosmWasm,
} from "src/stores/contract/slice";
import "./style.scss";
import CustomInput from "src/components/CustomInput";
import _ from "lodash";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "#7954FF" }} spin />
);

interface CosmActionsProps {
  className?: string;
}

const CosmUpload: React.FC<CosmActionsProps> = ({ className }) => {
  const [fileName, setFileName] = useState("");
  const [wasm, setWasm] = useState("");
  const [codeId, setCodeId] = useState<number | undefined>(undefined);
  const dispatch = useAppDispatch();

  const errorMessage = useAppSelector(selectError);
  const result = useAppSelector(selectResult);
  const isLoading = useAppSelector(selectIsLoading);

  const handleBase64File = (file: { fileName: string; content: string }) => {
    setFileName(file.fileName);
    setWasm(file.content);
  };

  useEffect(() => {
    setCodeId(result);
  }, [result]);

  const handleRemove = () => {
    setFileName("");
  };

  const handleUpload = () => {
    dispatch(uploadCosmWasm(wasm));
  };

  //TODO: update
  const displayErr = (
    <div>
      <span style={{ color: "red" }}>Error message </span>
      <p>{errorMessage}</p>
    </div>
  );

  return (
    <div className={clsx("wrap-form", className, "custom-actions")}>
      <h4>Upload CosmWasm</h4>
      {(fileName && (
        <div>
          <div>{`file name: ${fileName}`}</div>
          <Button onClick={handleRemove} className="remove-secondary">
            Remove CosmWasm
          </Button>
        </div>
      )) || (
        <MyDropZone
          setBase64={handleBase64File}
          dropZoneText={"Upload the CosmWasm binary code"}
        />
      )}
      <div className="wrapper">
        <Button
          onClick={handleUpload}
          className="primary-button"
          disabled={!fileName}
        >
          Upload CosmWasm
        </Button>

        <CustomInput
          inputHeader="Code ID"
          input={codeId}
          setInput={(input: any) => {
            setCodeId(input);
          }}
          placeholder="eg. 1"
          type={"number"}
        />
      </div>

      <div className="app-divider" />

      {errorMessage && displayErr}

      {isLoading && (
        <div className="deploying">
          <Spin indicator={antIcon} />
          <span>Uploading ...</span>
        </div>
      )}
    </div>
  );
};

export default CosmUpload;
