import {
    HashRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import './App.scss'
import LoginPage from './views/LoginPage/index'
import Layout from './views/Layout/index'
import NoteDetail from "./views/NoteDetail/index";
import NoteBookList from "./views/NoteBookList/index";

function App() {
    return (
        <div className='pageWrapper'>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                </Routes>
                <Routes>
                    <Route path="/mainPage" element={<Layout/>}>
                        <Route index element={<NoteDetail/>}/>
                        <Route path='noteBookList' element={<NoteBookList/>}/>
                    </Route>
                </Routes>
            </Router>
        </div>
    )
}

export default App
