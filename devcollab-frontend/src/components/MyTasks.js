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
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const MyTasks = ({ projects, currentUserId, isPopover }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 1. Flatten all tasks from all projects
  // 2. Filter for tasks assigned to currentUserId
  const allUserTasks = projects.reduce((acc, project) => {
    if (project.tasks && Array.isArray(project.tasks)) {
      const userTasks = project.tasks.filter(task => 
        task.assigneeId === currentUserId
      ).map(task => ({
        ...task,
        projectName: project.name,
        projectId: project.id
      }));
      return [...acc, ...userTasks];
    }
    return acc;
  }, []);

  // Filter based on status
  const activeTasks = allUserTasks.filter(task => 
    task.status === 'TO_DO' || task.status === 'IN_PROGRESS'
  );

  const completedTasks = allUserTasks.filter(task => 
    task.status === 'DONE'
  );

  const currentTasks = tabValue === 0 ? activeTasks : completedTasks;

  return (
    <Paper 
      elevation={0}
      sx={{ 
        border: isPopover ? 'none' : '1px solid #e0e0e0', 
        borderRadius: isPopover ? 0 : '12px',
        background: '#ffffff',
        height: '100%',
        maxHeight: isPopover ? '500px' : '600px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="task tabs"
          variant="fullWidth"
          sx={{
            minHeight: isPopover ? '48px' : 'auto',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.90rem',
              minHeight: isPopover ? '48px' : 'auto',
              color: '#666',
              '&.Mui-selected': {
                color: '#000',
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#000',
            }
          }}
        >
          <Tab 
            icon={<AssignmentIcon fontSize="small" />} 
            iconPosition="start" 
            label={`Active (${activeTasks.length})`} 
          />
          <Tab 
            icon={<TaskAltIcon fontSize="small" />} 
            iconPosition="start" 
            label={`Done (${completedTasks.length})`} 
          />
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
        {currentTasks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6, px: 3 }}>
            {tabValue === 0 ? (
              <>
                <AssignmentIcon sx={{ fontSize: 40, color: '#ccc', mb: 1 }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  No active tasks assigned to you.
                </Typography>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  Enjoy your free time!
                </Typography>
              </>
            ) : (
              <>
                <TaskAltIcon sx={{ fontSize: 40, color: '#ccc', mb: 1 }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  No completed tasks yet.
                </Typography>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  Get to work!
                </Typography>
              </>
            )}
          </Box>
        ) : (
          <List disablePadding>
            {currentTasks.map((task) => (
              <ListItem 
                key={task.id}
                disableGutters
                sx={{ 
                  borderBottom: '1px solid #f0f0f0',
                  p: 2,
                  '&:last-child': { borderBottom: 'none' },
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: '#fafafa'
                  }
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
                          background: task.status === 'IN_PROGRESS' ? '#E3F2FD' : 
                                      task.status === 'DONE' ? '#E8F5E9' : '#F5F5F5',
                          color: task.status === 'IN_PROGRESS' ? '#1976D2' : 
                                 task.status === 'DONE' ? '#2E7D32' : '#666'
                        }} 
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {task.projectName}
                      </Typography>
                      <Button 
                        component={Link} 
                        to={`/project/${task.projectId}`}
                        size="small" 
                        sx={{ 
                          minWidth: 'auto', 
                          p: '2px 8px', 
                          fontSize: '0.75rem',
                          textTransform: 'none',
                          color: '#000',
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                            borderColor: '#ccc'
                          }
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
      </Box>
    </Paper>
  );
};

export default MyTasks;
