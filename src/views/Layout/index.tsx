import './index.scss'
import {Outlet, useNavigate} from 'react-router-dom'
import React, {useState} from "react";
import {Avatar, message} from 'antd';
import Auth from "../../api/auth";

const Layout: React.FC = () => {
    const navigate = useNavigate();
    const [user] = useState(sessionStorage.getItem('userName').slice(0, 1).toUpperCase());
    const [selectedMenuItem,setSelectedMenuItem]=useState('/mainPage')

    const selectMenItem=(path:string)=>{
        setSelectedMenuItem(path)
        navigate(path)
    }

    const handleLogout=()=>{
        Auth.logout().then(res=>{
            if(res.msg==='注销成功'){
                sessionStorage.removeItem('userName')
                message.success('退出登录成功');
                navigate('/')
            }else {
                message.error(res.msg);
            }
        })
    }

    return (
        <div className='layoutWrapper'>
            <div className="leftMenu">
                <Avatar className='avatarWrapper' size="large">
                    <span className='avatarText'>{user}</span>
                </Avatar>
                <div className='menuItem' style={{backgroundColor: selectedMenuItem === '/mainPage' ? '#5e6266' : '#2c333c'}}
                     title='笔记' onClick={()=>selectMenItem('/mainPage')}>
                    <i className="iconfont icon-noteDetail"/>
                </div>
                <div className='menuItem' style={{backgroundColor: selectedMenuItem === '/mainPage/noteBookList' ? '#5e6266' : '#2c333c'}}
                     title='笔记本' onClick={() =>selectMenItem( '/mainPage/noteBookList')}>
                    <i className="iconfont icon-noteBook"/>
                </div>
                <div className='menuItem' style={{backgroundColor: selectedMenuItem === '/mainPage/recycleBin' ? '#5e6266' : '#2c333c'}}
                     title='回收站' onClick={() => selectMenItem( '/mainPage/recycleBin')}>
                    <i className="iconfont icon-recycleBin"/>
                </div>
                <div className='menuItem logoutButton' title='退出登录' onClick={handleLogout}>
                    <i className="iconfont icon-logout"/>
                </div>
            </div>
            <div className="rightContent">
                <Outlet/>
            </div>
        </div>
    )
}

export default Layout