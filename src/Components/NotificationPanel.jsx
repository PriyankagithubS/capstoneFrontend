import React, { Fragment, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useGetNotificationQuery, useMarkNotiAsReadMutation } from "../redux/slices/api/userApiSlice";
import { ViewNotification } from "./ViewNotification";

const ICONS = {
    alert: <HiBellAlert className='h-5 w-5 text-gray-600' />,
    message: <BiSolidMessageRounded className='h-5 w-5 text-gray-600' />,
};

const NotificationPanel = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const { data: notifications = [], isLoading, isError, refetch } = useGetNotificationQuery();



    const [markAsRead] = useMarkNotiAsReadMutation();

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading notifications</div>;

    const readHandler = async (type, id) => {
        try {
            await markAsRead({ type, id }).unwrap();
            refetch();
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    const viewHandler = (el) => {
        console.log("Clicked Notification:", el);
        setSelected(el);
        setOpen(true);
        readHandler("one", el._id);
    };

    const callsToAction = [
        {
            name: "Mark All Read",
            href: "#",
            onClick: () => readHandler("all", ""),
        },
    ];

    return (
        <>
            <Popover className='relative'>
                <Popover.Button className='inline-flex items-center outline-none'>
                    <div className='w-8 h-8 flex items-center justify-center text-gray-800 relative'>
                        <IoIosNotificationsOutline className='text-2xl' />
                        {notifications.length > 0 && (
                            <span className='absolute top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600'>
                                {notifications.length}
                            </span>
                        )}
                    </div>
                </Popover.Button>

                <Transition
                    as={Fragment}
                    enter='transition ease-out duration-200'
                    enterFrom='opacity-0 translate-y-1'
                    enterTo='opacity-100 translate-y-0'
                    leave='transition ease-in duration-150'
                    leaveFrom='opacity-100 translate-y-0'
                    leaveTo='opacity-0 translate-y-1'
                >
                    <Popover.Panel className='absolute right-0 z-10 mt-2 w-screen max-w-md px-4'>
                        {notifications.length > 0 ? (
                            <div className='overflow-hidden rounded-3xl bg-white shadow-lg'>
                                <div className='p-4'>
                                    {notifications.slice(0, 5).map((item) => (
                                        <div
                                            key={item._id}
                                            className='group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50 cursor-pointer'
                                            onClick={() => viewHandler(item)}
                                        >
                                            <div className='h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200'>
                                                {ICONS[item.notiType]}
                                            </div>
                                            <div>
                                                <p className='font-semibold text-gray-900 capitalize'>
                                                    {item.notiType}
                                                </p>
                                                <p className='mt-1 text-gray-600'>
                                                    {item.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='grid grid-cols-2 divide-x bg-gray-50'>
                                    {callsToAction.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            onClick={item.onClick}
                                            className='flex items-center justify-center gap-x-2.5 p-3 font-semibold text-violet-600 hover:bg-gray-100'
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className='p-4'>No notifications</div>
                        )}
                    </Popover.Panel>
                </Transition>
            </Popover>
            <ViewNotification open={open} setOpen={setOpen} el={selected} />
        </>
    );
};

export default NotificationPanel;
