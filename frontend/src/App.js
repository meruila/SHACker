import React, { useState } from "react";
import {
    Routes,
    Route
} from "react-router-dom";
import AboutPage from "./pages/About";
import GlobalTheme from "./themes/GlobalTheme";
import { ThemeProvider } from "@emotion/react";
import { UserContext } from "./contexts/UserContext";

import CreateAdminPage from "./pages/CreateAdmin";
import Home from "./pages/Home";
import InitialStartup from "./pages/InitialStartup";
import SignIn from "./pages/Loginpage";
import Logs from "./pages/Logs"

import AddNewStudentRecordPage from "./pages/student-records/newRecord";
import ViewStudentRecords from './pages/student-records/viewRecords';
import EditStudentRecordPage from './pages/student-records/editRecord';

import EditProfilePage from "./pages/EditProfile";
import AddNewUserPage from "./pages/admin/users/addUsers";
import Private from "./PrivateRoute";
import Admin from "./AdminRoute"
import ChangePasswordPage from "./pages/ChangePassword";
import ManageUsers from "./pages/admin/viewUsers";
import UploadStudentRecord from "./pages/student-records/uploadRecord";

import SummaryPage from "./pages/Summary";

import ErrorPage from "./pages/ErrorPage";



/**
 * App.js of SHACker
 * Contains front-end routing
 */

function App() {
    const [ user, setUser ] = useState(null);
    
    return (
        <ThemeProvider theme={GlobalTheme}>
            <div className="App">
                <UserContext.Provider value={{user, setUser}}>
                    <Routes>
                        {/* For all user types */}
                        <Route exact path="/login" element={<SignIn />} />


            {/* For all user types; Must be logged in to access the pages */}
            <Route exact path="/edit-profile" element={<Private> <EditProfilePage /></Private>} />
            <Route exact path="/change-password" element={<Private> <ChangePasswordPage /></Private>} />
            <Route exact path="/about" element={<Private> <AboutPage /> </Private>} />
            <Route exact path="/home" element={<Private> <Home /> </Private>} />
            <Route exact path="/summary" element={<Private>< SummaryPage/></Private>} />
            <Route exact path="/student-records/new" element={<Private><AddNewStudentRecordPage /></Private>} />
            <Route exact path="/student-records/upload" element={<Private><UploadStudentRecord /></Private>} />
            <Route exact path="/student-records/:id" element={<Private><EditStudentRecordPage /></Private>} />
            <Route exact path="/student-records" element={<Private><ViewStudentRecords/></Private>} />
            <Route exact path="/logs" element={<Private><Logs /></Private>} />

            {/* For admin */}
            
            {/* For admin; Must be logged in to access the pages */}
            <Route exact path="/admin/users/add" element={<Private><Admin><AddNewUserPage /></Admin></Private>} />
            <Route exact path="/admin/users" element={<Private><Admin><ManageUsers/></Admin></Private>} />

            <Route exact path="/create-admin" element={<CreateAdminPage />} />
            {/* Start page when the app is first opened */}
            <Route exact path="/" element={<InitialStartup />} />


                        {/* 404 Page */}
                        <Route path="*" element={<ErrorPage/>} />
                    </Routes>
                </UserContext.Provider>
            </div>
        </ThemeProvider>
    );
}

export default App;