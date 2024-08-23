import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../Components/Loader";
import Title from "../Components/Title";
import Button from "../Components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../Components/Tabs";
import TaskTitle from "../Components/TaskTitle";
import BoardView from "../Components/BoardView";
import Table from "../Components/Task/Table";
import AddTask from "../Components/Task/AddTask";
import { useGetAllTasksQuery } from "../redux/slices/api/taskApiSlice";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const params = useParams();
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  const status = params?.status || "";
  const token = localStorage.getItem("authToken"); // Example of fetching token from localStorage

  const { data, isLoading, error } = useGetAllTasksQuery({
    strQuery: status,
    isTrashed: "",
    search: "",
    token,
  });

  if (error) {
    console.error("Error fetching tasks:", error);
    return (
      <div className="py-10">
        <p className="text-red-500">Error loading tasks. Please try again later.</p>
      </div>
    );
  }

  return isLoading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : "PROJECTS"} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label='Create Project'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
            <TaskTitle label='To Do' className={TASK_TYPE.todo} />
            <TaskTitle
              label='In Progress'
              className={TASK_TYPE["in progress"]}
            />
            <TaskTitle label='Completed' className={TASK_TYPE.completed} />
          </div>
        )}
        {selected !== 1 ? (
          <BoardView tasks={data?.tasks || []} />
        ) : (
          <div className="w-full">
            <Table tasks={data?.tasks || []} />
          </div>
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
