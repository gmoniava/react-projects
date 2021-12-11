import React from "react";
import "./index.css";
import { CaretDownFilled, CaretRightFilled } from "@ant-design/icons";

///
//
// Tree component
//
// Props
//  checkable: supports checking of nodes. But then you must supply ids of checked nodes
//   using checkedNodes prop, and also handle onCheckChange.
//

let defaultTree = [
  {
    name: "item1",
    id: 1,
    children: [
      {
        name: "item 1.1",
        id: 33,
        children: [
          {
            id: 22,
            name: "item rrr",
            children: [],
          },
          {
            id: 12,
            name: "Barack obama",
            children: [
              {
                id: 99,
                name: "Ozgun",
                children: [],
              },
              {
                id: 991,
                name: "Ozgun2",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 32,
        name: "Thanf gdfdfdf gdf df gdf gdfgdf gos",
        children: [],
      },
      {
        id: 3132,
        name: "Thanos2",
        children: [],
      },
    ],
  },
  { name: "kano", id: 2, children: [] },
  { name: "item3", id: 3, children: [] },
  { name: "item4", id: 4, children: [] },
];

let Node = (props) => {
  let isChecked = props.checkedNodes?.find((id) => id === props.id);
  let isExpanded = props.expandedNodes?.find((id) => id === props.id);

  return (
    <div>
      <div
        className={props.wasExpanded && "opened-node"}
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => {
          props.onExpand(props.id, !isExpanded);
        }}
      >
        {/* For expand/collapse button */}
        <div
          style={{
            width: 20,
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!!props.children &&
            !!props.children.length &&
            (isExpanded ? <CaretDownFilled /> : <CaretRightFilled />)}
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
        <div style={{ padding: 2 }}> {props.name}</div>
      </div>
      {props.children && isExpanded && (
        <div style={{ marginLeft: 20 }}>
          {props.children.map((x) => (
            <Node key={x.id} {...props} {...x} wasExpanded />
          ))}
        </div>
      )}
    </div>
  );
};
let filterTree = (word, treeData) => {
  return treeData.filter((x) => {
    if (x.children && x.children.length) {
      let filterChildren = filterTree(word, x.children);
      if (filterChildren.length > 0) {
        x.children = filterChildren;
        return true;
      }
      return x.name.includes(word);
    }
    return x.name.includes(word);
  });
};

let treeToList = (treeData, list) => {
  treeData.forEach((x) => {
    list.push(x);
    if (x.children) {
      treeToList(x.children, list);
    }
  });
};

let addOrRemoveFromArray = (id, value, array) => {
  let result;

  if (value) {
    result = [...array, id];
  } else {
    result = array.filter((y) => y !== id);
  }
  return result;
};

export default function Tree({
  data = defaultTree,
  checkable,
  filterable,
  checkedNodes,
  style,
  onCheckChange,
}) {
  let [filter, setFilter] = React.useState("");
  let [expandedNodes, setExpandedNodes] = React.useState([]);

  data = React.useMemo(() => {
    let list = [];
    if (!filterable) return data;
    if (!filter) {
      setExpandedNodes([]);
      return data;
    }
    let clone = JSON.parse(JSON.stringify(data));

    // Filter the tree
    let filterResult = filterTree(filter, clone);

    // Set nodes which were found as expanded
    treeToList(filterResult, list);
    setExpandedNodes(
      list.filter((x) => x.children && x.children.length).map((x) => x.id)
    );

    // Return filtered tree
    return filterResult;
  }, [filter, data, filterable]);

  if (checkable && (!onCheckChange || checkedNodes === undefined)) {
    console.warn("Checkable tree must be used in controlled mode.");
    return null;
  }

  return (
    <div className="tree" style={{ padding: 20, ...style }}>
      {filterable && (
        <div>
          <input
            placeholder="Filter value"
            style={{
              height: 20,
              border: "1px solid lightgray",
              borderRadius: 5,
              marginBottom: 5,
            }}
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          />
        </div>
      )}
      {data.map((x) => (
        <Node
          key={x.id}
          {...x}
          expandedNodes={expandedNodes}
          onExpand={(id, value) => {
            let result = addOrRemoveFromArray(id, value, expandedNodes);
            setExpandedNodes(result);
          }}
          checkedNodes={checkedNodes}
          onCheck={(id, value) => {
            let result = addOrRemoveFromArray(id, value, checkedNodes);
            onCheckChange && onCheckChange(result);
          }}
          checkable={checkable}
        />
      ))}
    </div>
  );
}
