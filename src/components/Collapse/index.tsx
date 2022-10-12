import React, { useState } from "react";
import { Collapse } from "react-collapse";
import RemoveIcon from "../../assets/images/remove.png";
import { Popconfirm } from "antd";

interface DropdownItemProps {
  title: string;
  removeContract: any;
}

const DropdownItem: React.FC<DropdownItemProps> = (props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            maxWidth: 500,
          }}
        >
          <p
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="click"
          >
            {props.title}
          </p>
          <Popconfirm
            onConfirm={undefined}
            title="delete this address?"
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
              srcSet=""
            />
          </Popconfirm>
        </div>
      </div>
      <Collapse isOpened={isDropdownOpen}>
        <div>{props.children}</div>
      </Collapse>
    </div>
  );
};

export default DropdownItem;
