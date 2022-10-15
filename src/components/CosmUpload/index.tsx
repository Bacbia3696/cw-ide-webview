import { LoadingOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import clsx from "clsx";
import { parseInt } from "lodash";
import { useEffect, useState } from "react";
import CustomInput from "src/components/CustomInput";
import MyDropZone from "src/components/DropZone";
import {
  selectCodeId,
  selectError,
  selectIsLoading,
  selectResult,
  updateCodeId,
  uploadCosmWasm,
} from "src/stores/contract/slice";
import { useAppDispatch, useAppSelector } from "src/stores/hooks";
import "./style.scss";

const antIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "#7954FF" }} spin />
);

interface CosmActionsProps {
  className?: string;
}

const CosmUpload: React.FC<CosmActionsProps> = ({ className }) => {
  const [wasmFileName, setWasmFileName] = useState("");
  const [wasm, setWasm] = useState("");
  const dispatch = useAppDispatch();

  const errorMessage = useAppSelector(selectError);
  const result = useAppSelector(selectResult);
  const isLoading = useAppSelector(selectIsLoading);
  const codeId = useAppSelector(selectCodeId);

  const handleBase64File = (file: { fileName: string; content: string }) => {
    setWasmFileName(file.fileName);
    setWasm(file.content);
  };

  useEffect(() => {
    let codeId = parseInt(result);
    dispatch(updateCodeId(codeId));
  }, [result]);

  const handleRemoveWasm = () => {
    setWasmFileName("");
  };

  const handleUploadWasm = () => {
    dispatch(uploadCosmWasm(wasm));
  };

  const displayErr = (
    <div>
      <span style={{ color: "red" }}>Error message </span>
      <p>{errorMessage}</p>
    </div>
  );

  const displayWasmUpload = (wasmFileName && (
    <div>
      <div>{`file name: ${wasmFileName}`}</div>
      <Button onClick={handleRemoveWasm} className="remove-secondary">
        Remove CosmWasm
      </Button>
    </div>
  )) || (
    <MyDropZone
      setBase64={handleBase64File}
      dropZoneText={"Upload the CosmWasm binary code"}
    />
  );

  return (
    <div className={clsx("wrap-form", className, "cosm-upload")}>
      <h4>Upload CosmWasm</h4>
      {displayWasmUpload}

      <div className="wrapper">
        <Button
          onClick={handleUploadWasm}
          className="primary-button"
          disabled={!wasmFileName}
        >
          Upload CosmWasm
        </Button>

        <CustomInput
          inputHeader="Code ID"
          input={codeId}
          setInput={(input: any) => {
            let codeId = parseInt(input);
            dispatch(updateCodeId(codeId));
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
