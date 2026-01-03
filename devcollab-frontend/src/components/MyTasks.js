import React from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Box,
  Button,
  Divider
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link } from 'react-router-dom';

const MyTasks = ({ projects, currentUserId }) => {
  // 1. Flatten all tasks from all projects
  // 2. Filter for tasks assigned to currentUserId
  // 3. Filter for active tasks (TO_DO or IN_PROGRESS)
  
  const myTasks = projects.reduce((acc, project) => {
    if (project.tasks && Array.isArray(project.tasks)) {
      const userTasks = project.tasks.filter(task => 
        task.assigneeId === currentUserId && 
        (task.status === 'TO_DO' || task.status === 'IN_PROGRESS')
      ).map(task => ({
        ...task,
        projectName: project.name,
        projectId: project.id
      }));
      return [...acc, ...userTasks];
    }
    return acc;
  }, []);

  // Sort by status (IN_PROGRESS first) or date? Let's just keep it simple for now.

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        border: '1px solid #e0e0e0', 
        borderRadius: '12px',
        background: '#ffffff',
        height: '100%',
        maxHeight: '600px',
        overflowY: 'auto'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <AssignmentIcon sx={{ color: '#000' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
          My Active Tasks
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {myTasks.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <TaskAltIcon sx={{ fontSize: 40, color: '#ccc', mb: 1 }} />
          <Typography variant="body2" sx={{ color: '#666' }}>
            No active tasks assigned to you.
          </Typography>
          <Typography variant="caption" sx={{ color: '#999' }}>
            Enjoy your free time!
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {myTasks.map((task) => (
            <ListItem 
              key={task.id}
              disableGutters
              sx={{ 
                borderBottom: '1px solid #f0f0f0',
                py: 1.5,
                '&:last-child': { borderBottom: 'none' }
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                      {task.title}
                    </Typography>
                    <Chip 
                      label={task.status.replace('_', ' ')} 
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        background: task.status === 'IN_PROGRESS' ? '#E3F2FD' : '#F5F5F5',
                        color: task.status === 'IN_PROGRESS' ? '#1976D2' : '#666'
                      }} 
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {task.projectName}
                    </Typography>
                    <Button 
                      component={Link} 
                      to={`/project/${task.projectId}`}
                      size="small" 
                      sx={{ 
                        minWidth: 'auto', 
                        p: 0.5, 
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        color: '#000'
                      }}
                    >
                      View
                    </Button>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default MyTasks;
