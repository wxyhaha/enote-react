import './index.scss'
import React, {useEffect, useState} from "react";
import {Button, Empty, Popconfirm,message} from "antd";
import recycleBin from "../../api/recycleBin";
import noteBook from "../../api/noteBook";
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt();

const RecycleBin: React.FC=()=>{
    const [noteList,setNoteList]=useState([])
    const [selectedNoteObj,setSelectedNoteObj]=useState({})

    useEffect(()=>{
        getAllRecycleNote()
    },[])

    const getAllRecycleNote=()=>{
        noteBook.getAll().then((noteBookData)=>{
            const noteBookList=noteBookData.data
            recycleBin.getAll().then((recycleNoteData)=>{
                const recycleNoteList=recycleNoteData.data
                for(let i=0;i<recycleNoteList.length;i++){
                    const idx=noteBookList.findIndex(e=>e.id===recycleNoteList[i].notebookId)
                    if(idx!==-1){
                        recycleNoteList[i].noteBookTitle=noteBookList[idx].title
                    }
                }
                setNoteList(recycleNoteList)
                handleSelectItem(recycleNoteList[0])
            })
        })
    }

    const handleSelectItem=(item)=>{
        setSelectedNoteObj(item)
        const mdContentDom=document.getElementById('mdTextContent')
        if(mdContentDom){
            mdContentDom.innerHTML=md.render(item.content || '')
        }
    }

    const handleItem=(actionType)=>{
        recycleBin[actionType]({noteId:selectedNoteObj.id}).then((res)=>{
            message.success(res.msg)
            getAllRecycleNote()
        })
    }

    return (
        <div className='recyclePage-Wrapper'>
            <div className="recyclePage-noteSideBar">
                <div className="recyclePage-noteHeaderWrapper">
                    回收站
                </div>
                <div className="recyclePage-noteListWrapper">
                    <div className="recyclePage-noteListHead">
                        <div>更新时间</div>
                        <div>标题</div>
                    </div>
                    <div className='recyclePage-NoteListContent'>
                        {noteList.length > 0 ?
                            noteList.map(c =>
                                <div key={c.id}
                                     className={c.id === selectedNoteObj.id ? 'recyclePage-noteItem recyclePage-selectedNoteItem' : 'recyclePage-noteItem'}
                                     onClick={() => handleSelectItem(c)}>
                                    <div>{c.updatedAtFriendly}</div>
                                    <div>{c.title}</div>
                                </div>
                            )
                            : <Empty style={{marginTop: '20px'}} description='暂无笔记内容'/>
                        }
                    </div>
                </div>
            </div>
            <div className="recyclePage-noteDetailWrapper">
                <div className="recyclePage-noteDetailHead">
                    <div className="recyclePage-noteInfo">
                        <div>创建日期：{selectedNoteObj.createdAtFriendly}</div>
                        <div>更新日期：{selectedNoteObj.updatedAtFriendly}</div>
                        <div>所属笔记本：{selectedNoteObj.noteBookTitle}</div>
                    </div>
                    <div>
                        <Button size='small' style={{marginRight:'10px'}} onClick={()=>handleItem('revertNote')}>恢复</Button>
                        <Popconfirm title="删除笔记" description="确认删除此条笔记吗？" okText="确认" cancelText="取消" onConfirm={()=>handleItem('deleteNote')}>
                            <Button size='small'>彻底删除</Button>
                        </Popconfirm>
                    </div>
                </div>
                <div className="recyclePage-noteDetailContent">
                    <div className="recyclePage-noteTitle">
                        <span>{ selectedNoteObj.title }</span>
                    </div>
                    <div className="recyclePage-noteMainContent">
                        <div id='mdTextContent'/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecycleBin