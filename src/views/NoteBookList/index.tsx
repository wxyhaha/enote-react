import './index.scss'
import React, {useEffect, useState} from "react";
import noteBook from "../../api/noteBook";
import {Empty, Button, Popconfirm, Modal, Input, message} from "antd";
import {PlusOutlined} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";

const NoteBookList: React.FC = () => {
    const [noteBookList, setNoteBookList] = useState([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [addInputValue, setAddInputValue] = useState('')
    const [editInputValue, setEditInputValue] = useState('')
    const [editItemId, setEditItemId] = useState(0)

    const navigate = useNavigate();

    useEffect(() => {
        getAllNoteBook()
    }, []);

    const getAllNoteBook = () => {
        noteBook.getAll().then((res) => {
            setNoteBookList(res.data)
        })
    }

    const handleEditNoteBook = (e, noteBookTitle: string, noteBookId: number) => {
        stopPropagationFun(e)
        setIsEditModalOpen(true)
        setEditInputValue(noteBookTitle)
        setEditItemId(noteBookId)
    }

    const handleSubmitAdd = () => {
        noteBook.addNotebook({title: addInputValue}).then((res) => {
            message.success(res.msg)
            getAllNoteBook()
            setIsAddModalOpen(false)
            setAddInputValue('')
        })
    }

    const handleSubmitEdit = () => {
        noteBook.updateNotebook(editItemId, {title: editInputValue}).then((res) => {
            message.success(res.msg)
            getAllNoteBook()
            setIsEditModalOpen(false)
            setEditInputValue('')
        })
    }

    const handleDeleteNoteBook = (e, noteBookId: number) => {
        stopPropagationFun(e)
        noteBook.deleteNotebook(noteBookId).then((res) => {
            message.success(res.msg)
            getAllNoteBook()
        })
    }

    const stopPropagationFun = (e) => {
        e.stopPropagation()
    }

    return (
        <div className='noteBookListWrapper'>
            <div className="NoteBookHeaderWrapper">
                <Button type="primary" icon={<PlusOutlined/>} size='small' onClick={() => setIsAddModalOpen(true)}>
                    新建笔记本
                </Button>
            </div>
            <div className="noteBookListContainer">
                <div>笔记本列表({noteBookList.length})</div>
                <div className="noteBookListContent">
                    {noteBookList.length > 0 ?
                        noteBookList.map(c =>
                            <div>
                                <div key={c.id} className='noteBookItem' onClick={() => navigate('/mainPage', {state: {noteBookId: c.id}})}>
                                    <div className='noteBookTitle'>
                                        <i className="iconfont icon-noteBook"/>
                                        {c.title}
                                        <div style={{fontSize: '12px', color: '#b3c0d4', marginLeft: '5px'}}>
                                            {c.noteCounts}
                                        </div>
                                    </div>
                                    <div className='actionButton'>
                                        <div>{c.updatedAtFriendly}</div>
                                        <div onClick={(e) => handleEditNoteBook(e, c.title, c.id)}>编辑</div>
                                        <Popconfirm onPopupClick={(e) => stopPropagationFun(e)}
                                                    onCancel={(e) => stopPropagationFun(e)}
                                                    onConfirm={(e) => handleDeleteNoteBook(e, c.id)} title="删除笔记本"
                                                    description="确认删除此笔记本吗？" okText="确认" cancelText="取消">
                                            <div onClick={(e) => stopPropagationFun(e)}>删除</div>
                                        </Popconfirm>
                                    </div>
                                </div>
                            </div>
                        )
                        : <Empty style={{marginTop: '20px'}} description='暂无笔记内容'/>
                    }
                </div>
            </div>
            <Modal title="创建笔记本" open={isAddModalOpen} onOk={handleSubmitAdd} onCancel={() => setIsAddModalOpen(false)} okText="确认" cancelText="取消">
                <div style={{margin: '10px 0'}}>请输入笔记本名称：</div>
                <Input value={addInputValue} onChange={(e) => setAddInputValue(e.target.value)}/>
            </Modal>
            <Modal title="修改笔记本" open={isEditModalOpen} onOk={handleSubmitEdit} onCancel={() => setIsEditModalOpen(false)} okText="确认" cancelText="取消">
                <div style={{margin: '10px 0'}}>请输入新笔记本名称：</div>
                <Input value={editInputValue} onChange={(e) => setEditInputValue(e.target.value)}/>
            </Modal>
        </div>
    )
}

export default NoteBookList