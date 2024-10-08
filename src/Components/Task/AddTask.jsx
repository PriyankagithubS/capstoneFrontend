import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { app } from "../../utils/firebase";
import { useCreateTaskMutation, useUpdateTaskMutation } from "../../redux/slices/api/taskApiSlice";
import { toast } from "sonner";
import { dateFormatter } from "../../utils/index";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, task = {}, token }) => {
    const defaultValues = {
        title: task?.title || "",
        date: task?.date ? dateFormatter(task.date) : dateFormatter(new Date()),
        team: task?.team || [],
        stage: task?.stage?.toUpperCase() || LISTS[0],
        priority: task?.priority?.toUpperCase() || PRIORIRY[2],
        assets: task?.assets || [],
    };

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });
    const [team, setTeam] = useState(defaultValues.team);
    const [stage, setStage] = useState(defaultValues.stage);
    const [priority, setPriority] = useState(defaultValues.priority);
    const [assets, setAssets] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [createTask, { isLoading }] = useCreateTaskMutation();
    const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
    const URLS = task?.assets ? [...task.assets] : [];

    const handleSelect = (e) => {
        setAssets(e.target.files);
    };

    const uploadFile = async (file) => {
        const storage = getStorage(app);
        const name = new Date().getTime() + file.name;
        const storageRef = ref(storage, name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const submitHandler = async (data) => {
        try {
            setUploading(true);

            const uploadedFileURLs = assets.length
                ? await Promise.all(Array.from(assets).map((file) => uploadFile(file)))
                : [];

            setUploading(false);

            const stage = data.stage ? data.stage.toUpperCase() : LISTS[0];
            const priority = data.priority ? data.priority.toUpperCase() : PRIORIRY[2];

            console.log("Data to be sent:", {
                ...data,
                assets: [...URLS, ...uploadedFileURLs],
                team,
                stage,
                priority,
            });

            const response = task?._id
                ? await updateTask({ data: { ...data, _id: task._id }, token }).unwrap()
                : await createTask({ data: { ...data, assets: [...URLS, ...uploadedFileURLs], team, stage, priority }, token }).unwrap();

            toast.success(response.message);
            setTimeout(() => {
                setOpen(false);
            }, 500);
        } catch (error) {
            console.error("Error:", error);
            if (error?.data) {
                console.error("Error Data:", error.data);
                toast.error(error.data.message || "An unexpected error occurred.");
            } else {
                toast.error("An unexpected error occurred.");
            }
            setUploading(false);
        }
    };

    return (
        <ModalWrapper open={open} setOpen={setOpen}>
            <form onSubmit={handleSubmit(submitHandler)}>
                <Dialog.Title
                    as='h2'
                    className='text-base font-bold leading-6 text-gray-900 mb-4'
                >
                    {task ? "UPDATE TASK" : "ADD TASK"}
                </Dialog.Title>

                <div className='mt-2 flex flex-col gap-6'>
                    <Textbox
                        placeholder='Task Title'
                        type='text'
                        name='title'
                        label='Task Title'
                        className='w-full rounded'
                        register={register("title", { required: "Title is required" })}
                        error={errors.title ? errors.title.message : ""}
                    />

                    <UserList setTeam={setTeam} team={team} />

                    <div className='flex gap-4'>
                        <SelectList
                            label='Task Stage'
                            lists={LISTS}
                            selected={stage}
                            setSelected={setStage}
                        />

                        <div className='w-full'>
                            <Textbox
                                placeholder='Date'
                                type='date'
                                name='date'
                                label='Task Date'
                                className='w-full rounded'
                                register={register("date", {
                                    required: "Date is required!",
                                })}
                                error={errors.date ? errors.date.message : ""}
                            />
                        </div>
                    </div>

                    <div className='flex gap-4'>
                        <SelectList
                            label='Priority Level'
                            lists={PRIORIRY}
                            selected={priority}
                            setSelected={setPriority}
                        />

                        <div className='w-full flex items-center justify-center mt-4'>
                            <label
                                className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'
                                htmlFor='imgUpload'
                            >
                                <input
                                    type='file'
                                    className='hidden'
                                    id='imgUpload'
                                    onChange={(e) => handleSelect(e)}
                                    accept='.jpg, .png, .jpeg'
                                    multiple={true}
                                />
                                <BiImages />
                                <span>Add Assets</span>
                            </label>
                        </div>
                    </div>

                    <div className='bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4'>
                        {uploading ? (
                            <span className='text-sm py-2 text-red-500'>
                                Uploading assets...
                            </span>
                        ) : (
                            <Button
                                label='Submit'
                                type='submit'
                                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto'
                            />
                        )}

                        <Button
                            type='button'
                            className='bg-white px-8 text-sm font-semibold text-gray-900 hover:bg-gray-100'
                            label='Cancel'
                            onClick={() => setOpen(false)}
                        />
                    </div>
                </div>
            </form>
        </ModalWrapper>
    );
};

export default AddTask;
