import React from "react";
import { CaretDownFilled, CaretRightFilled } from "@ant-design/icons";
import styled from "styled-components";

///
//
// Tree component
//
// Props
//  isCheckable: supports checking of nodes. But then you must supply ids of checked nodes
//  using checkedNodes prop, and also handle onCheckChange prop.
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
            name: "item 1.1.1",
            children: [],
          },
          {
            id: 12,
            name: "item 1.1.2",
            children: [
              {
                id: 99,
                name: "item 1.1.2.1",
                children: [],
              },
              {
                id: 991,
                name: "item 1.1.2.2",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 32,
        name: "item 1.2",
        children: [],
      },
      {
        id: 3132,
        name: "item 1.3",
        children: [],
      },
    ],
  },
  { name: "item 2", id: 2, children: [] },
  { name: "item 3", id: 3, children: [] },
  { name: "item 4", id: 4, children: [] },
];

let ExpandIconContainerStyled = styled.div`
  width: 20px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
let CheckBoxStyled = styled.input`
  width: 20px;
  margin-right: 5px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

let NodeStyled = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

let FilterInputStyled = styled.input`
  height: 20px;
  border: 1px solid lightgray;
  border-radius: 5px;
  margin-bottom: 5px;
`;

const TreeState = React.createContext({});

let Node = (props) => {
  const treeState = React.useContext(TreeState);
  let isExpanded = !!treeState.expandedNodes?.find((x) => x === props.id);
  let isChecked = !!treeState.checkedNodes?.find((x) => x === props.id);

  return (
    <div>
      <NodeStyled
        onClick={() => {
          treeState.onExpandNode(props.id, !isExpanded);
        }}
      >
        <ExpandIconContainerStyled>
          {props.children &&
            !!props.children.length &&
            (isExpanded ? <CaretDownFilled /> : <CaretRightFilled />)}
        </ExpandIconContainerStyled>
        {treeState.isCheckable && (
          <CheckBoxStyled
            checked={isChecked}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(e) => {
              treeState.onCheckNode(props.id, e.target.checked);
            }}
            type="checkbox"
          />
        )}
        <div style={{ padding: 2 }}> {props.name}</div>
      </NodeStyled>
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
  let result = [];
  treeData.forEach((x) => {
    if (x.children && x.children.length) {
      let newNode = { id: x.id, name: x.name };
      let filterChildren = filterTree(word, x.children);
      if (filterChildren.length > 0) {
        newNode.children = filterChildren;
        result.push(newNode);
        return;
      }
    }
    if (x.name.includes(word)) result.push(x);
  });
  return result;
};

let treeForEach = (treeData, callback) => {
  treeData.forEach((x) => {
    callback(x);
    if (x.children) {
      treeForEach(x.children, callback);
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
  let [filterKeyword, setFilterKeyword] = React.useState("");
  let [expandedNodes, setExpandedNodes] = React.useState([]);

  data = React.useMemo(() => {
    if (!isFilterable) return data;

    if (!filterKeyword) {
      setExpandedNodes([]);
      return data;
    }

    let filterResult = filterTree(filterKeyword, data);

    // Expand the filtered nodes (the ones with children).
    treeForEach(filterResult, (node) =>
      setExpandedNodes((ps) => [...ps, node.id])
    );

    return filterResult;
  }, [filterKeyword, data, isFilterable]);

  if (isCheckable && (!onCheckChange || !checkedNodes)) {
    console.error("Checkable tree must be used in controlled mode.");
    return null;
  }

  let onCheckNode = (id, value) => {
    onCheckChange &&
      onCheckChange(addOrRemoveItemFromArray(id, value, checkedNodes));
  };

  let onExpandNode = (id, value) => {
    setExpandedNodes(addOrRemoveItemFromArray(id, value, expandedNodes));
  };
  return (
    <div style={{ padding: 20, display: "inline-block", ...style }}>
      {isFilterable && (
        <FilterInputStyled
          placeholder="Filter value"
          value={filterKeyword}
          onChange={(e) => {
            setFilterKeyword(e.target.value);
          }}
        />
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
