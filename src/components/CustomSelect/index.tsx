import { Select } from "antd";
import "antd/dist/antd.css";
import { ReactComponent as IconChain } from "../../assets/icons/chain.svg";
import { ReactComponent as IconSelect } from "../../assets/icons/code.svg";

const interactList = [
  { key: 1, value: "execute" },
  { key: 2, value: "query" },
];
const { Option } = Select;

const CustomSelect = ({ setInteractOption, displayMigrateOption = true }) => {
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
        <h3> Select interaction type</h3>
      </div>
      <Select
        defaultValue={interactList[1].value}
        style={{ width: 240 }}
        suffixIcon={<IconSelect />}
        onSelect={(value) => {
          setInteractOption(value);
        }}
      >
        {interactList.map((info) => (
          <Option key={info.key} value={info.value}>
            {info.value}
          </Option>
        ))}
        {displayMigrateOption && (
          <Option key={3} value={"migrate"}>
            {"migrate"}
          </Option>
        )}
      </Select>
    </div>
  );
};

export default CustomSelect;
