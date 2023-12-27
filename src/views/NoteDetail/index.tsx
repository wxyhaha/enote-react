import './index.scss'
import React, {useState, useEffect, useRef} from "react";
import {Select, Button, Empty, Input,Popconfirm, message} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import noteBook from "../../api/noteBook";
import note from "../../api/note";
import MarkdownIt from 'markdown-it'
import {useSyncCallback} from "../../helpers/tool";
import {useLocation} from "react-router-dom";

type selectedNoteObj = {
    id: number,
    title: string,
    content: string,
    notebookId: number,
    userId: number,
    isDelete: boolean,
    createdAt: string,
    updatedAt: string,
    createdAtFriendly: string,
    updatedAtFriendly: string
}

const {TextArea} = Input;
let timer = null
const md = new MarkdownIt();

const initialSelectedNoteObj={
    content: "",
    createdAt: "",
    createdAtFriendly: "",
    id: 0,
    isDelete: false,
    notebookId: 0,
    title: "",
    updatedAt: "",
    updatedAtFriendly: "",
    userId: 0
}

const NoteDetail: React.FC = () => {
    const [noteBookList, setNoteBookList] = useState([])
    const [defaultSelect, setDefaultSelect] = useState('')
    const [noteList, setNoteList] = useState([])
    const [selectedNoteObj, setSelectedNoteObj] = useState<selectedNoteObj>(initialSelectedNoteObj)
    const [statusText, setStatusText] = useState('笔记未改动')
    const [selectedNoteBookId, setSelectedNoteBookId] = useState('')
    const isNoteUpdate=useRef(false)
    const [isShowPreview,setIsShowPreview]=useState(false)

    const location=useLocation()

    const handleChangeNoteBook = (value: string) => {
        setSelectedNoteBookId(value)
        note.getAll({notebookId: value}).then((res) => {
            setNoteList(res.data)
            if(res.data.length>0){
                handleSelectNote(res.data[0])
            }else {
                setSelectedNoteObj(initialSelectedNoteObj)
            }
        })
    };

    const handleSelectNote = (noteObj: selectedNoteObj) => {
        setSelectedNoteObj(noteObj)
        setIsShowPreview(false)
    }
    useEffect(() => {
        noteBook.getAll().then((res) => {
            const list = []
            for (let i = 0; i < res.data.length; i++) {
                list.push({value: res.data[i].id, label: res.data[i].title})
            }
            setNoteBookList(list)
            if(location.state!==null){
                const item=list.find(e=>e.value===location.state.noteBookId)
                setDefaultSelect(item.label)
                handleChangeNoteBook(item.value)
            }else {
                setDefaultSelect(list[0].label)
                handleChangeNoteBook(list[0].value)
            }
        })
    }, []);

    useEffect(()=>{
        if(!isNoteUpdate.current) return
        upDateQuery()
    },[selectedNoteObj])
    
    const handleChangeNote = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setStatusText('输入中...')
        const { name, value } = e.target;
        setSelectedNoteObj((preValue) => ({ ...preValue, [name]: value }));
        isNoteUpdate.current=true
    }

    const switchMD=()=>{
        setIsShowPreview((oldValue)=>!oldValue)
        renderMDContent()
    }

    const renderMDContent=useSyncCallback(() => {
        if(!isShowPreview) return
        const mdContentDom=document.getElementById('mdTextContent')
            if(mdContentDom){
                mdContentDom.innerHTML=md.render(selectedNoteObj.content || '')
            }
    });

    const upDateQuery = () => {
        if (timer) {
            window.clearTimeout(timer)
        }
        timer = setTimeout(() => {
            note.updateNote({noteId: selectedNoteObj.id}, {title: selectedNoteObj.title, content: selectedNoteObj.content})
                .then(() => {
                    setStatusText('已保存')
                    note.getAll({notebookId: selectedNoteBookId}).then((res) => {
                        setNoteList(res.data)
                        isNoteUpdate.current=false
                    })
                }).catch(() => {
                setStatusText('出现错误')
            })
        }, 300)
    }

    const handleDeleteNote=()=>{
        note.deleteNote({noteId:selectedNoteObj.id}).then((res)=>{
            message.success(res.msg)
            handleChangeNoteBook(selectedNoteBookId)
        })
    }

    const handleAddNote=()=>{
        note.addNote({notebookId:selectedNoteBookId},{title:'新建笔记'}).then((res)=>{
            message.success(res.msg)
            handleChangeNoteBook(selectedNoteBookId)
        })
    }

    return (
        <div className='NoteDetailWrapper'>
            <div className="noteSideBar">
                <div className="noteHeaderWrapper">
                    <Select placeholder={defaultSelect} style={{width: 100}} onChange={handleChangeNoteBook} options={noteBookList}/>
                    <Button className='addNoteButton' type="primary" icon={<PlusOutlined/>} size='small' shape="circle"
                            title='添加笔记' onClick={handleAddNote}/>
                </div>
                <div className="noteListWrapper">
                    <div className="noteListHead">
                        <div>更新时间</div>
                        <div>标题</div>
                    </div>
                    <div className='NoteListContent'>
                        {noteList.length > 0 ?
                            noteList.map(c =>
                                <div key={c.id}
                                     className={c.id === selectedNoteObj.id ? 'noteItem selectedNoteItem' : 'noteItem'}
                                     onClick={() => handleSelectNote(c)}>
                                    <div>{c.updatedAtFriendly}</div>
                                    <div>{c.title}</div>
                                </div>
                            )
                            : <Empty style={{marginTop: '20px'}} description='暂无笔记内容'/>
                        }
                    </div>
                </div>
            </div>
            <div className="noteDetailWrapper">
                <div className="noteDetailHead">
                    <div className="noteInfo">
                        <div>创建日期：{selectedNoteObj.createdAtFriendly}</div>
                        <div>更新日期：{selectedNoteObj.updatedAtFriendly}</div>
                        <div>{statusText}</div>
                    </div>
                    <div className="noteButton">
                        <i className="iconfont icon-MD" style={{color:isShowPreview ? '#0872fa' : '#999999'}} onClick={switchMD}/>
                        <Popconfirm title="删除笔记" description="确认删除此条笔记吗？" okText="确认" cancelText="取消" onConfirm={handleDeleteNote}>
                            <i className="iconfont icon-delete"/>
                        </Popconfirm>
                    </div>
                </div>
                <div className="noteDetailContent">
                    <div className="noteTitle">
                        <Input value={selectedNoteObj.title} name='title' placeholder="输入标题" bordered={false} size="large"
                               onChange={handleChangeNote}/>
                    </div>
                    <div className="noteMainContent">
                        {!isShowPreview ?
                            <TextArea value={selectedNoteObj.content} name='content' onChange={handleChangeNote} autoSize={true} placeholder="输入内容，支持Markdown语法" bordered={false}/>
                            : <div id='mdTextContent'/>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoteDetail