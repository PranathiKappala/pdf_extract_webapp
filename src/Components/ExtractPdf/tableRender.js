import React from "react";
import { Table } from "reactstrap";

function TableRender(props) {
  let values = props.values;
  const tableDataRendering = () => {
    let { tableData } = values;
    let maxLength = 0;
    let tableHeaders = [];
    try {
      tableData.forEach(item => {
        tableHeaders.push(item.fieldName);
        if (maxLength < item.fieldValues.length) {
          maxLength = item.fieldValues.length;
        }
      });
      let newA = [];
      let index = 0;
      while (index < maxLength) {
        let newObj = {};
        for (let i = 0; i < tableData.length; i++) {
          let { fieldName, fieldValues } = tableData[i];
          newObj[fieldName] = fieldValues[index] ? fieldValues[index] : "";
        }
        newA.push(newObj);
        index++;
      }
      return newA.map((obj, index) => {
        return (
          <tr key={index}>
            {tableHeaders.map((head, ind) => (
              <td className="text-center" key={ind}>
                {obj[head]}
              </td>
            ))}
          </tr>
        );
      });
    } catch (error) {
      console.log("Error in rendering table", error);
    }
  };

  const tableHeaders = () => {
    let { tableData } = values;
    return (
      <tr>
        {tableData.map((headers, i) => (
          <th key={i} className="text-center">
            {headers.fieldName}
          </th>
        ))}
      </tr>
    );
  };
  return (
    <Table>
      <thead>{tableHeaders()}</thead>
      <tbody>{tableDataRendering()}</tbody>
    </Table>
  );
}

export default TableRender;
