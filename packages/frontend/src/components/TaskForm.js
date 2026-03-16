import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const PRIORITIES = ['low', 'medium', 'high'];

function parseTags(rawTags) {
  return rawTags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function defaultValues() {
  return {
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    tagsInput: '',
  };
}

function TaskForm({ onCreate, loading }) {
  const [values, setValues] = useState(defaultValues);
  const [titleError, setTitleError] = useState('');

  const parsedTags = useMemo(() => parseTags(values.tagsInput), [values.tagsInput]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (name === 'title' && value.trim()) {
      setTitleError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.title.trim()) {
      setTitleError('Title is required');
      return;
    }

    await onCreate({
      title: values.title.trim(),
      description: values.description.trim(),
      dueDate: values.dueDate || null,
      priority: values.priority,
      tags: parsedTags,
    });

    setValues(defaultValues());
    setTitleError('');
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Add Task
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              required
              fullWidth
              id="title"
              name="title"
              label="Task title"
              value={values.title}
              onChange={handleChange}
              error={Boolean(titleError)}
              helperText={titleError || 'What needs to be done?'}
            />
            <TextField
              fullWidth
              multiline
              minRows={2}
              id="description"
              name="description"
              label="Description"
              value={values.description}
              onChange={handleChange}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                id="dueDate"
                name="dueDate"
                label="Due date"
                type="date"
                value={values.dueDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                fullWidth
                id="priority"
                name="priority"
                label="Priority"
                value={values.priority}
                onChange={handleChange}
              >
                {PRIORITIES.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <TextField
              fullWidth
              id="tagsInput"
              name="tagsInput"
              label="Tags (comma-separated)"
              value={values.tagsInput}
              onChange={handleChange}
              helperText="Example: work, urgent, planning"
            />
            {parsedTags.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {parsedTags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" color="secondary" variant="outlined" />
                ))}
              </Stack>
            )}
            <Button type="submit" variant="contained" disabled={loading}>
              Add Task
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TaskForm;
