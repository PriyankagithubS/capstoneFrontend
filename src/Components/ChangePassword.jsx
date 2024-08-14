import React from "react";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Button from "./Button";
import { useForm } from "react-hook-form";
import Loading from "./Loader";
import Textbox from "./Textbox";
import { useChangePasswordMutation } from "../redux/slices/api/userApiSlice";
import { toast } from 'sonner';

const ChangePassword = ({ open, setOpen }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }, // Changed 'error' to 'errors'
    } = useForm(); // Added parentheses

    const [changeUserPassword, { isLoading }] = useChangePasswordMutation();

    const handleOnSubmit = async (data) => {
        if (data.password !== data.cpass) {
            toast.warning("Passwords don't match");
            return;
        }
        try {
            const res = await changeUserPassword(data).unwrap();
            toast.success("Password changed successfully"); // Updated success message

            setTimeout(() => {
                setOpen(false);
            }, 1500);
        } catch (err) {
            console.log(err);
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <ModalWrapper open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(handleOnSubmit)} className="">
                    <Dialog.Title
                        as="h2"
                        className="text-base font-bold leading-6 text-gray-900 mb-4"
                    >
                        Change Password
                    </Dialog.Title>
                    <div className="mt-2 flex flex-col gap-6">
                        <Textbox
                            placeholder="Enter new password"
                            type="password"
                            name="password"
                            register={register("password", {
                                required: "Password is required",
                            })}
                            label="New Password"
                            className="w-full rounded"
                            error={errors.password ? errors.password.message : " "}
                        />
                        <Textbox
                            placeholder="Confirm new password"
                            type="password"
                            name="cpass"
                            register={register("cpass", {
                                required: "Confirm password is required",
                            })}
                            label="Confirm New Password"
                            className="w-full rounded"
                            error={errors.cpass ? errors.cpass.message : " "}
                        />
                    </div>
                    {isLoading ? (
                        <div className="py-5">
                            <Loading />
                        </div>
                    ) : (
                        <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
                            <Button
                                type="submit"
                                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700"
                                label="Save"
                            />
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto border border-gray-300 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </ModalWrapper>
        </>
    );
};

export default ChangePassword;
