import { useRef } from "react";
import Form from "@rjsf/antd";
import "antd/dist/antd.css";
import _ from "lodash";
import { Select } from "antd";
import validator from "@rjsf/validator-ajv6";

const { Option } = Select;

const CustomSelect =
  (selectionRef, schemaObj) =>
  ({ options: { enumOptions }, value, onChange, ...props }) => {
    return (
      <Select
        {...props}
        onChange={(value) => {
          // temp workaround, only update selection & reset schema when it's the first level of the schema
          if (props.id === "root__anyof_select") {
            selectionRef.current = +value;
            schemaObj.current = {};
          }
          onChange(+value);
        }}
        value={value}
      >
        {enumOptions.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>
    );
  };

const CusomForm = ({ schema, onSubmit }) => {
  const selection = useRef(0);
  const schemaObj = useRef({});
  const widgets = {
    SelectWidget: CustomSelect(selection, schemaObj),
  };

  const handleError = (error) => {
    console.log("errors: ", error);
  };

  return (
    <Form
      widgets={widgets as any}
      schema={schema as any}
      validator={validator}
      onSubmit={({ formData, schema }) => {
        console.log(formData, schema);
        const schemaItem = (schema.oneOf || schema.anyOf || schema)[
          selection.current
        ];
        console.log("schemaItem", schemaItem);
        const schemaKey = schemaItem?.required?.[0] || schema?.required?.[0];
        console.log("schemaKey", schemaKey);
        // in the case that the form data still returns correct form data => update schema
        if (formData[schemaKey]) {
          schemaObj.current = { [schemaKey]: formData[schemaKey] };
          onSubmit({ [schemaKey]: formData[schemaKey] });
          return;
        }
        onSubmit?.(schemaObj.current);
      }}
      noValidate
      onError={handleError}
    />
  );
};

export default CusomForm;
