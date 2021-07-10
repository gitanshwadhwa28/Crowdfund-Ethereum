import React from 'react'
import { Menu } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { Link } from '../routes'
const Header = () => {
    return (
        <nav className="navbar navbar-light" style={{ "background-color": "#e3f2fd", "height": "70px" }}>
            <div className="container-fluid">
                <Link route="/"><a className="navbar-brand" style={{ "fontSize": "25px" }}>Campaign</a></Link>
                <div className="d-flex" >
                    <Link route="/campaigns/create"><button className="btn btn-outline-success">Create Campaign</button></Link>
                </div>
            </div>
        </nav>
    )
}

export default Header;