import React, { useState } from "react";
import { FaBug, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import clsx from "clsx";
import moment from "moment";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import Loading from "../Components/Loader";
import Button from "../Components/Button";
import { useGetSingleTaskQuery, usePostTaskActivityMutation } from "../redux/slices/api/taskApiSlice";

// Icons and styles
const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const tabsArray = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities/Timeline", icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  commented: (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
      <MdOutlineMessage />
    </div>
  ),
  started: (
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className="text-red-600">
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

// Activities Component
const Activities = ({ activity, id, refetch }) => {
  const [selected, setSelected] = useState(act_types[0]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [postActivity] = usePostTaskActivityMutation();

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      const activityData = {
        type: selected.toLowerCase(),
        activity: text,
      };
      await postActivity({ id, activityData }).unwrap();
      setText("");
      setSelected(act_types[0]);
      toast.success("Activity added successfully!");
      refetch(); // Assuming refetch is a function to refresh activities
    } catch (err) {
      console.error("Failed to submit activity:", err);
      toast.error(err?.data?.message || "Failed to submit activity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const Card = ({ item }) => (
    <div className="flex space-x-4 mb-4">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-10 h-10 flex items-center justify-center">
          {TASKTYPEICON[item?.type]}
        </div>
        <div className="w-full flex items-center">
          <div className="w-0.5 bg-gray-300 h-full"></div>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <p className="font-semibold text-gray-800">{item?.by?.name}</p>
        <div className="text-gray-500 space-y-1">
          <span className="capitalize">{item?.type}</span>
          <span className="text-sm">{moment(item?.date).fromNow()}</span>
        </div>
        <div className="text-gray-700">{item?.activity}</div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col md:flex-row gap-10 2xl:gap-20 min-h-screen px-8 py-6 bg-white shadow rounded-md overflow-y-auto">
      <div className="w-full md:w-2/3">
        <h4 className="text-gray-600 font-semibold text-lg mb-5">Activities</h4>

        <div className="w-full">
          {activity?.map((el, index) => (
            <Card key={index} item={el} />
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/3">
        <h4 className="text-gray-600 font-semibold text-lg mb-5">Add Activity</h4>
        <div className="w-full flex flex-col gap-5">
          {act_types.map((item) => (
            <div key={item} className="flex gap-2 items-center">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={selected === item}
                onChange={() => setSelected(item)}
                aria-label={`Select ${item} activity`}
              />
              <p>{item}</p>
            </div>
          ))}
          <textarea
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your comment here..."
            className="bg-white border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500 mt-4"
          ></textarea>
          {isLoading ? (
            <Loading />
          ) : (
            <Button
              type="button"
              label="Submit"
              onClick={handleSubmit}
              className="bg-blue-600 text-white rounded mt-2"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// TaskDetails Component
const TaskDetails = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetSingleTaskQuery(id);
  const [selected, setSelected] = useState(0);
  const [text, setText] = useState("");

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load task details.");
    return <div>Error loading task details.</div>;
  }

  const task = data?.task;

  return (
    <div className="w-full flex flex-col gap-4 mb-4 overflow-y-hidden">
      <h1 className="text-2xl text-gray-600 font-bold">{task?.title}</h1>

      <div className="flex gap-4 mb-4">
        {tabsArray.map((tab, index) => (
          <button
            key={index}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-md",
              selected === index ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            )}
            onClick={() => setSelected(index)}
          >
            {tab.icon}
            {tab.title}
          </button>
        ))}
      </div>

      {selected === 0 ? (
        <div className="w-full flex flex-col md:flex-row gap-8 bg-white shadow-md p-6 rounded-md overflow-y-auto">
          {/* LEFT */}
          <div className="w-full md:w-2/3 space-y-6">
            <div className="flex items-center gap-4">
              <div
                className={clsx(
                  "flex items-center gap-1 px-3 py-1 rounded-full text-base font-semibold",
                  PRIOTITYSTYELS[task?.priority],
                  bgColor[task?.priority]
                )}
              >
                <span className="text-lg">{ICONS[task?.priority]}</span>
                <span className="capitalize">{task?.priority} Priority</span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={clsx(
                    "w-4 h-4 rounded-full",
                    TASK_TYPE[task?.stage]
                  )}
                />
                <span className="text-black capitalize">{task?.stage}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="font-semibold">Task Type</span>
                <span className="text-gray-500 capitalize">{task?.taskType}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Reporter</span>
                <span className="text-gray-500 capitalize">{task?.reporter?.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Due Date</span>
                <span className="text-gray-500">{moment(task?.dueDate).format("MMMM DD, YYYY")}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Assignee</span>
                <span className="text-gray-500 capitalize">{task?.assignee?.name}</span>
              </div>
            </div>

            <div>
              <span className="font-semibold">Description</span>
              <p className="text-gray-500 mt-2">{task?.description}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <span className="font-semibold">Attachments</span>
            <div className="mt-2">
              {task?.attachments?.length > 0 ? (
                task?.attachments.map((attachment, index) => (
                  <div key={index} className="mt-2">
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {attachment.name}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No attachments</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Activities activity={task?.activities} id={id} refetch={() => { }} />
      )}
    </div>
  );
};

export default TaskDetails;
