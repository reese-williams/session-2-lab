import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

function TaskItem({ task, onToggleComplete, onDelete, onDuplicate, onUpdate, loading }) {
  const [editOpen, setEditOpen] = useState(false);
  const [values, setValues] = useState({
    title: task.title,
    description: task.description || '',
    dueDate: task.dueDate || '',
    priority: task.priority || 'medium',
    tagsInput: (task.tags || []).join(', '),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await onUpdate(task.id, {
      title: values.title,
      description: values.description,
      dueDate: values.dueDate || null,
      priority: values.priority,
      tags: values.tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });

    setEditOpen(false);
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderColor: task.completed ? 'success.light' : 'divider',
          opacity: task.completed ? 0.82 : 1,
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Checkbox
              checked={task.completed}
              onChange={() => onToggleComplete(task)}
              inputProps={{ 'aria-label': `Toggle completion for ${task.title}` }}
              sx={{ mt: -0.5 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
              >
                {task.title}
              </Typography>
              {task.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {task.description}
                </Typography>
              )}
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.25 }}>
                <Chip
                  size="small"
                  label={task.completed ? 'Completed' : 'Active'}
                  color={task.completed ? 'success' : 'primary'}
                  variant={task.completed ? 'filled' : 'outlined'}
                />
                <Chip size="small" label={`Priority: ${task.priority}`} variant="outlined" />
                <Chip
                  size="small"
                  label={task.dueDate ? `Due: ${task.dueDate}` : 'No due date'}
                  color={task.dueDate ? 'warning' : 'default'}
                  variant="outlined"
                />
                {(task.tags || []).map((tag) => (
                  <Chip key={tag} size="small" label={`#${tag}`} color="secondary" variant="outlined" />
                ))}
              </Stack>
            </Box>
          </Stack>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button size="small" variant="text" onClick={() => setEditOpen(true)} disabled={loading}>
            Edit
          </Button>
          <Button size="small" variant="outlined" onClick={() => onDuplicate(task.id)} disabled={loading}>
            Duplicate
          </Button>
          <Button size="small" color="error" variant="outlined" onClick={() => onDelete(task)} disabled={loading}>
            Delete
          </Button>
        </CardActions>
      </Card>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              required
              name="title"
              label="Title"
              value={values.title}
              onChange={handleChange}
            />
            <TextField
              name="description"
              label="Description"
              multiline
              minRows={2}
              value={values.description}
              onChange={handleChange}
            />
            <TextField
              name="dueDate"
              label="Due date"
              type="date"
              value={values.dueDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              name="priority"
              label="Priority"
              value={values.priority}
              onChange={handleChange}
            >
              <MenuItem value="low">low</MenuItem>
              <MenuItem value="medium">medium</MenuItem>
              <MenuItem value="high">high</MenuItem>
            </TextField>
            <TextField
              name="tagsInput"
              label="Tags"
              helperText="comma-separated"
              value={values.tagsInput}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TaskItem;
