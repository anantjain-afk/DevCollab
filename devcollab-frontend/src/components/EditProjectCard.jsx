import React, { useState, useEffect } from "react";
import {
  Modal,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateProject } from "../features/projects/projectsSlice";

const EditProject = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const currentProject = useSelector((state) => state.projects.currentProject);
  const loading = useSelector((state) => state.projects.loading);
  const error = useSelector((state) => state.projects.error);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (open && currentProject) {
      setName(currentProject.name || "");
      setDescription(currentProject.description || "");
      setLocalError(null);
    }
    if (!open) {
      // reset local fields when closed
      setName("");
      setDescription("");
      setLocalError(null);
    }
  }, [open, currentProject]);

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 0,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          p: 4,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            color: "#2c3e50",
            mb: 2,
          }}
        >
          Edit Project
        </Typography>

        <Box
          component="form"
          sx={{ mt: 1 }}
          onSubmit={async (e) => {
            e.preventDefault();
            setLocalError(null);
            if (!currentProject) return setLocalError("No project selected");
            try {
              await dispatch(
                updateProject({
                  projectId: currentProject.id,
                  name,
                  description,
                })
              ).unwrap();
              onClose();
            } catch (err) {
              setLocalError(err || "Failed to update project");
            }
          }}
        >
          {localError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {localError}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Project Name"
            margin="normal"
            required
            fullWidth
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                },
              },
            }}
          />

          <TextField
            label="Project Description"
            margin="normal"
            fullWidth
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                },
              },
            }}
          />

          <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
            <Button
              onClick={onClose}
              sx={{ textTransform: "none", color: "#7f8c8d", flex: 1 }}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "#000",
                textTransform: "none",
                borderRadius: "0px",
                flex: 1,
                "&:hover": { background: "#333" },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "Save Changes"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default EditProject;
