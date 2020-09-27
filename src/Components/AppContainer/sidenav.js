import React from 'react';
import { NavLink } from "react-router-dom";
import dummy from "../../Images/dummy.png";
import icon_templates from "../../Images/icon_templates.png";
import icon_process from "../../Images/icon_process.png"
import icon_settings from "../../Images/icon_settings.png";

function SideNav() {
  return (
    <div className="sidenav_section card">
        <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <NavLink className="nav-link" to="/app/templates" >
                <img src={icon_templates} alt="Icon" />
                <span>Models</span>
            </NavLink>
            <NavLink className="nav-link" id="v-pills-process-tab" to="/app/processes">
                <img src={icon_process} alt="Icon" />
                <span>Process</span>
            </NavLink> 
            <NavLink className="nav-link" id="v-pills-settings-tab" to="/app/settings">
                <img src={icon_settings} alt="Icon" />
                <span>Settings</span>
            </NavLink>
        </div>
        <div className="sidenav_header text-center">
            <div className="profile_image">
                <img src={dummy} alt="Profile" />
            </div>
            <h5 className="profile_name">Paresh Jinjala</h5>
            <span className="profile_email">paresh123@gmail.com</span>
        </div>
    </div>                    
  );
}

export default SideNav;
