// hot reload
import { LoadingOutlined } from "@ant-design/icons";
import Form from "@rjsf/antd";
import { Button, Popconfirm, Spin, Tabs } from "antd";
import "antd/dist/antd.css";
import _, { isNil } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import ReactJson from "react-json-view";
import { ContractType } from "src/types/contract";
import CosmJsFactory from "../../lib/cosmjs-factory";
import { parseGasLimits, processSchema } from "../../lib/utils";
import { AdvancedInteraction } from "../../pages";
import instantiateOptionsSchema from "../../types/schema/instantiate-options";
import DropdownItem from "../Collapse";
import RemoveIcon from "../../assets/images/remove.png";
import logo from "../../assets/images/logo.png";
import "./style.css";
import CustomSelect from "src/components/CustomSelect";
import GasForm from "src/components/GasForm";
import HandleOptions from "src/components/HandleOptions";
import CustomForm from "src/components/CustomForm";
import CustomInput from "src/components/CustomInput";
import CustomNetwork from "src/components/CustomNetwork";
import validator from "@rjsf/validator-ajv6";

const { TabPane } = Tabs;
const antIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "#7954FF" }} spin />
);

// TODO: this component is too big, need to refactor
const Cosm: React.FC = () => {
  const [initSchemaData, setInitSchemaData] = useState(undefined);
  const [mnemonic, setMnemonic] = useState("");
  const [isBuilt, setIsBuilt] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [wasmBody, setWasmBody] = useState();
  const [label, setLabel] = useState("");
  const [gasData, setGasData] = useState({
    gasPrice: window.chainStore.current.gasPriceStep?.average
      ? window.chainStore.current.gasPriceStep.average.toString()
      : "0",
    gasDenom: window.chainStore.current.feeCurrencies[0].coinMinimalDenom,
    gasLimits: 2000000,
  });
  const [contractAddr, setContractAddr] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [initSchema, setInitSchema] = useState(undefined);
  const [migrateSchema, setMigrateSchema] = useState(undefined);
  const [migrateSchemaData, setMigrateSchemaData] = useState("");
  const [migrateContractAddr, setMigrateContractAddr] = useState("");
  const [querySchema, setQuerySchema] = useState({});
  const [handleSchema, setHandleSchema] = useState({});
  const [schema, setSchema] = useState({});
  // const [resultJson, setResultJson] = useState({});
  const [resultJson, setResultJson] = useState<
    Array<{
      contract: string;
      data: any;
    }>
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isInteractionLoading, setIsInteractionLoading] = useState(false);
  const [resultTxHash, setResultTxHash] = useState(null);
  const [deploySource, setDeploySource] = useState("");
  const [deployBuilder, setDeployBuilder] = useState("");
  const [instantiateOptions, setOptions] = useState(undefined);
  const [interactOption, setInteractOption] = useState("query");
  const [codeId, setCodeId] = useState(undefined);
  const [ideAction, setIdeAction] = useState("");
  const [arrayContract, setArrayContract] = useState([] as ContractType[]);
  const [chainName, setChainName] = useState("Oraichain Testnet");
  const handleOptionsRef = useRef(null);

  // Handle messages sent from the extension to the webview
  const eventHandler = (event: MessageEvent) => {
    const message = event.data; // The json data that the extension sent
    if (message.payload) setWasmBody(message.payload);
    if (message.mnemonic) {
      setMnemonic(message.mnemonic);
    }
    // if message payload is build => post message back to extension to collect schema file
    console.log(message, "message received!!");
    switch (message.action) {
      case "build":
        handleBuild(message);
        break;
      case "deploy":
        handleDeploy(message);
        break;
      case "upload":
        handleUpload(message);
        break;
      case "instantiate":
        handleInstantiate(message);
        break;
    }
  };

  const handleBuild = function (message: ContractType) {
    setInitSchema(processSchema(JSON.parse(message.schemaFile as string)));
    !_.isNil(message?.migrateSchemaFile) &&
      setMigrateSchema(
        processSchema(JSON.parse(message?.migrateSchemaFile as string)) || null
      );
    setHandleSchema({});
    setQuerySchema({});
    setIsBuilt(true);
    setIsUploaded(false);
    setIsDeployed(false);
    setCodeId(undefined);
    setContractAddr("");
    setErrorMessage("");
    setResultTxHash(null);
  };

  const handleDeploy = function (message: ContractType) {
    // console.log("query file: ", message.queryFile);
    let handleFile = processSchema(JSON.parse(message.handleFile as string));
    let queryFile = processSchema(JSON.parse(message.queryFile as string));
    let migrateFile = !_.isNil(message.migrateFile as string)
      ? processSchema(JSON.parse(message.migrateFile as string))
      : null;
    setHandleSchema(handleFile);
    setQuerySchema(queryFile);
    onDeploy(
      message.mnemonic,
      message.payload,
      handleFile,
      queryFile,
      migrateFile,
      message.action
    );
  };

  const handleUpload = function (message: ContractType) {
    console.log("message upload: ", message);
    setInitSchema(processSchema(JSON.parse(message.schemaFile as string)));
    onUpload(message.mnemonic, message.payload);
  };

  const handleInstantiate = function (message: ContractType) {
    console.log("message instantiate: ", message);
    let handleFile = processSchema(JSON.parse(message.handleFile as string));
    let queryFile = processSchema(JSON.parse(message.queryFile as string));
    let migrateFile = !_.isNil(message?.migrateFile as string)
      ? processSchema(JSON.parse(message?.migrateFile as string))
      : null;
    setHandleSchema(handleFile);
    setQuerySchema(queryFile);
    onInstantiate(
      message.mnemonic,
      handleFile,
      queryFile,
      migrateFile,
      message.action
    );
  };

  // FIXME: this is a bug
  // useEffect(() => {
  //   window.addEventListener("message", eventHandler);
  //   return () => {
  //     window.removeEventListener("message", eventHandler);
  //   };
  // }, []);

  useEffect(() => {
    getFilterLocalstorage();
  }, []);

  useEffect(() => {
    getFilterLocalstorage();
  }, [chainName]);

  const getFilterLocalstorage = () => {
    const key = "contract-infos";
    const getLocalStorage = window.localStorage.getItem(key);
    let array: any = [];
    if (getLocalStorage) {
      let contracts: ContractType[] = JSON.parse(getLocalStorage);
      array = [...contracts].filter((e) => e.chainName === chainName);
      setArrayContract(array);
    }
  };

  const setLocalstorage = (
    contract: String,
    handleFile: any,
    queryFile: any,
    migrateFile: any,
    action: String
  ) => {
    const key: string = "contract-infos";
    const getLocalStorage = window.localStorage.getItem(key);
    const curContract: ContractType = {
      contract,
      handleFile,
      queryFile,
      migrateFile,
      action,
      chainName,
    };
    let array: ContractType[] = [];
    if (getLocalStorage) {
      let contracts: ContractType[] = JSON.parse(getLocalStorage);
      let CheckDuplicateContract = contracts.find(
        (e) => e.contract === contract && e.chainName === chainName
      );
      array = CheckDuplicateContract
        ? [...JSON.parse(getLocalStorage)]
        : [...JSON.parse(getLocalStorage), curContract];
      window.localStorage.setItem(key, JSON.stringify([...array]));
    } else {
      array = [curContract];
      window.localStorage.setItem(key, JSON.stringify([...array]));
    }
    array = array && array.filter((e) => e.chainName === chainName);
    setArrayContract(array);
  };

  const updateChain = (value: string) => {
    setChainName(value);
    setGasData({
      ...gasData,
      gasPrice: window.chainStore.current.gasPriceStep?.average
        ? window.chainStore.current.gasPriceStep.average.toString()
        : "0",
      gasDenom: window.chainStore.current.feeCurrencies[0].coinMinimalDenom,
    });
  };

  const handleOnChange = _.throttle(
    ({ formData }) => {
      setInitSchemaData(formData);
    },
    2000,
    { trailing: true }
  );

  const handleOnMigrateSchemaChange = _.throttle(
    ({ formData }) => {
      setMigrateSchemaData(formData);
    },
    2000,
    { trailing: true }
  );

  const handleOnInstantiateOptChange = _.throttle(
    ({ formData }) => {
      setOptions(formData);
    },
    2000,
    { trailing: true }
  );

  const actionHandling = (action) => {
    resetMessage();
    setIsLoading(true);
    setIdeAction(action);
  };

  const errorActionHandling = (error) => {
    setIsBuilt(true);
    setErrorMessage(String(error));
  };

  const onUpload = async (mnemonic: any, wasmBytes: any) => {
    console.log("wasm bytes: ", wasmBytes);
    if (!wasmBytes) {
      setErrorMessage(
        "Wasm bytes is empty! You need to build the smart contract first to get the wasm binary file before uploading."
      );
      return;
    }
    actionHandling("Uploading");

    try {
      let cosmJs = new CosmJsFactory(window.chainStore.current);
      // let address = await Wasm.handleDeploy({ mnemonic, wasmBody: wasmBytes ? wasmBytes : wasmBody, initInput, label, sourceCode: '' });
      let codeId = await cosmJs.current.handleUpload({
        mnemonic,
        wasmBody: wasmBytes,
        source: deploySource,
        builder: deployBuilder ? deployBuilder : undefined,
        gasAmount: { amount: gasData.gasPrice, denom: gasData.gasDenom },
        gasLimits: parseGasLimits(gasData.gasLimits),
      });
      setCodeId(codeId);
      setIsUploaded(true);
      setIsBuilt(true);
      setIsDeployed(false);
      setContractAddr("");

      // clear all uploading data
      setDeploySource("");
      setDeployBuilder("");
    } catch (error) {
      errorActionHandling(String(error));
    }
    setIsLoading(false);
  };

  const onInstantiate = async (
    mnemonic: any,
    handleFile,
    queryFile,
    migrateFile,
    action
  ) => {
    console.log("Instantiate data: ", initSchemaData);
    if (!initSchemaData) {
      setErrorMessage(
        "Instantiate data is empty! You need to build or upload the smart contract first to get the instantiate json schema & fill the inputs to deploy or instantiate the contract"
      );
      return;
    }
    if (!codeId) {
      setErrorMessage(
        "Code id is empty! You need to fill the contract's code id or upload the contract first"
      );
      return;
    }
    actionHandling("Instantiating");

    try {
      let cosmJs = new CosmJsFactory(window.chainStore.current);
      // let address = await Wasm.handleDeploy({ mnemonic, wasmBody: wasmBytes ? wasmBytes : wasmBody, initInput, label, sourceCode: '' });
      let address = await cosmJs.current.handleInstantiate({
        mnemonic,
        codeId: parseInt(codeId),
        initInput: initSchemaData,
        label,
        gasAmount: { amount: gasData.gasPrice, denom: gasData.gasDenom },
        instantiateOptions,
        gasLimits: parseGasLimits(gasData.gasLimits),
      });
      console.log("contract address: ", address);
      setLocalstorage(address, handleFile, queryFile, migrateFile, action);
      setContractAddr(address);
      setIsDeployed(true);
      setIsBuilt(false);
      setIsUploaded(false);
      setCodeId(undefined);

      // clear all instantiate data
      // setInitSchemaData(undefined);
      // setInitSchema(undefined);
      setCodeId(undefined);
      setOptions(undefined);
    } catch (error) {
      errorActionHandling(String(error));
    }
    setIsLoading(false);
  };

  const onDeploy = async (
    mnemonic: any,
    wasmBytes?: any,
    handleFile?: any,
    queryFile?: any,
    migrateFile?: any,
    action?: any
  ) => {
    console.log("Instantiate data: ", initSchemaData);
    if (!initSchemaData) {
      setErrorMessage(
        "Instantiate data is empty! You need to build or upload the smart contract first to get the instantiate json schema & fill the inputs to deploy or instantiate the contract"
      );
      return;
    }
    actionHandling("Deploying");

    try {
      let cosmJs = new CosmJsFactory(window.chainStore.current);
      // let address = await Wasm.handleDeploy({ mnemonic, wasmBody: wasmBytes ? wasmBytes : wasmBody, initInput, label, sourceCode: '' });
      let address = await cosmJs.current.handleDeploy({
        mnemonic,
        wasmBody: wasmBytes ? wasmBytes : wasmBody,
        source: deploySource,
        builder: deployBuilder ? deployBuilder : undefined,
        initInput: initSchemaData,
        label,
        gasAmount: { amount: gasData.gasPrice, denom: gasData.gasDenom },
        gasLimits: parseGasLimits(gasData.gasLimits),
        instantiateOptions,
      });
      console.log("contract address: ", address);
      setLocalstorage(address, handleFile, queryFile, migrateFile, action);
      // setContractAddr(address);
      // setIsDeployed(true);
      setIsBuilt(false);
      setIsUploaded(false);
      setCodeId(undefined);

      // clear all deploy data
      setInitSchemaData(undefined);
      setInitSchema(undefined);
      setCodeId(undefined);
      setOptions(undefined);
      setDeploySource("");
      setDeployBuilder("");
    } catch (error) {
      errorActionHandling(String(error));
    }
    setIsLoading(false);
  };

  const onQuery = async (data: any, contract: string) => {
    console.log("data: ", data);
    resetMessage();
    setIsInteractionLoading(true);
    let cosmJs = new CosmJsFactory(window.chainStore.current);
    try {
      const queryResult = await cosmJs.current.query(
        contract,
        JSON.stringify(data)
      );
      console.log("query result: ", queryResult);
      setResultJson([{ contract, data: queryResult }, ...resultJson]);
    } catch (error) {
      setErrorMessage(String(error));
    }
    setIsInteractionLoading(false);
  };

  const onHandle = async (data: any, contract: string) => {
    console.log("data: ", data);
    resetMessage();
    setIsInteractionLoading(true);
    let cosmJs = new CosmJsFactory(window.chainStore.current);
    try {
      const queryResult = await cosmJs.current.execute({
        mnemonic,
        address: contract,
        handleMsg: JSON.stringify(data),
        handleOptions: handleOptionsRef?.current,
        gasAmount: { amount: gasData.gasPrice, denom: gasData.gasDenom },
        gasLimits: parseGasLimits(gasData.gasLimits),
      });
      console.log("query result: ", queryResult);
      setResultJson([{ contract, data: queryResult }, ...resultJson]);
    } catch (error) {
      setErrorMessage(String(error));
    }
    setIsInteractionLoading(false);
  };

  const resetMessage = () => {
    setResultTxHash(null);
    setErrorMessage("");
    setResultJson([]);
  };

  const removeContract = (contract: String) => {
    const key = "contract-infos";
    if (!contract) {
      window.localStorage.setItem(key, JSON.stringify([]));
      setArrayContract([]);
      return;
    }
    const getLocalStorage = window.localStorage.getItem(key) || "[]";
    let array = JSON.parse(getLocalStorage).filter(
      (e) => e.contract !== contract
    );
    window.localStorage.setItem(key, JSON.stringify([...array]));
    getFilterLocalstorage();
  };

  const onMigrate = async (data: any, contract: any) => {
    setErrorMessage("");
    setResultTxHash(null);
    setIsInteractionLoading(true);
    let cosmJs = new CosmJsFactory(window.chainStore.current);
    let handleMsg = isNil(data) || data === "" ? {} : data;
    try {
      const migrateResult = await cosmJs.current.migrate({
        mnemonic,
        address: migrateContractAddr || contract,
        codeId: !isNil(codeId) && parseInt(codeId),
        handleMsg: JSON.stringify(handleMsg),
        gasAmount: { amount: gasData.gasPrice, denom: gasData.gasDenom },
        gasLimits: parseGasLimits(gasData.gasLimits),
        // handleOptions: handleOptionsRef.current,
      });
      console.log("migrate result: ", migrateResult);
      setResultTxHash(migrateResult);
      // setResultJson({ data: migrateResult });
    } catch (error) {
      setErrorMessage(String(error));
    }
    setIsInteractionLoading(false);
  };

  const contract = (
    <div className="contract">
      {!isLoading ? (
        arrayContract.length ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Contract address </span>
            <Popconfirm
              title="delete all contact address?"
              onConfirm={() => removeContract("")}
              okText="Yes"
              placement="top"
              cancelText="No"
            >
              <img
                className="click"
                src={RemoveIcon}
                width={20}
                height={20}
                alt=""
              />
            </Popconfirm>
          </div>
        ) : (
          <></>
        )
      ) : (
        <div className="deploying">
          <Spin indicator={antIcon} />
          <span>{ideAction} ...</span>
        </div>
      )}
      {!isLoading &&
        arrayContract &&
        arrayContract.map((e: any, i: Number) => {
          let resjson = resultJson.find((res) => res.contract === e.contract);
          let src = resjson && resjson.data ? { data: resjson.data } : {};
          return (
            <div className="cosm-body">
              <DropdownItem
                title={e.contract as any}
                removeContract={undefined}
              >
                {!_.isNil(e?.queryFile || e?.handleFile || e?.migrateFile) && (
                  <>
                    <CustomSelect
                      displayMigrateOption={
                        !_.isNil(e?.migrateFile) ? true : false
                      }
                      setInteractOption={setInteractOption}
                    />
                    {interactOption === "execute" && (
                      <div>
                        <div className="contract">
                          <span>Contract Execute </span>
                        </div>
                        <GasForm gasData={gasData} setGasData={setGasData}>
                          <CustomInput
                            inputHeader="Wallet mnemonic (optional)"
                            input={mnemonic}
                            setInput={setMnemonic}
                            placeholder="eg. foo bar"
                            type={"password"}
                          />
                        </GasForm>
                        <HandleOptions handleOptionsRef={handleOptionsRef} />
                        <CustomForm
                          schema={e?.handleFile}
                          onSubmit={(data) => onHandle(data, e.contract)}
                        />
                      </div>
                    )}
                    {interactOption === "query" && (
                      <div>
                        <div className="contract">
                          <span>Contract Query </span>
                        </div>
                        <CustomForm
                          schema={e?.queryFile}
                          onSubmit={(data) => onQuery(data, e.contract)}
                        />
                      </div>
                    )}
                    {interactOption === "migrate" && !_.isNil(e?.migrateFile) && (
                      <div>
                        <div
                          style={{ marginTop: 8, marginBottom: -20 }}
                          className="contract"
                        >
                          <span>Contract Migrate </span>
                        </div>
                        <div className="wrap-form">
                          <CustomInput
                            inputHeader="Code Id"
                            input={codeId}
                            setInput={setCodeId}
                          />
                          <GasForm gasData={gasData} setGasData={setGasData}>
                            <CustomInput
                              inputHeader="Wallet mnemonic (optional)"
                              input={mnemonic}
                              setInput={setMnemonic}
                              placeholder="eg. foo bar"
                              type={"password"}
                            />
                          </GasForm>
                          <CustomForm
                            schema={e?.migrateFile}
                            onSubmit={(data) => onMigrate(data, e.contract)}
                          />
                        </div>
                      </div>
                    )}
                    {!_.isEmpty(src) && (
                      <div style={{ marginTop: "10px" }}>
                        <ReactJson
                          collapseStringsAfterLength={20}
                          name={false}
                          displayObjectSize={false}
                          src={src}
                          theme={"ocean"}
                        />
                      </div>
                    )}
                  </>
                )}
              </DropdownItem>
            </div>
          );
        })}
    </div>
  );

  const build = isBuilt && (
    <div>
      <div className="cosm-body">
        <CustomNetwork updateChain={updateChain} />

        <Tabs
          hideAdd={true}
          className="tabs"
          defaultActiveKey="1"
          onChange={() => {}}
        >
          <TabPane className="tab" tab="Instantiate" key="1">
            <>
              <div className="wrap-form">
                <span className="please-text">
                  Please fill out the form below to deploy the contract:
                </span>
                <CustomInput
                  inputHeader="input label"
                  input={label}
                  setInput={setLabel}
                />
                <GasForm gasData={gasData} setGasData={setGasData}>
                  {}
                </GasForm>
                <CustomInput
                  inputHeader="Code Id"
                  input={codeId}
                  setInput={setCodeId}
                />
                {!isUploaded && (
                  <div>
                    <CustomInput
                      inputHeader="Source code url"
                      input={deploySource}
                      setInput={setDeploySource}
                      placeholder="eg. https://foobar.com"
                    />
                    <CustomInput
                      inputHeader="Contract builder (Docker img with tag)"
                      input={deployBuilder}
                      setInput={setDeployBuilder}
                      placeholder="eg. orai/orai:0.40.1"
                    />
                  </div>
                )}
                <div className="input-form">
                  <Form
                    schema={instantiateOptionsSchema as any}
                    validator={validator}
                    formData={instantiateOptions}
                    onChange={handleOnInstantiateOptChange}
                    // onSubmit={(data) => setInitSchemaData(data.formData)}
                    children={true}
                  />
                </div>
              </div>
              <Form
                schema={initSchema as any}
                validator={validator}
                formData={initSchemaData}
                onChange={handleOnChange}
                onSubmit={(data) => setInitSchemaData(data.formData)}
                children={true}
              />
            </>
          </TabPane>
          {!_.isNil(migrateSchema) && (
            <TabPane className="tab" tab="Migrate" key="2">
              <div className="wrap-form">
                <span className="please-text">
                  Please fill out the form below to migrate the contract:
                </span>
                <CustomInput
                  inputHeader="Code Id"
                  input={codeId}
                  setInput={setCodeId}
                />
                <CustomInput
                  inputHeader="Contract Address"
                  input={migrateContractAddr}
                  setInput={setMigrateContractAddr}
                />
                <GasForm gasData={gasData} setGasData={setGasData}>
                  <CustomInput
                    inputHeader="Wallet mnemonic (optional)"
                    input={mnemonic}
                    setInput={setMnemonic}
                    placeholder="eg. foo bar"
                    type={"password"}
                  />
                </GasForm>
                <Form
                  schema={migrateSchema}
                  validator={validator}
                  formData={migrateSchemaData}
                  onChange={handleOnMigrateSchemaChange}
                  onSubmit={(data) => setMigrateSchemaData(data.formData)}
                  children={true}
                />
                <div className="button-wrapper">
                  <Button
                    onClick={() => {
                      onMigrate(migrateSchemaData, migrateContractAddr);
                    }}
                    className="primary-button"
                  >
                    Migrate
                  </Button>
                </div>
              </div>
            </TabPane>
          )}
        </Tabs>
      </div>
    </div>
  );

  const fallback = (
    <AdvancedInteraction
      updateChain={updateChain}
      gasData={gasData}
      mnemonic={mnemonic}
    >
      <GasForm gasData={gasData} setGasData={setGasData}>
        <CustomInput
          inputHeader="Wallet mnemonic (optional)"
          input={mnemonic}
          setInput={setMnemonic}
          placeholder="eg. foo bar"
          type={"password"}
        />
      </GasForm>
    </AdvancedInteraction>
  );

  const interactionLoading = !isInteractionLoading ? (
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
  );

  return (
    <div className="cosm">
      <header className="cosm-header">
        <img src={logo} className="cosm-logo" alt="logo" />
        <h1 className="cosm-title">COSMWASM IDE</h1>
      </header>
      <div className="cosm-divider" />

      {contract}
      {interactionLoading}
      {build}
      {!isBuilt &&
        !isDeployed &&
        !isLoading &&
        !isUploaded &&
        !errorMessage &&
        fallback}
    </div>
  );
};

export default Cosm;
