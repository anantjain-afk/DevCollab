// src/components/KanbanBoard.js
import React, {    useState , useEffect} from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Paper, Typography } from "@mui/material";
import { updateTaskStatus } from "../features/tasks/tasksSlice";
import {useDispatch} from 'react-redux'
// --- This is the Task Card component ---
// It's the small, draggable card
const TaskCard = ({ task, index , onClick}) => {
 

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Paper
          onClick={() => onClick(task)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={snapshot.isDragging ? 4 : 1} // Lifts the card when dragging
          sx={{
            cursor: 'pointer',
            p: 2,
            mb: 2,
            backgroundColor: snapshot.isDragging ? "grey.100" : "white",
            border: "1px solid #ddd",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography>{task.title}</Typography>
        </Paper>
      )}
    </Draggable>
  );
};

// --- This is the Column component ---
// It's the "To Do", "In Progress", or "Done" column
const Column = ({ title, tasks, droppableId , onTaskClick  }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        width: 300,
        minWidth: 300,
        mx: 1, // margin left/right
        backgroundColor: "#f4f7f9",
        border: "1px solid #eee",
      }}
    >
      <Typography variant="h6" sx={{ p: 2, textAlign: "center" }}>
        {title}
      </Typography>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              p: 2,
              minHeight: "500px", // Give it space to drop
              backgroundColor: snapshot.isDraggingOver
                ? "grey.200"
                : "transparent",
              transition: "background-color 0.2s ease",
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onClick={onTaskClick}/>
            ))}
            {/* This is a placeholder that keeps the space open */}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Paper>
  );
};

// --- This is the Main Kanban Board component ---
// src/components/KanbanBoard.js

// ... (TaskCard and Column components stay the same) ...


// --- This is the Main Kanban Board component ---
const KanbanBoard = ({ tasks , onTaskClick}) => {
  const dispatch = useDispatch();

  // 1. THIS IS THE NEW LOCAL STATE
  // We will manage the columns' state locally for instant UI updates.
  const [columns, setColumns] = useState({
    TO_DO: [],
    IN_PROGRESS: [],
    DONE: [],
  });

  // 2. THIS IS THE NEW useEffect
  // This hook syncs our local state with the Redux state (the 'tasks' prop)
  // It runs when the page loads and any time the 'tasks' prop changes
  useEffect(() => {
    setColumns({
      TO_DO: tasks.filter((task) => task.status === 'TO_DO'),
      IN_PROGRESS: tasks.filter((task) => task.status === 'IN_PROGRESS'),
      DONE: tasks.filter((task) => task.status === 'DONE'),
    });
  }, [tasks]); // The dependency array

  // 3. THIS IS THE NEW onDragEnd
  // It now handles BOTH re-ordering and status changes
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // 1. Check if dropped outside
    if (!destination) return;

    // 2. Check if dropped in the same spot
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // 3. Get the source column (where the card came from)
    const startColumn = columns[source.droppableId];
    // 4. Create a new, copied array of tasks for that column
    const newStartTasks = Array.from(startColumn);
    // 5. Remove the dragged task from that array
    const [draggedTask] = newStartTasks.splice(source.index, 1);


    // --- CASE 1: Re-ordering within the SAME column ---
    if (destination.droppableId === source.droppableId) {
      // 6. Insert the task into its new position in the *same* array
      newStartTasks.splice(destination.index, 0, draggedTask);

      // 7. Update our local component state
      setColumns({
        ...columns,
        [source.droppableId]: newStartTasks,
      });

      // NOTE: We could dispatch a new thunk here to save the order,
      // but for now, this optimistic update will work until refresh.
      return; // We're done
    }

    // --- CASE 2: Moving BETWEEN columns (A Status Change) ---

    // 6. Get the destination column's data
    const endColumn = columns[destination.droppableId];
    // 7. Create a new, copied array
    const newEndTasks = Array.from(endColumn);
    // 8. Insert the task into its new position
    newEndTasks.splice(destination.index, 0, draggedTask);

    // 9. Update our local component state *optimistically*
    setColumns({
      ...columns,
      [source.droppableId]: newStartTasks, // The old column (task removed)
      [destination.droppableId]: newEndTasks, // The new column (task added)
    });

    // 10. Dispatch the Redux action to tell the backend
    // We *still* use the old 'updateTaskStatus' thunk from the last step!
    dispatch(updateTaskStatus({
      taskId: draggableId,
      status: destination.droppableId,
      originalStatus: source.droppableId,
    }));
  };

  // 4. THE RENDER (It now reads from local state)
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, overflowX: 'auto', p: 1 }}>
        <Column title="To Do" tasks={columns.TO_DO} droppableId="TO_DO"  onTaskClick={onTaskClick}/>
        <Column title="In Progress" tasks={columns.IN_PROGRESS} droppableId="IN_PROGRESS" onTaskClick={onTaskClick} />
        <Column title="Done" tasks={columns.DONE} droppableId="DONE"  onTaskClick={onTaskClick}/>
      </Box>
    </DragDropContext>
  );
};

export default KanbanBoard;


