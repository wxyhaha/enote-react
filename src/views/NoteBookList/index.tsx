import './index.scss'
import React, {useEffect, useState} from "react";
import noteBook from "../../api/noteBook";
import {Empty,Button} from "antd";
import { PlusOutlined } from '@ant-design/icons';

const NoteBookList: React.FC = () => {
    const [noteBookList, setNoteBookList] = useState([])

    useEffect(() => {
        noteBook.getAll().then((res) => {
            setNoteBookList(res.data)
        })
    }, []);

    return (
        <div className='noteBookListWrapper'>
            <div className="headerWrapper">
                <Button type="primary" icon={<PlusOutlined />} size='small'>
                    新建笔记本
                </Button>
            </div>
            <div className="noteBookListContainer">
                <div>笔记本列表({noteBookList.length})</div>
                <div className="noteBookListContent">
                    {noteBookList.length > 0 ?
                        noteBookList.map(c =>
                            <div key={c.id} className='noteBookItem'>
                                <div className='noteBookTitle'>
                                    <i className="iconfont icon-noteBook"/>
                                    {c.title}
                                    <div style={{fontSize:'12px',color:'#b3c0d4',marginLeft:'5px'}}>{c.noteCounts}</div>
                                </div>
                                <div className='actionButton'>
                                    <div>{c.updatedAtFriendly}</div>
                                    <div>编辑</div>
                                    <div>删除</div>
                                </div>

                            </div>
                        )
                        : <Empty style={{marginTop: '20px'}} description='暂无笔记内容'/>
                    }
                </div>
            </div>
        </div>
    )
}

export default NoteBookList