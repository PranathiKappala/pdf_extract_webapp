import React from "react";

const TableExtract = (props) => {
  let { values, onTableChange, onParams, onParameters } = props;

  const renderTable = () => {
    let options = [
      {
        name: "Table Endword",
        id: "tableendword",
        value: values.tableendword,
      },
      {
        name: "Differentiator Column",
        id: "differentiatorcolumn",
        value: values.differentiatorcolumn,
      },
      {
        name: "Word Previous",
        id: "wordprevious",
        value: values.wordprevious,
      },
    ];
    return (
      <div className="form-group">
        <label className="mt-2">Column Names</label>
        {values.parameters.map((param, ind) => (
          <div className="row mb-2" key={ind}>
            <div className="col-5">
              <input
                type="text"
                className="form-control inptId"
                name="key"
                key={ind}
                placeholder="key"
                value={param.key}
                onChange={(e) => onParameters(e, ind)}
              />
            </div>
            <label></label>
            <div className="col-5">
              <input
                type="number"
                className="form-control inptId"
                name="offset"
                key={ind}
                placeholder="offset"
                value={param.offset}
                onChange={(e) => onParameters(e, ind)}
              />
            </div>
            <div className="col-2">
              <button
                className="btn"
                style={{ width: "100%" }}
                onClick={(e) => onParams(e, ind)}
                disabled={param.disabled}
              >
                {ind === values.parameters.length - 1 ||
                values.parameters.length <= 1
                  ? "+"
                  : "X"}
              </button>
            </div>
          </div>
        ))}

        {options.map((option, index) => {
          return (
            <div className="form-group" key={index}>
              <label htmlFor={option.id} className="">
                {option.name}
              </label>
              <input
                type="text"
                className="form-control inptId"
                id={option.id}
                name={option.id}
                value={option.value}
                onChange={onTableChange}
              />
            </div>
          );
        })}
      </div>
    );
  };
  return renderTable();
};

export default TableExtract;
