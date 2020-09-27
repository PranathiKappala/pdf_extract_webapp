import React from "react"

class ExtractedData extends React.Component {

  changeTable = (index, e) => {
    this.props.handleUpdateTableData(index, e)
  }


  handleChangeValues = (data, e) => {
    this.props.handleUpdateNormalData(data, e);
  }

  tableHeaders = () => {
    try {
      let { tableData } = this.props.extractedData;
      let headers = [];
      tableData.map((item) => headers.push(item.fieldName));
      return headers.map((head, index) => {
        return (<th key={index}>{head}</th>);
      })
    } catch (error) {
      console.log("Error in rendering table headers", error);
    }
  }

  renderDataValues = () => {
    try {

      let { data } = this.props.extractedData;

      return data.map((data, index) => {
        return (
          <div key={index} className="col-md-6 fl-input">
            <label>{data.fieldName}</label>
            <input type="text" name={data.fieldName} value={data.fieldValue}
              onChange={(e) => this.handleChangeValues(data, e)} />
          </div>)
      })
    } catch (error) {
      console.log("Error in Rendering data values", error)
    }
  }

  tableBody = () => {
    let { tableData } = this.props.extractedData;
    let maxLength = 0;
    let tableHeaders = [];
    try {
      tableData.forEach((item) => {
        tableHeaders.push(item.fieldName);
        if (maxLength < item.fieldValue.length) {
          maxLength = item.fieldValue.length;
        }
      })
      let newA = [];
      let index = 0;
      while (index < maxLength) {
        let newObj = {};
        for (let i = 0; i < tableData.length; i++) {
          let { fieldName, fieldValue } = tableData[i];
          newObj[fieldName] = fieldValue[index] ? fieldValue[index] : "";
        }
        newA.push(newObj);
        index++;
      }
      return newA.map((obj, index) => {
        return <tr key={index}>
          {
            tableHeaders.map((head, ind) => <td className="text-center" key={ind}>
              <input type="text" name={head} value={obj[head]} onChange={(e) => { this.changeTable(index, e) }} />
            </td>
            )}
        </tr>
      })
    } catch (error) {
      console.log("Error in rendering table");
    }
  }

  render() {
    let { tableData, data } = this.props.extractedData;
    console.log(tableData, data)
    if (data && tableData) {
      return (
        <div className="file-edit bg-white">
          <div className="fl-title-block d-flex">
            <div className="fl-title">
              <h2>Extracted Value</h2>
            </div>
          </div>
          <div className="fl-edit-text fl-30">
            <div className="fl-scrollable">
              <div className="row">
                {this.renderDataValues()}
                <div className="col-md-12">
                  <table className="table fl-table">
                    <thead><tr>{this.tableHeaders()}</tr></thead>
                    <tbody>{this.tableBody()}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return <div>Loading</div>
    }
  }
}
export default ExtractedData;