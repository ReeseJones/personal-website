import * as React from "react"
import {Footer} from "./footer";
import {Header} from "./header";
import "../styles.scss";


export const Layout: React.FC = (props) => {
    return <>
        <Header/>
            {props.children}
        <Footer/>
    </>
}