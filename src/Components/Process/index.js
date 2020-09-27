import React from 'react';
import Upload from "./Upload";
import axios from "axios";

import "./index.css";

class Process extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "invoices",
      invoices: [],
      dupInvoices: [],
      loading: false,
      colorCodes: ["#ff6200", "#0093ff", "#f7c700", "#00c2db", "#9d00ff", "#f2f5f6"],
      templatesearch: ""
    }
  }

  componentDidMount() {
    document.title = "Process | Techforce";
    this.getProcessedInvoices();
  }


  handleRefresh = () => {
    this.getProcessedInvoices();
  }

  getProcessedInvoices = async () => {
    try {
      let { data } = await axios.get(`${process.env.REACT_APP_PYTHON_URL}/api/v1/TemplateDetails/`)
      this.setState({ invoices: data, dupInvoices: data });
    } catch (error) {
      console.log(error);
    }
  }
  handleSearch = (e) => {
    let { invoices } = this.state
    this.setState({ templatesearch: e.target.value })
    let filteredTemplates = invoices.filter(template => {
      let re = e.target.value.replace(/\\/g, "\\\\");
      let reg = RegExp(re.toUpperCase())
      if (reg.test(template.processName.toUpperCase())) return true;
      else return false;
    })
    this.setState({ dupInvoices: filteredTemplates });
  }

  viewInvoice = (invoice) => {
    this.props.history.push({
      pathname: "/extract/viewInvoice",
      state: invoice
    });
  }

  renderInvoices() {
    let { loading, dupInvoices } = this.state;
    console.log(dupInvoices);

    if (loading) {
      return (<div className="text-center" style={{ marginTop: "50px" }}>
        <i className="fas fa-circle-notch"></i>
      </div>
      )
    }
    else if (dupInvoices.length) {
      return (
        <div className="table-responsive" style={{ maxHeight: "550px" }}>
          <table className="table table-hover" style={{ width: "95%", margin: "0px 30px" }}>
            <thead>
              <tr>
                <th>Invoice Name</th>
                <th>Date</th>
                <th>Invoices Count</th>
                <th>VIEW</th>
              </tr>
            </thead>
            <tbody>
              {dupInvoices.map((obj, index) => (
                <tr key={index}>
                  <td>
                    <span className="customer_circle_logo"
                      style={{ marginRight: "10px", padding: "8px", borderRadius: "50%", backgroundColor: this.state.colorCodes[index % (this.state.colorCodes.length - 1)] }}>
                      <b>{obj.processName.split(' ')[0][0] + (obj.processName.split(' ')[1] ? obj.processName.split(' ')[1][0] : '')}</b>
                    </span>
                    {obj.processName}
                  </td>
                  <td>{obj.date}</td>
                  <td>{obj.fileCount}</td>
                  <td>
                    <button style={{ width: "80px", height: "35px", borderRadius: "5px", border: "none", color: "#ffffff", background: "rgb(33, 56, 93)" }}
                      onClick={(e) => this.viewInvoice(obj)}>
                      VIEW
                        </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    } else {
      return (<div className="text-center" style={{ marginTop: "50px" }}>
        <p>No records found</p>
      </div>
      )
    }
  }

  headerComponent() {
    return (
      <div style={{ width: "100%", padding: "2%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 20, fontWeight: "500" }}>Processed Invoices</div>
        <div className="d-flex align-items-center">
          <div className="right_box">
            <input type="text" name="search" placeholder="Search" className="search_input" value={this.state.templatesearch} onChange={this.handleSearch} />
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <button className="btn btn-preview"
              style={{ marginRight: "10px", background: "rgb(26, 63, 106)", color: "#ffffff" }}
              onClick={this.handleRefresh}>
              Refresh
                  </button>

            <button name="uploadButton" className="btn btn-preview"
              style={{ padding: "10px", background: "#21385D", color: "#fff", display: "flex", width: "100px", alignItems: "center", justifyContent: "space-around", borderRadius: 10 }}
              onClick={() => this.setState({ page: "upload" })}>
              <i className="fas fa-upload"></i>
                      Upload
                  </button>
          </div>
        </div>
      </div>
    )
  }

  invoicesPage() {
    return (
      <div className="vocher-container">
        {this.headerComponent()}
        {this.renderInvoices()}
      </div>
    )
  }

  handlePageChange = () => {
    this.setState({
      page: "invoices"
    })
  }

  viewPage() {
    let { page } = this.state;
    switch (page) {
      case "upload":
        return <Upload changePage={this.handlePageChange} />

      default:
        return this.invoicesPage()
    }
  }

  render() {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        {this.viewPage()}
      </div>
    );
  }
}

export default Process;