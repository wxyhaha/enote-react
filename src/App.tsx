import {
    HashRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import './App.scss'
import {LoginPage} from './views/LoginPage/index'
import {NoteBookPage} from './views/NoteBookPage/index'

function App() {
    return (
        <div className='pageWrapper'>
            <Router>
                <Routes>
                    <Route path="/loginPage" element={<LoginPage/>}/>
                </Routes>
                <Routes>
                    <Route path="/noteMainPage" element={<NoteBookPage/>}/>
                </Routes>
            </Router>
        </div>
    )
}

export default App
