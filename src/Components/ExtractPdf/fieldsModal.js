import React, { useState, useEffect } from "react";
// import './modal.css'
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import TableRender from "./tableRender";
import TableExtract from "./extractTable";

function FieldsModal(props) {
  let obj = {
    templatename: "",
    filename: "",
    fieldName: "",
    label: "",
    functionName: "0",
    occurrence: 1,
    extraword: "",
    sorting: "1",
    linecount: 1,
    offset: 100,
    offsetRight: false,
    offsetRightVal: "0",
    offsetLeftVal: "0",
    offsetLeft: false,
    offsetExact: null,
    columnnames: null,
    tableendword: "",
    differentiatorcolumn: "",
    wordprevious: "",
    offseteachitem: null,
    parameters: [{ key: "", offset: 0, disabled: true }],
    tableData: [],
    fieldValue: "",
    extracolumn: null,
    ...props.field,
  };

  if (!obj.fieldId) obj = { ...obj, fieldId: uuidv4() };

  let [values, setValues] = useState(obj);
  const [loading, setLoading] = useState(false);
  let [success, setSuccess] = useState(false);
  let [params, setParams] = useState(true);
  let [duplicatevalues, setDupValues] = useState(props.field);
  let [check, setCheck] = useState(false);
  let [tableCheck, setTableCheck] = useState(false);

  useEffect(async () => {
    let val = _.isEqual(
      _.omit(duplicatevalues, "occurance"),
      _.omit(values, "occurance")
    );
    if (val) {
      setSuccess(true);
      setCheck(true);
      setTableCheck(true);
    } else setSuccess(false);
  }, [duplicatevalues, values]);

  const handleChange = e => {
    let { name, value } = e.target;
    if (name === "functionName" && value === "extractTable") {
      var q = { ...values, [name]: value };
      setValues(q);
    } else if (name === "linecount") {
      let o = {};
      if (value > 0 || value === "") {
        if (value) {
          o = { ...values, linecount: parseInt(value) };
        } else {
          o = { ...values, linecount: value };
        }
        setValues(o);
      } else {
        alert("Please give linecount greater than 1");
      }
    } else if (name === "offset") {
      let p = {};
      if (value) {
        p = { ...values, offset: parseInt(value) };
      } else {
        p = { ...values, offset: value };
      }
      setValues(p);
    } else if (name === "offsetLeft") {
      let oL = { offsetLeftVal: value };
      let ofL = {};
      if (value === "1") {
        ofL = { ...values, ...oL, offsetLeft: true };
      } else {
        ofL = { ...values, ...oL, offsetLeft: false };
      }
      setValues(ofL);
    } else if (name === "offsetRight") {
      let oR = { offsetRightVal: value };
      let ofR = {};
      if (value === "1") {
        ofR = { ...values, ...oR, offsetRight: true };
      } else {
        ofR = { ...values, ...oR, offsetRight: false };
      }
      setValues(ofR);
    } else if (name === "occurrence") {
      let o = {};
      if (value > 0 || value === "") {
        if (value) {
          o = { ...values, occurrence: parseInt(value) };
        } else {
          o = { ...values, occurrence: value };
        }
        setValues(o);
      } else alert("Please give occurrence greater than 1");
    } else {
      let obj = { ...values, [name]: value };
      setValues(obj);
    }
  };

  const handleSubmit = e => {
    setLoading(true);
    props.addField({ ...values });
    setLoading(false);
  };

  const handleCheck = async () => {
    if (
      values.fieldName === "" ||
      values.linecount === "" ||
      values.occurrence === "" ||
      values.functionName === "0" ||
      values.label === ""
    ) {
      alert("Please fill all the fields");
    }
    // else if(values.linecount < 1){
    //   alert("please give linecount greater than 1")
    // }
    var result = {};
    let obj = { ...values };
    let columns = [];
    if (obj.functionName === "extractTable") {
      values.parameters.forEach((o, i) => {
        if (o.key.trim().length) {
          columns.push(o.key);
          result[o.key] = o.offset;
        }
      });
      obj.columnnames = columns;
      obj.offseteachitem = result;
      obj.offset = params;
      obj.offsetRight = null;
      obj.offsetLeft = null;
      obj.sorting = null;
      obj.occurrence = "none";
      if (obj.extracolumn) {
        obj.extracolumn = values.extracolumn;
      } else obj.extracolumn = null;
    } else if (obj.functionName === "getnextWord") {
      if (obj.sorting === "1") {
        obj.sorting = true;
      } else {
        obj.sorting = false;
      }
    } else {
      obj.sorting = null;
    }
    try {
      let headers = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      setLoading(true);
      let { data } = await axios.post(
        "http://34.93.101.108:8004/api/v1/ExtractFieldsFromPdf/",
        obj,
        headers
      );
      setCheck(true);
      setTableCheck(true);
      let tableData = data.data.tableData ? data.data.tableData : [];
      let updateObj = {
        ...values,
        ...obj,
        tableData,
        fieldValue: data.data,
      };
      setDupValues(updateObj);
      setLoading(false);
      setValues(updateObj);
    } catch (e) {
      console.log("err", e);
      setCheck(false);
      setSuccess(false);
      setLoading(false);
    }
  };
  const handleParameters = (e, index) => {
    let flowParams = values.parameters.map((param, ind) => {
      if (index === ind) {
        if (e.target.name === "offset") {
          if (e.target.value) {
            param.offset = parseInt(e.target.value);
          } else {
            param.offset = e.target.value;
          }
        } else {
          param[e.target.name] = e.target.value;
          if (e.target.name === "key") {
            param["disabled"] = false;
          }
        }
      }
      return param;
    });

    setValues({ ...values, parameters: flowParams });
  };

  const handleParams = (e, index) => {
    let flowParams = [...values.parameters];
    if (index === values.parameters.length - 1) {
      flowParams.push({ key: "", offset: 0, disabled: true });
    } else {
      flowParams.splice(index, 1);
    }
    setValues({ ...values, parameters: flowParams });
  };

  const handleTableChange = e => {
    if (e.target.name === "params") {
      setParams(true);
    }
    let obj = { ...values, [e.target.name]: e.target.value };
    setValues(obj);
  };

  let options = [
    {
      name: "Please select function type ...",
      value: "0",
    },
    {
      name: "Get Area Based Text",
      value: "getAreaBasedText",
    },
    {
      name: "Get Right Side Area Text",
      value: "getRightSideAreaText",
    },
    {
      name: "Extract Table",
      value: "extractTable",
    },
    {
      name: "Get Key Value",
      value: "getKeyValue",
    },
    {
      name: "Get Next Word",
      value: "getnextWord",
    },
    {
      name: "Get Previous Word",
      value: "getPrevWord",
    },
  ];

  return (
    <div style={{ height: "100%" }}>
      <div className="header">
        <h5>Extract Fields</h5>
        <button
          type="button"
          className="close"
          aria-label="Close"
          onClick={() => props.toggle()}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div
        className="modal-container"
        style={{ maxHeight: "87%", overflow: "auto", overflowX: "hidden" }}
      >
        <div className="form-group">
          <label htmlFor="staticName" className="">
            Field Name
          </label>
          <input
            type="text"
            className="form-control"
            id="staticName"
            name="fieldName"
            value={values.fieldName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="function" className="">
            Function Type
          </label>
          <select
            className="form-control"
            value={values.functionName}
            name="functionName"
            onChange={handleChange}
          >
            {options.map((opt, i) => {
              return (
                <option value={opt.value} key={i}>
                  {opt.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="labelName" className="">
            Label
          </label>
          <input
            type="text"
            className="form-control"
            id="labelName"
            name="label"
            value={values.label}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="extraword" className="">
            Extra word
            <span style={{ color: "grey" }}>
              (use comma to add multiple fields)
            </span>
          </label>
          <input
            type="text"
            className="form-control"
            id="extraword"
            name="extraword"
            value={values.extraword}
            onChange={handleChange}
          />
        </div>
        {values.functionName === "extractTable" ? (
          <div>
            <TableExtract
              values={values}
              onParameters={handleParameters}
              onParams={handleParams}
              onTableChange={handleTableChange}
            />
            {check ? (
              <div className="form-group table-box">
                <TableRender values={values} />
              </div>
            ) : null}
            {tableCheck ? (
              <div className="form-group">
                <label htmlFor="extracolumn" className="">
                  Extra Column{" "}
                  <span style={{ color: "grey" }}>
                    (use comma to add multiple columns)
                  </span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="extracolumn"
                  name="extracolumn"
                  value={values.extracolumn}
                  onChange={handleChange}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            {values.functionName === "getnextWord" ? (
              <div className="form-group">
                <div>
                  <label>Sorting</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sorting"
                    id="sorting1"
                    value="1"
                    checked={values.sorting === "1"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="sorting1">
                    True
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sorting"
                    id="inlineRadio2"
                    value="0"
                    checked={values.sorting === "0"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="inlineRadio2">
                    False
                  </label>
                </div>
              </div>
            ) : null}
            <div className="form-group">
              <label htmlFor="occurrence">Occurrence </label>
              <input
                type="number"
                min="1"
                name="occurrence"
                className="form-control"
                id="occurrence"
                value={values.occurrence}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="linecount">Line Count </label>
              <input
                type="number"
                min="1"
                name="linecount"
                className="form-control"
                id="linecount"
                value={values.linecount}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <div className="col-4">
                <div>
                  <label>Offset Left</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="offsetLeft"
                    id="inlineRadio1"
                    value="1"
                    checked={values.offsetLeftVal === "1"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="inlineRadio1">
                    True
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="offsetLeft"
                    id="inlineRadio2"
                    value="0"
                    checked={values.offsetLeftVal === "0"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="inlineRadio2">
                    False
                  </label>
                </div>
              </div>
              <div className="col-4">
                <div>
                  <label>Offset Right</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="offsetRight"
                    id="offsetRight1"
                    value="1"
                    checked={values.offsetRightVal === "1"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="offsetRight1">
                    True
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="offsetRight"
                    id="offsetRight2"
                    value="0"
                    checked={values.offsetRightVal === "0"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="offsetRight2">
                    False
                  </label>
                </div>
              </div>

              <div className="form-group col-3">
                <label htmlFor="offset">Offset </label>
                <input
                  type="number"
                  className="form-control"
                  id="offset"
                  name="offset"
                  value={values.offset}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="checkField">Check Field</label>
              <textarea
                name="checkField"
                className="form-control"
                id="checkField"
                value={check ? values.fieldValue : ""}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
        <div className="form-row form-btns">
          <button onClick={() => props.toggle()}>Cancel</button>
          <button onClick={handleCheck}>
            {loading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              "Check O/P"
            )}
          </button>
          <button disabled={!success} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default FieldsModal;
