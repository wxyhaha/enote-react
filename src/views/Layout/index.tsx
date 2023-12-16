import './index.scss'
import { Link, Outlet } from 'react-router-dom'
import React from "react";

const Layout:React.FC=()=>{
    return (
        <div className='layoutWrapper'>
            <div className="leftMenu">
                <Link to="/mainPage">笔记</Link>
                <br />
                <Link to="/mainPage/noteBookList">笔记本</Link>
            </div>
            <div className="rightContent">
                <Outlet/>
            </div>
        </div>
    )
}

export default Layout