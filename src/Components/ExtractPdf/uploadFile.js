import React, { useState } from "react";
import create_process from "../../Images/create_process.png";
import "./index.css";
import axios from "axios"

function UploadFile(props){

    const [templateName, setTemplateName] = useState("");
    const [templatePath, setTemplatePath] = useState("");
    const [file, setFile] = useState("");
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [ success, setSuccess] =  useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(success){
            props.history.push(`/extract/fields/${templatePath}`)
        }
        if(!templateName){
            alert("please give template name")
        }else{
            const formData =  new FormData();
        formData.append('pdf', file);
        formData.append('templatename', templateName);
        let headers = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        try{
            setLoading(true)
            let { data } = await axios.post('http://34.93.101.108:8004/api/v1/UploadFile/', formData, headers);
            setLoading(false);
            setSuccess(true);
            setTemplatePath(data.templatename)
          }catch(e){
            setLoading(false)
            console.log("error ========>", e)
          }
        }
        
    }

    const handleChange = (e) => {
        if(e.target.name === "templateName") setTemplateName(e.target.value);
        if(e.target.name === "file"){
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    }
    
    return (
        <div className="main-content">
            <div className="top">
                <input type="text" id="inputId" name="templateName" placeholder="Enter Template Name" value={templateName} onChange={handleChange} />
            </div>
            <div className="file-container container">
                    <form className="my-form text-center">
                        <img src={create_process} alt="img" style={{width:"350px", margin:"20px"}}></img>
                        <div className="upload-icon">
                            <input
                                style={{ display: "none" }}
                                type="file"
                                id="fileElem"
                                name="file"
                                accept="application/pdf"
                                onChange={handleChange}
                            />
                            <label htmlFor="fileElem">
                                <i className="fas fa-file-upload "></i>
                            </label>
                        </div>
                        <div>
                            <p className="Files">
                                {
                                    fileName ?
                                    fileName :
                                    "Select any pdf for extraction"
                                }
                            </p>
                        </div>
                </form>
            </div>
            <div className="bottom text-center">
                    <button
                        style={{
                            color: "#ffffff",
                            border: "#02ce9d",
                            background: "#02ce9d",
                            boxShadow: "0 6px 10px 0 rgba(2, 206, 157, 0.33)",
                            marginRight: "10px"
                        }}
                        onClick={()=> props.history.push("/app/templates")}
                        >Cancel</button>
                    <button
                        style={{
                            color: "#ffffff",
                            border: "#02ce9d",
                            background: "#02ce9d",
                            boxShadow: "0 6px 10px 0 rgba(2, 206, 157, 0.33)"
                        }}
                        onClick={handleSubmit}
                        >{loading ? <i className="fas fa-circle-notch fa-spin"></i> : success ? "Next" : "Upload"}</button>
                </div>
        </div>
    )
}

//onClick={()=> props.history.push(`/extract/fields/${templateName}`)}

export default UploadFile;
