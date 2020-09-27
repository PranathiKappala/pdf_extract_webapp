import React, { useState, useEffect } from "react";
// import invoice from "../../Images/invoice.png";
import FieldsModal from "./fieldsModal";
import PdfReader from "./pdfReader";
import axios from "axios";
import "./index.css";

function ExtractFields(props){

    const [fields, setFields] = useState([]);
    const [modal, setModal] = useState(false);
    const [field, setField] = useState({});
    const [templateName, setTemplateName] = useState("");
    const [loading, setLoading] = useState(false);

    const toggle = (bool) => {
        if(bool){
            setField({...field, filename : templateName})
            setModal(true)
        }else{
            setModal(false);
            setField({})
        }
    }

    const addField = (obj) => {
        let ind = fields.findIndex(field => field.fieldId === obj.fieldId);
        if(ind === -1) {
            setFields([...fields, obj])
        }else{
            let list = [...fields];
            list[ind] = obj;
            setFields(list);
        }
        toggle(false)
    }

    const handleDelete = (index) => {
        fields.splice(index, 1);
        setFields([...fields]);
    }

    const handleEdit = (index) => {
        let obj = fields[index];
        let {offsetLeft, offsetRight} = obj;
        let offsetRightVal = offsetRight ? "1": "0";
        let offsetLeftVal = offsetLeft ? "1": "0";
        obj = {...obj, offsetLeftVal, offsetRightVal}
        setField(obj);
        setModal(true);
    }

    useEffect(() => {
        let { templatename } = props.match.params;
        if(!templatename){
            props.history.push("/extract/upload");
        } else if(props.location.state){
            setTemplateName(templatename);
            setFields(props.location.state.FIELDS);
        }
        else {
            setTemplateName(templatename)
        }
    }, [props.history, props.match, props.location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let payload = {
            data : fields,
            templatename : templateName
        }
        let { status } = await axios.post('http://34.93.101.108:8004/api/v1/Template/', payload);
        if(status === 200){
            props.history.push("/app");
        }
        setLoading(false);
    }
   const handleCancel = () => {
       props.history.push("/app");
   }
    return(
        <div className="main-content">
            <div className="top">
                <label>{templateName.split(".")[0]}</label>
            </div>

            <div className="extract container-fluid">
                <div className="row justify-content-center">
                    <div className="fields-container col-5 mr-3">
                    {modal ? <FieldsModal modal={modal} toggle={toggle} field={field} addField={(obj) => addField(obj)}/> : 
                       <div style={{width:"100%",height:"100%"}}>
                        <div className="header">
                            <h5>Extract Fields</h5>
                            <button className="btn" onClick={()=>toggle(true)}>+</button>
                        </div>
                        <div className="content">
                            {fields.map((obj, index) =>
                                <div className="form-row m-2" key={index}>
                                    <div className="form-group col-10"><h5>{obj.label}</h5></div>
                                    <div className="form-group col-1 field-btns">
                                        <button onClick={() => handleDelete(index)}><i className="fas fa-trash-alt"></i></button>
                                    </div>
                                    <div className="form-group col-1 field-btns">
                                        <button onClick={() => handleEdit(index)}><i className="fas fa-edit"></i></button>
                                    </div>
                                </div>)}
                        </div>
                    </div>}
                    </div>
                    <div className="pdf-container col-6">
                            {/* <button className="btn" onClick={()=>toggle({})}>+</button> */}
                            {templateName ? <PdfReader filepath={templateName}/> : null }
                    </div>
                </div>
            </div>
            <div className="bottom text-center ">
                <button
                style={{
                    color: "#ffffff",
                    border: "#02ce9d",
                    background: "#02ce9d",
                    boxShadow: "0 6px 10px 0 rgba(2, 206, 157, 0.33)",
                    marginRight: "10px"
                }} onClick={handleCancel}
                >Cancel</button>
                <button
                style={{
                    color: "#ffffff",
                    border: "#02ce9d",
                    background: "#02ce9d",
                    boxShadow: "0 6px 10px 0 rgba(2, 206, 157, 0.33)"
                }}
                onClick={handleSubmit}
                >Submit</button>
            </div>
        </div>
    )
}

export default ExtractFields;
