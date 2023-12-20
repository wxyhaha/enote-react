import './index.scss'
import React ,{useState,useEffect}from "react";
import { Select ,Button, Empty } from 'antd';
import { PlusOutlined} from '@ant-design/icons';
import noteBook from "../../api/noteBook";
import note from "../../api/note";

const NoteDetail: React.FC=()=>{
    const [noteBookList,setNoteBookList]=useState([])
    const [defaultSelect,setDefaultSelect]=useState('')
    const [noteList,setNoteList]=useState([])
    const [selectedNoteId,setSelectedNoteId]=useState(null)

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
        note.getAll({notebookId:value}).then(res=>{
            console.log('555',res.data)
            setNoteList(res.data)
        })
    };

    const handleSelectNote=(noteId)=>{
        setSelectedNoteId(noteId)
    }
    useEffect(() => {
        console.log('执行一次')
        noteBook.getAll().then(res=>{
            const list=[]
            for(let i=0;i<res.data.length;i++){
                list.push({value:res.data[i].id,label:res.data[i].title})
            }
            setNoteBookList(list)
            setDefaultSelect(list[0].label)
            handleChange(list[0].value)
        })
    }, []);

    return (
        <div className='NoteDetailWrapper'>
            <div className="noteSideBar">
                <div className="headerWrapper">
                    <Select
                        placeholder={defaultSelect}
                        style={{ width: 100 }}
                        onChange={handleChange}
                        options={noteBookList}
                    />
                    <Button className='addNoteButton' type="primary" icon={<PlusOutlined />} size='small' shape="circle" title='添加笔记'/>
                </div>
                <div className="noteListWrapper">
                    <div className="noteListHead">
                        <div>更新时间</div>
                        <div>标题</div>
                    </div>
                    {noteList.length > 0 ?
                            noteList.map(c =>
                                <div key={c.id}
                                     className={c.id === selectedNoteId ? 'noteItem selectedNoteItem' : 'noteItem'}
                                     onClick={() => handleSelectNote(c.id)}>
                                    <div>{c.updatedAtFriendly}</div>
                                    <div>{c.title}</div>
                                </div>
                            )
                         : <Empty style={{marginTop:'20px'}} description='暂无笔记内容'/>
                    }
                </div>
            </div>
            <div className="noteDetailWrapper">

            </div>
        </div>
    )
}

export default NoteDetail