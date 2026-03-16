import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from '../components/TaskList';

const task = {
  id: 1,
  title: 'Task one',
  description: 'Details',
  dueDate: '2030-01-01',
  priority: 'high',
  tags: ['work'],
  completed: false,
};

describe('TaskList', () => {
  test('renders empty state', () => {
    render(
      <TaskList
        tasks={[]}
        onToggleComplete={jest.fn()}
        onDelete={jest.fn()}
        onDuplicate={jest.fn()}
        onUpdate={jest.fn()}
        loading={false}
      />
    );

    expect(screen.getByText('No tasks match your current filters.')).toBeInTheDocument();
  });

  test('renders task cards', () => {
    render(
      <TaskList
        tasks={[task]}
        onToggleComplete={jest.fn()}
        onDelete={jest.fn()}
        onDuplicate={jest.fn()}
        onUpdate={jest.fn()}
        loading={false}
      />
    );

    expect(screen.getByText('Task one')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });
});
