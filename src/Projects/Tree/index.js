import React from "react";
import { CaretDownFilled, CaretRightFilled } from "@ant-design/icons";

///
//
// Tree component
//
// Props
//  isCheckable: supports checking of nodes. But then you must supply ids of checked nodes
//   using checkedNodes prop, and also handle onCheckChange prop.
//  checkedNodes: array of checked nodes ids.
//  onCheckChange: handler when a new node is checked. Receives array of checked nodes.
//  data: tree data
//  isFilterable: to support filter of nodes or not.
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
            name: "John Doe",
            children: [
              {
                id: 99,
                name: "Jack Nicholson",
                children: [],
              },
              {
                id: 991,
                name: "John Travolta",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 32,
        name: "Jim Carrey",
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

const TreeState = React.createContext({});

let Node = (props) => {
  const treeState = React.useContext(TreeState);
  let isExpanded = !!treeState.expandedNodes?.find((x) => x === props.id);
  let isChecked = !!treeState.checkedNodes?.find((x) => x === props.id);
  return (
    <div>
      <div
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => {
          treeState.onExpandNode(props.id, !isExpanded);
        }}
      >
        {/* Expand icon */}
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
        {/* Checkbox */}
        {treeState.isCheckable && (
          <div style={{ width: 20, marginRight: 5 }}>
            <input
              checked={isChecked}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                treeState.onCheckNode(props.id, e.target.checked);
              }}
              type="checkbox"
            />
          </div>
        )}
        <div style={{ padding: 2 }}> {props.name}</div>
      </div>
      {props.children && isExpanded && (
        <div style={{ marginLeft: 20 }}>
          {props.children.map((x) => (
            <Node {...x} key={x.id} />
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

let addOrRemoveItemFromArray = (item, isAdd, array) => {
  let result;

  if (isAdd) {
    result = [...array, item];
  } else {
    result = array.filter((y) => y !== item);
  }
  return result;
};

export default function Tree({
  data = defaultTree,
  isCheckable,
  isFilterable,
  checkedNodes,
  style,
  onCheckChange,
}) {
  let [filter, setFilter] = React.useState("");
  let [expandedNodes, setExpandedNodes] = React.useState([]);

  data = React.useMemo(() => {
    let list = [];

    if (!isFilterable) return data;

    if (!filter) {
      setExpandedNodes([]);
      return data;
    }

    let clone = JSON.parse(JSON.stringify(data));

    let filterResult = filterTree(filter, clone);

    // Set remaining nodes from filter as expanded
    treeToList(filterResult, list);
    setExpandedNodes(
      list.filter((x) => x.children && x.children.length).map((x) => x.id)
    );

    return filterResult;
  }, [filter, data, isFilterable]);

  if (isCheckable && (!onCheckChange || checkedNodes === undefined)) {
    console.error("Checkable tree must be used in controlled mode.");
    return <div>Error</div>;
  }

  let onCheckNode = (id, value) => {
    let result = addOrRemoveItemFromArray(id, value, checkedNodes);
    onCheckChange && onCheckChange(result);
  };

  let onExpandNode = (id, value) => {
    let result = addOrRemoveItemFromArray(id, value, expandedNodes);
    setExpandedNodes(result);
  };
  return (
    <div style={{ padding: 20, ...style }}>
      {isFilterable && (
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
      <TreeState.Provider
        value={{
          onExpandNode,
          onCheckNode,
          isCheckable,
          checkedNodes,
          expandedNodes,
        }}
      >
        {data.map((x) => (
          <Node {...x} key={x.id} />
        ))}
      </TreeState.Provider>
    </div>
  );
}
