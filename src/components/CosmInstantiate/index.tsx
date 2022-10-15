import { LoadingOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import clsx from "clsx";
import _ from "lodash";
import { useEffect, useState } from "react";
import CustomForm from "src/components/CustomForm";
import CustomInput from "src/components/CustomInput";
import {
  instantiateCosmWasm,
  selectAddress,
  selectErrorInit,
  selectInstantiateSchema,
  selectIsLoadingInit,
  selectResultInit,
  updateAddress,
} from "src/stores/contract/slice";
import { useAppDispatch, useAppSelector } from "src/stores/hooks";
import "./style.scss";

interface CosmAddressProps {
  className?: string;
}

const antIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "#7954FF" }} spin />
);

const CosmInstantiate: React.FC<CosmAddressProps> = ({ className }) => {
  const address = useAppSelector(selectAddress);
  const dispatch = useAppDispatch();
  const instantiateSchema = useAppSelector(selectInstantiateSchema);
  const [instantiateMessage, setInstantiateMessage] = useState("");

  const handleInstantiateCosmWasm = (data: any) => {
    if (typeof data === "string") {
      if (data == "") {
        data = "{}";
      }
      data = JSON.parse(data);
    }
    dispatch(instantiateCosmWasm(data));
  };

  const resultInit = useAppSelector(selectResultInit);
  const errorInit = useAppSelector(selectErrorInit);
  const isLoadingInit = useAppSelector(selectIsLoadingInit);

  const displayErr = (
    <div>
      <span style={{ color: "red" }}>Error message </span>
      <p>{errorInit}</p>
    </div>
  );

  useEffect(() => {
    dispatch(updateAddress(resultInit));
  }, [resultInit]);

  return (
    <div className={clsx("wrap-form", "cosm-instantiate", className)}>
      {isLoadingInit && (
        <div className="deploying">
          <Spin indicator={antIcon} />
          <span>Instantiating ...</span>
        </div>
      )}
      {(_.isEmpty(instantiateSchema) && (
        <div style={{ marginBottom: "24px" }}>
          <CustomInput
            inputHeader="Instantiate message"
            input={instantiateMessage}
            setInput={setInstantiateMessage}
            placeholder="eg. {}"
          />
          <Button
            onClick={() => handleInstantiateCosmWasm(instantiateMessage)}
            className="primary-button"
          >
            Instantiate
          </Button>
        </div>
      )) || (
        <div style={{ marginBottom: "10px" }}>
          <CustomForm
            schema={instantiateSchema}
            onSubmit={(data) => {
              console.log("init with data", data);
              handleInstantiateCosmWasm(data);
            }}
          />
        </div>
      )}
      <CustomInput
        inputHeader="CosmWasm address"
        input={address}
        setInput={(input) => {
          dispatch(updateAddress(input));
        }}
        placeholder="eg. shareledger1mms7cehvyx7pxp7lllt0mn47hz5ufxwfwc2t95"
      />
      {errorInit && displayErr}
    </div>
  );
};

export default CosmInstantiate;
