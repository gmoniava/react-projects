import React from "react";
import "./index.css";
import { CaretDownFilled, CaretRightFilled } from "@ant-design/icons";

///
//
// Tree component
//
// Props:
//  checkable: supports checking of nodes. But then you must supply ids of checked nodes
//   using checkedNodes prop, and also handle onCheckChange.
//

let Node = (props) => {
  let [isOpen, setIsOpen] = React.useState(false);
  let isChecked = props.checkedNodes?.find((id) => id === props.id);
  return (
    <div>
      <div
        className={props.wasExpanded && "opened-node"}
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {/* For expand/collapse button */}
        <div
          style={{
            width: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!!props.children &&
            !!props.children.length &&
            (isOpen ? <CaretDownFilled /> : <CaretRightFilled />)}
        </div>
        {/* For checkbox */}
        {props.checkable && (
          <div style={{ width: 20, marginRight: 5 }}>
            <input
              checked={isChecked === undefined ? false : isChecked}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                props.onCheck(props.id, e.target.checked);
              }}
              type="checkbox"
            />
          </div>
        )}
        {/* Here goes node title */}
        <div style={{}}> {props.name}</div>
      </div>
      {props.children && isOpen && (
        <div style={{ marginLeft: 20 }}>
          {props.children.map((x) => (
            <Node {...props} {...x} wasExpanded />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Tree({
  data,
  checkable,
  checkedNodes = [],
  onCheckChange,
}) {
  return (
    <div className="tree" style={{ padding: 20 }}>
      {data.map((x) => (
        <Node
          {...x}
          checkedNodes={checkedNodes}
          onCheck={(id, value) => {
            let isThere = checkedNodes.find((y) => y === id);
            let result;

            if (value && !isThere) {
              result = [...checkedNodes, id];
            } else if (!value && isThere) {
              result = checkedNodes.filter((y) => y !== id);
            }
            onCheckChange && onCheckChange(result);
          }}
          checkable={checkable}
        />
      ))}
    </div>
  );
}
