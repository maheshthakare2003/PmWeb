import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import axios from "axios";
import toast from "react-hot-toast";
import TaskModal from "./TaskModal";
import AppLayout2 from "./AppLayout2";
import ProjectDropdown from "./ProjectDropdown";
import { useParams } from "react-router-dom";


function Task() {
  const [columns, setColumns] = useState({});
  const [isRenderChange, setRenderChange] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    isOpen: false,
    id: null,
    isProjectDetails: false,
  });
  const [title, setTitle] = useState('');
  const { projectId } = useParams();

  useEffect(() => {
    fetchTasks();
  }, [projectId, isRenderChange]);

  const fetchTasks = () => {
    axios
      .get(`http://localhost:5000/project/getTasks/${projectId}`)
      .then((res) => {
        setTitle(res.data.data.title);
        const updatedColumns = {
          ['requested']: {
            name: 'Requested',
            items: res.data.data.tasks
              .filter((task) => task.status === 'Requested')
              .map((task) => ({
                _id: task._id,
                title: task.title,
              })),
          },
          ['todo']: {
            name: 'To Do',
            items: res.data.data.tasks
              .filter((task) => task.status === 'To Do')
              .map((task) => ({
                _id: task._id,
                title: task.title,
              })),
          },
          ['inProgress']: {
            name: 'In Progress',
            items: res.data.data.tasks
              .filter((task) => task.status === 'In Progress')
              .map((task) => ({
                _id: task._id,
                title: task.title,
              })),
          },
          ['done']: {
            name: 'Done',
            items: res.data.data.tasks
              .filter((task) => task.status === 'Done')
              .map((task) => ({
                _id: task._id,
                title: task.title,
              })),
          },
        };
        setColumns(updatedColumns);
        setRenderChange(false);
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  const updateTaskStatus = (taskId, status) => {
    axios
      .patch(`http://localhost:5000/task/updateTaskStatus/${taskId}`, {
        status,
      })
      .then((res) => {
        setRenderChange(true);
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  const deleteTask = (taskId) => {
    axios
      .delete(`http://localhost:9000/project/${projectId}/task/${taskId}`)
      .then((res) => {
        toast.success('Task deleted successfully');
        setRenderChange(true);
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  const handleShowDetails = () => {
    setModalData({
      isOpen: true,
      id: { projectId },
      isProjectDetails: true,
    });
  };

  const handleTaskDetails = (taskId) => {
    setModalData({
      isOpen: true,
      id: { id: taskId },
      isProjectDetails: false,
    });
  };

  const closeModal = () => {
    setModalData({
      isOpen: false,
      id: null,
      isProjectDetails: false,
    });
  };

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId];

    if (sourceColumn.name === 'Done' && destination.droppableId !== source.droppableId) {
      return;
    }

    const copiedColumns = { ...columns };
    const sourceItems = [...copiedColumns[source.droppableId].items];
    const destItems = [...copiedColumns[destination.droppableId].items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    copiedColumns[source.droppableId] = {
      ...copiedColumns[source.droppableId],
      items: sourceItems,
    };
    copiedColumns[destination.droppableId] = {
      ...copiedColumns[destination.droppableId],
      items: destItems,
    };

    setColumns(copiedColumns);
    updateTaskStatus(removed._id, destination.droppableId.toLowerCase());
  };

  return (
    <AppLayout2>
      <div className="px-12 py-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl text-gray-800 flex justify-start items-center space-x-2.5">
            <span>{title}</span>
            <ProjectDropdown id={projectId} />
          </h1>
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded"
            onClick={handleShowDetails}
          >
            Show Details
          </button>
        </div>
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          <div className="flex gap-5">
            {Object.entries(columns).map(([columnId, column]) => {
              return (
                <div className="w-3/12 h-[580px]" key={columnId}>
                  <div className="pb-2.5 w-full flex justify-between">
                    <div className="inline-flex items-center space-x-2">
                      <h2 className="text-[#1e293b] font-medium text-sm uppercase leading-3">
                        {column.name}
                      </h2>
                      <span
                        className={`h-5 inline-flex items-center justify-center px-2 mb-[2px] leading-none rounded-full text-xs font-semibold text-gray-500 border border-gray-300 ${
                          column.items.length < 1 && 'invisible'
                        }`}
                      >
                        {column.items?.length}
                      </span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      width={15}
                      className="text-[#9ba8bc]"
                      viewBox="0 0 448 512"
                    >
                      <path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z" />
                    </svg>
                  </div>
                  <div>
                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`min-h-[530px] pt-4 duration-75 transition-colors border-t-2 border-indigo-400 ${
                              snapshot.isDraggingOver && 'border-indigo-600'
                            }`}
                          >
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item._id}
                                  draggableId={item._id}
                                  index={index}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          ...provided.draggableProps.style,
                                        }}
                                        onClick={() => handleTaskDetails(item._id)}
                                        className={`select-none px-3.5 pt-3.5 pb-2.5 mb-2 border border-gray-200 rounded-lg shadow-sm bg-white relative ${
                                          snapshot.isDragging && 'shadow-md'
                                        }`}
                                      >
                                        <div className="pb-2">
                                          <div className="flex item-center justify-between">
                                            <h3 className="text-[#1e293b] font-medium text-sm capitalize">
                                              {item.title}
                                            </h3>
                                          </div>
                                          <span className="py-1 px-2.5 bg-indigo-100 text-indigo-600 rounded-md text-xs font-medium mt-1 inline-block">
                                            Task-{item.index}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </div>
        </DragDropContext>
        <TaskModal
          isOpen={modalData.isOpen}
          setIsOpen={closeModal}
          id={modalData.id}
          isProjectDetails={modalData.isProjectDetails}
        />
      </div>
    </AppLayout2>
  );
}

export default Task;
