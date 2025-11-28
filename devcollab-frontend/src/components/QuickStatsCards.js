// src/components/QuickStatsCards.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Paper, Typography, Box } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const QuickStatsCards = ({ projects }) => {
  // Calculate statistics from projects data
  const totalProjects = projects.length;
  
  // Calculate unique members across all projects
  const uniqueMembers = new Set();
  projects.forEach(project => {
    if (project.members && Array.isArray(project.members)) {
      project.members.forEach(member => {
        uniqueMembers.add(member.userId || member.id);
      });
    }
  });
  const totalMembers = uniqueMembers.size;
  
  const { userInfo } = useSelector((state) => state.auth);
  
  // Calculate completed tasks assigned to current user across all projects
  const completedTasks = projects.reduce((total, project) => {
    if (project.tasks && Array.isArray(project.tasks)) {
      const doneTasks = project.tasks.filter(task => 
        task.status === 'DONE' && 
        task.assigneeId === userInfo?.user?.id
      );
      return total + doneTasks.length;
    }
    return total;
  }, 0);

  const stats = [
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: FolderIcon,
      color: '#4CAF50',
      bgColor: '#E8F5E9',
    },
    {
      title: 'Active Members',
      value: totalMembers,
      icon: PeopleIcon,
      color: '#2196F3',
      bgColor: '#E3F2FD',
    },
    {
      title: 'Tasks Completed',
      value: completedTasks,
      icon: CheckCircleIcon,
      color: '#FF9800',
      bgColor: '#FFF3E0',
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3,
        }}
      >
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          
          return (
            <Box
              key={index}
              sx={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2.5,
              }}
            >
              {/* Icon Container */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  background: stat.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IconComponent sx={{ fontSize: 28, color: stat.color }} />
              </Box>

              {/* Text Content */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#000',
                    mb: 0.5,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    fontWeight: 500,
                  }}
                >
                  {stat.title}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default QuickStatsCards;
