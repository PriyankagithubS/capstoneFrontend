import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { toast } from "sonner";
import { useUpdateUserMutation } from "../redux/slices/api/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";

const AddUser = ({ open, setOpen, userData }) => {
    const defaultValues = userData ?? {};
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ defaultValues });

    const [addNewUser, { isLoading: isAdding }] = useRegisterMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const handleOnSubmit = async (data) => {
        try {
            if (userData) {
                // Update existing user
                const result = await updateUser({ ...userData, ...data }).unwrap();
                toast.success(result?.message);

                // Update credentials if the updated user is the current user
                if (userData._id === user._id) {
                    dispatch(setCredentials({ ...result.user }));
                }
            } else {
                await addNewUser({
                    ...data,
                    password: data.email, // Set password as email, consider revising for security
                }).unwrap();

                toast.success("New User added successfully");
            }

            reset(); // Reset the form fields
            setOpen(false); // Close the modal
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = error?.data?.message || "Something went wrong";
            toast.error(errorMessage);
        }
    };

    return (
        <ModalWrapper open={open} setOpen={setOpen}>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <Dialog.Title
                    as="h2"
                    className="text-base font-bold leading-6 text-gray-900 mb-4"
                >
                    {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
                </Dialog.Title>
                <div className="mt-2 flex flex-col gap-6">
                    <Textbox
                        placeholder="Full name"
                        type="text"
                        name="name"
                        label="Full Name"
                        className="w-full rounded"
                        register={register("name", {
                            required: "Full name is required!",
                        })}
                        error={errors.name ? errors.name.message : ""}
                    />
                    <Textbox
                        placeholder="Title"
                        type="text"
                        name="title"
                        label="Title"
                        className="w-full rounded"
                        register={register("title", {
                            required: "Title is required!",
                        })}
                        error={errors.title ? errors.title.message : ""}
                    />
                    <Textbox
                        placeholder="Email Address"
                        type="email"
                        name="email"
                        label="Email Address"
                        className="w-full rounded"
                        register={register("email", {
                            required: "Email Address is required!",
                        })}
                        error={errors.email ? errors.email.message : ""}
                    />
                    <Textbox
                        placeholder="Role"
                        type="text"
                        name="role"
                        label="Role"
                        className="w-full rounded"
                        register={register("role", {
                            required: "User role is required!",
                        })}
                        error={errors.role ? errors.role.message : ""}
                    />
                </div>

                {(isAdding || isUpdating) ? (
                    <div className="py-5">
                        <Loading />
                    </div>
                ) : (
                    <div className="py-3 mt-4 sm:flex sm:flex-row-reverse gap-2">
                        <Button
                            type="submit"
                            className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
                            label="Submit"
                        />
                        <Button
                            type="button"
                            className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto border"
                            onClick={() => setOpen(false)}
                            label="Cancel"
                        />
                    </div>
                )}
            </form>
        </ModalWrapper>
    );
};

export default AddUser;
