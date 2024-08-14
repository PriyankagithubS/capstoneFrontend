import React from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { Fragment, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'sonner';
import Sidebar from './Components/SideBar';
import Navbar from './Components/Navbar';
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { setOpenSidebar } from "./redux/slices/authSlice";
import Dashboard from './Pages/Dashboard';
import Task from './Pages/Task';
import User from './Pages/User';
import Trash from './Pages/Trash';
import TaskDetails from './Pages/TaskDetails';
import Login from './Pages/Login';

function Layout() {
    const { user } = useSelector((state) => state.auth)
    const location = useLocation();

    return user ? (
        <div className='w-full h-screen flex flex-col md:flex-row'>
            <div className='w-1/5 h-screen bg-white sticky top-0 hidden md:block'>
                <Sidebar />
            </div>

            <MobileSidebar />

            <div className='flex-1 overflow-y-auto'>
                <Navbar />

                <div className='p-4 2xl:px-10'>
                    <Outlet />  
                </div>
            </div>
        </div>
    ) : (
        <Navigate to='/log-in' state={{ from: location }} replace />
    );
}

const MobileSidebar = () => {
    const { isSidebarOpen } = useSelector((state) => state.auth);
    const mobileMenuRef = useRef(null);
    const dispatch = useDispatch();

    const closeSidebar = () => {
        dispatch(setOpenSidebar(false));
    };

    return (
        <Transition
            show={isSidebarOpen}
            as={Fragment}
            enter='transition-opacity duration-700'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity duration-700'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
        >
            <div
                ref={(node) => (mobileMenuRef.current = node)}
                className={clsx(
                    "md:hidden w-full h-full bg-black/40 transition-all duration-700 transform",
                    isSidebarOpen ? "translate-x-0" : "translate-x-full"
                )}
                onClick={closeSidebar}
            >
                <div className='bg-white w-3/4 h-full'>
                    <div className='w-full flex justify-end px-5 mt-5'>
                        <button onClick={closeSidebar} className='flex justify-end items-end'>
                            <IoClose size={25} />
                        </button>
                    </div>
                    <div className='-mt-10'>
                        <Sidebar />
                    </div>
                </div>
            </div>
        </Transition>
    );
};

const App = () => {
    return (
        <main className='w-full min-h-screen bg-[#f3f4f6]'>
            <Routes>
                <Route element={<Layout />}>
                    <Route index path='/' element={<Navigate to='/dashboard' />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/projects' element={<Task />} />
                    <Route path='/completed/:status' element={<Task />} />
                    <Route path='/in-progress/:status' element={<Task />} />
                    <Route path='/todo/:status' element={<Task />} />
                    <Route path='/team' element={<User />} />
                    <Route path='/trashed' element={<Trash />} />
                    <Route path='/task/:id' element={<TaskDetails />} />
                </Route>
                <Route path='/log-in' element={<Login />} />
            </Routes>
            <Toaster richColors />
        </main>
    );
};

export default App;
