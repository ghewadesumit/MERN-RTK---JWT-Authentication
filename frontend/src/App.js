import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';
import Login from './pages/Dave User Interface/DaveLogin';
import Register from './pages/Register';
import PersistLogin from './components/PersistLogin';
import Home from './pages/Dave User Interface/Home';
import Admin from './pages/Dave User Interface/Admin';
import Editor from './pages/Dave User Interface/Editor';
import Layout from './pages/Dave User Interface/Layout';
import Missing from './pages/Dave User Interface/Missing';
import Unauthorized from './pages/Dave User Interface/Unauthorized';
import LinkPage from './pages/Dave User Interface/LinkPage';
import Lounge from './pages/Dave User Interface/Lounge';
import RequireAuth from './pages/Dave User Interface/RequireAuth';

const ROLES = {
    User: 2001,
    Editor: 1984,
    Admin: 5150,
};
function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* public routes */}
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="linkpage" element={<LinkPage />} />
                    <Route path="unauthorized" element={<Unauthorized />} />

                    {/* we want to protect these routes */}
                    <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
                        <Route path="/" element={<Home />} />
                    </Route>

                    <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
                        <Route path="editor" element={<Editor />} />
                    </Route>

                    <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                        <Route path="admin" element={<Admin />} />
                    </Route>

                    <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
                        <Route path="lounge" element={<Lounge />} />
                    </Route>

                    {/* catch all */}
                    {/* <Route path="*" element={<Missing />} /> */}
                </Route>
            </Routes>

            {/* <ToastContainer /> */}
        </>
    );
}

export default App;
