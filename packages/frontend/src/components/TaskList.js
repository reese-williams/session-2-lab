import React from 'react';
import { Stack, Typography } from '@mui/material';
import TaskItem from './TaskItem';

function TaskList({ tasks, onToggleComplete, onDelete, onDuplicate, onUpdate, loading }) {
  if (tasks.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No tasks match your current filters.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onUpdate={onUpdate}
          loading={loading}
        />
      ))}
    </Stack>
  );
}

export default TaskList;
