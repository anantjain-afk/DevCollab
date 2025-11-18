// src/components/KanbanBoard.js
import React, { useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Paper, Typography } from "@mui/material";

// --- This is the Task Card component ---
// It's the small, draggable card
const TaskCard = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={snapshot.isDragging ? 4 : 1} // Lifts the card when dragging
          sx={{
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
const Column = ({ title, tasks, droppableId }) => {
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
              <TaskCard key={task.id} task={task} index={index} />
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
const KanbanBoard = ({ tasks }) => {
  // 1. RE-ORGANIZE THE DATA
  // Our 'tasks' prop is a single flat array.
  // We need to split it into 3 arrays, one for each column.
  // 'useMemo' makes this efficient, only re-calculating when 'tasks' changes.
  const columns = useMemo(() => {
    const toDo = tasks.filter((task) => task.status === "TO_DO");
    const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS");
    const done = tasks.filter((task) => task.status === "DONE");
    return { toDo, inProgress, done };
  }, [tasks]);

  // 2. THE DRAG-AND-DROP LOGIC (For next time!)
  // This is the function that will fire when we stop dragging a card.
  // For now, it does nothing, but we'll build this in the next step.
  const onDragEnd = () => {
    console.log("Drag ended");
    // We will put logic here in the next assignment!
  };

  // 3. RENDER THE BOARD
  return (
    // The DragDropContext is the main wrapper for the whole board
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 3,
          overflowX: "auto",
          p: 1,
        }}
      >
        <Column title="To Do" tasks={columns.toDo} droppableId="TO_DO" />
        <Column
          title="In Progress"
          tasks={columns.inProgress}
          droppableId="IN_PROGRESS"
        />
        <Column title="Done" tasks={columns.done} droppableId="DONE" />
      </Box>
    </DragDropContext>
  );
};

export default KanbanBoard;
