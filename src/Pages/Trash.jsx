import clsx from "clsx";
import React, { useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import Title from "../Components/Title";
import Button from "../Components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import ConfirmatioDialog from "../Components/Dialogs";
import { useDeleteRestoreTaskMutation, useGetAllTasksQuery } from "../redux/slices/api/taskApiSlice";
import Loading from "../Components/Loader";
import { toast } from "sonner";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");

  const { data, isLoading } = useGetAllTasksQuery({
    strQuery: "",
    isTrashed: "true",
    search: "",
  });

  const [deleteRestoreTask] = useDeleteRestoreTaskMutation();

  const deleteRestoreHandler = async () => {
    try {
      let results;
      switch (type) {
        case "delete":
          results = await deleteRestoreTask({ id: selected, actionType: "delete", token }).unwrap();
          break;
        case "restore":
          results = await deleteRestoreTask({ id: selected, actionType: "restore", token }).unwrap();
          break;
        case "deleteAll":
          results = await deleteRestoreTask({ actionType: "deleteAll", token }).unwrap();
          break;
        case "restoreAll":
          results = await deleteRestoreTask({ actionType: "restoreAll", token }).unwrap();
          break;
        default:
          throw new Error("Invalid action type.");
      }
      toast.success(results?.message || "Operation successful.");
      setOpenDialog(false); // Close dialog after operation
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.message);
    }
  };




  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permanently delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    if (id) {
      setType("delete");
      setSelected(id);
      setMsg("Do you want to permanently delete the selected item?");
      setOpenDialog(true);
    } else {
      console.error("Task ID is missing for deletion.");
    }
  };

  const restoreClick = (id) => {
    if (id) {
      setSelected(id);
      setType("restore");
      setMsg("Do you want to restore the selected item?");
      setOpenDialog(true);
    } else {
      console.error("Task ID is missing for restoration.");
    }
  };

  if (isLoading) return <div className="py-10"><Loading /></div>;

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Stage</th>
        <th className='py-2 line-clamp-1'>Modified On</th>
        <th className='py-2'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[item?.stage] || 'bg-gray-200')}
          />
          <p className='w-full line-clamp-2 text-base text-black'>
            {item?.title || "N/A"}
          </p>
        </div>
      </td>

      <td className='py-2 capitalize'>
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority] || 'text-gray-500')}>
            {ICONS[item?.priority] || <MdKeyboardArrowDown />}
          </span>
          <span className=''>{item?.priority || "N/A"}</span>
        </div>
      </td>

      <td className='py-2 capitalize text-center md:text-start'>
        {item?.stage || "N/A"}
      </td>
      <td className='py-2 text-sm'>{item?.date ? new Date(item?.date).toDateString() : "N/A"}</td>

      <td className='py-2 flex gap-1 justify-end'>
        <Button
          icon={<MdOutlineRestore className='text-xl text-gray-500' />}
          onClick={() => restoreClick(item?._id)}
        />
        <Button
          icon={<MdDelete className='text-xl text-red-600' />}
          onClick={() => deleteClick(item?._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Trashed Tasks' />

          <div className='flex gap-2 md:gap-4 items-center'>
            <Button
              label='Restore All'
              icon={<MdOutlineRestore className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center text-black text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={restoreAllClick}
            />
            <Button
              label='Delete All'
              icon={<MdDelete className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={deleteAllClick}
            />
          </div>
        </div>
        <div className='bg-white px-2 md:px-6 py-4 shadow-md rounded'>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {data?.tasks?.map((tk) => (
                  <TableRow key={tk._id} item={tk} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={deleteRestoreHandler}
      />
    </>
  );
};

export default Trash;
