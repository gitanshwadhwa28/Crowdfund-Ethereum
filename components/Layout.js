import React from 'react'
import Header from './Header'
import { Container } from 'semantic-ui-react'

const Layout = (props) => {
    return (
        <div>
            <Header />
            <div className="container" style={{ "padding-top": "60px" }}>
                {props.children}

            </div>
        </div>
    );
};

export default Layout;
