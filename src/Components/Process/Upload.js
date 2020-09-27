import React from 'react';
import axios from "axios";
import DropDownComponent from "./dropdowncomponent"

// import "./index.css"

class Upload extends React.Component{
    constructor(props){
      super(props)
      this.state = {
          voucher : "",
          fileData: "",
          fileCount: 0,
          invoiceData : [],
          invoiceName: "",
          name: "",
          loading : false
      }
    }

    handleChange = (evt) => {
        let {name} = evt.target;
        if(name === "uploadfile"){
            let newFile = new FormData();
            let uploadedFiles = evt.target.files;
            for (let i = 0; i < uploadedFiles.length; i++) {
                newFile.append("pdf",uploadedFiles[i]);
            };
            
            this.setState({ fileData: newFile, fileCount:uploadedFiles.length});
        } else {
            this.setState({ [name]: evt.target.value });
        }
    }

     handleTemChange = (e)=>{
        this.setState({name : e.target.value})
    }
    uploadFilesApi = async () => {
        let {invoiceName, fileData ,name} = this.state;
        if (invoiceName.trim() && fileData) {
            try{
              let options = {
                headers : {
                  "Content-Type":"multipart/form-data"
                },
                
              }
              fileData.append("name",name);
              fileData.append("ProcessName",invoiceName);              
              // UPDATE URL WITH VALID URL
              let { data } = await axios.post(`${process.env.REACT_APP_PYTHON_URL}/api/v1/UploadMultipleFile/`,fileData, options); 
              this.props.changePage();
            }catch(e){
              console.log(e)
            }
        } else {
            this.setState({loading:false });
            alert ("Please fill all the fields");
        }
    }

    handleSubmit = (e) => {
      e.preventDefault();
      this.setState({loading : true}, ()=>{this.uploadFilesApi()})
    }

    handleClear = ()=>{
      this.setState({
        voucher : "",
        fileData: "",
        fileCount: 0,
        invoiceData : [],
        invoiceName: "",
        loading : false
      })
    }

    render(){
        let { fileCount,name } = this.state;        
        return (
            <div className = "uploadMain">
            <div className = "uploadMainContainer">
                <div className = "uploadMain_subContainer">
                    <h5>Upload Documents</h5>
                    <div className = "form-group">
                       <label htmlFor = "invoiceName">Inovice Name</label>
                       <input type = "text"  className="form-control" name = "invoiceName" value = {this.state.invoiceName} onChange = {this.handleChange}/>
                   </div>
                   <DropDownComponent name={name} handleChange={this.handleTemChange}/>
                <div className = "SingleContainer">
                    <label>Upload Documents</label>
                    <div className = "SingleSubContainer">
                        <div className = "UploadIcon">
                            <i className = "fas fa-cloud-upload-alt fa-w-20 fa-3x" style = {{color:"dodgerblue"}} ></i>
                            <input type = "file" name = "uploadfile" id = "uploadFileId"
                                accept = ".pdf, .jpg, .png, .jpeg, .svg"
                                onChange = {this.handleChange} multiple/>
                        </div>
                        <div className = "inputSingleSubContainer">
                            <label htmlFor ="uploadFileId">
                                <p>Please upload your file/files</p>
                                <p>We support PDF, SVG, JPG, PNG file formats</p>
                            </label>
                        </div>
                    </div>
                    <div>
                        {fileCount ? <h5>{fileCount} file/files Uploaded </h5>: null}
                    </div>
                </div>
            </div>
            </div>
            <div className = "footer">
                <button style = {{marginRight: 10,background:"rgb(26, 63, 106)", color: "#ffffff"}}
                    className = "btn btn-preview"
                    onClick = {this.handleClear}> Clear
                </button>
                <button style = {{background:"rgb(26, 63, 106)",color:"#fff"}}
                    className = "btn btn-preview"
                    onClick = {this.handleSubmit}>
                    {this.state.loading ? <i className = "fas fa-circle-notch"></i> : "Submit" }
                </button>
            </div>
        </div>
        )
    }
}

export default Upload;