import React from 'react';
import dummy from "../../Images/dummy.png";
import icon_bell from "../../Images/icon_bell.png";
import logo from "../../Images/tf-logo.png";

function Navbar() {
  return (
    <div className="row header" style={{height:"10vh"}}>
		<div className="col-12 col-sm-12 header_box no_padding">
			<div className="container">
				<nav className="navbar navbar-light">
				    <div className="logo">
					    <img src={logo} alt="Logo" />
					</div>

				    <div className="logout_panel d-none d-md-block">
				    	<div className="bell_icon">
							<img src={icon_bell} alt="Icon" />
							<span></span>
				
				    	</div>
				    	<div className="profile_img">
					        <img src={dummy} alt="Profile" />
				    	</div>
				    </div>
				</nav>
			</div>
		</div>
    </div>
  );
}

export default Navbar;
