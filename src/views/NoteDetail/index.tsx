import './index.scss'
import React, {useState, useEffect} from "react";
import {Select, Button, Empty, Input} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import noteBook from "../../api/noteBook";
import note from "../../api/note";

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

const NoteDetail: React.FC = () => {
    const [noteBookList, setNoteBookList] = useState([])
    const [defaultSelect, setDefaultSelect] = useState('')
    const [noteList, setNoteList] = useState([])
    const [selectedNoteObj, setSelectedNoteObj] = useState<selectedNoteObj>({
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
    })
    const [statusText, setStatusText] = useState('笔记未改动')
    const [noteTitle, setNoteTitle] = useState('')
    const [noteContent, setNoteContent] = useState('')
    const [selectedNoteBookId, setSelectedNoteBookId] = useState('')

    const handleChangeNoteBook = (value: string) => {
        setSelectedNoteBookId(value)
        note.getAll({notebookId: value}).then((res) => {
            setNoteList(res.data)
            handleSelectNote(res.data[0])
        })
    };

    const handleSelectNote = (noteObj: selectedNoteObj) => {
        setSelectedNoteObj(noteObj)
        setNoteTitle(noteObj.title)
        setNoteContent(noteObj.content)
    }
    useEffect(() => {
        noteBook.getAll().then((res) => {
            const list = []
            for (let i = 0; i < res.data.length; i++) {
                list.push({value: res.data[i].id, label: res.data[i].title})
            }
            setNoteBookList(list)
            setDefaultSelect(list[0].label)
            handleChangeNoteBook(list[0].value)
        })
    }, []);

    useEffect(()=>{
        upDateQuery()
    },[noteTitle,noteContent])
    
    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setStatusText('输入中...')
        setNoteTitle(e.target.value)
    }

    const handleChangeContent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setStatusText('输入中...')
        setNoteContent(e.target.value)
    }

    const upDateQuery = () => {
        if(noteTitle===selectedNoteObj.title && noteContent===selectedNoteObj.content) return
        if (timer) {
            window.clearTimeout(timer)
        }
        timer = setTimeout(() => {
            note.updateNote({noteId: selectedNoteObj.id}, {title: noteTitle, content: noteContent})
                .then(() => {
                    setStatusText('已保存')
                    note.getAll({notebookId: selectedNoteBookId}).then((res) => {
                        setNoteList(res.data)
                    })
                }).catch(() => {
                setStatusText('出现错误')
            })
        }, 300)
    }

    return (
        <div className='NoteDetailWrapper'>
            <div className="noteSideBar">
                <div className="headerWrapper">
                    <Select
                        placeholder={defaultSelect}
                        style={{width: 100}}
                        onChange={handleChangeNoteBook}
                        options={noteBookList}
                    />
                    <Button className='addNoteButton' type="primary" icon={<PlusOutlined/>} size='small' shape="circle"
                            title='添加笔记'/>
                </div>
                <div className="noteListWrapper">
                    <div className="noteListHead">
                        <div>更新时间</div>
                        <div>标题</div>
                    </div>
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
            <div className="noteDetailWrapper">
                <div className="noteDetailHead">
                    <div className="noteInfo">
                        <div>创建日期：{selectedNoteObj.createdAtFriendly}</div>
                        <div>更新日期：{selectedNoteObj.updatedAtFriendly}</div>
                        <div>{statusText}</div>
                    </div>
                    <div className="noteButton">
                        <i className="iconfont icon-MD"/>
                        <i className="iconfont icon-delete"/>
                    </div>
                </div>
                <div className="noteDetailContent">
                    <div className="noteTitle">
                        <Input value={noteTitle} placeholder="输入标题" bordered={false} size="large"
                               onChange={handleChangeTitle}/>
                    </div>
                    <div className="noteMainContent">
                        <TextArea value={noteContent} onChange={handleChangeContent} autoSize={true}
                                  placeholder="输入内容，支持Markdown语法" bordered={false}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoteDetail