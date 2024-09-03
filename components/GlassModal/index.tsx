import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XCircle, PlusCircle, Clock, Mail, Bell, Upload, Edit, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EmojiPicker from 'emoji-picker-react';
import { Task, Schedule } from '@/type';
import { getAuthHeader } from '@/lib/utils/auth';
import {
  Backdrop,
  ModalContainer,
  Header,
  Title,
  CloseIcon,
  InputContainer,
  TaskInput,
  DatePickerWrapper,
  ScheduleSelect,
  ReminderContainer,
  ReminderButton,
  ReminderTimeInput,
  FileInputWrapper,
  FileInput,
  FileInputLabel,
  AddButton,
  LoadingSpinner,
  ErrorMessage,
  TaskList,
  TaskItem,
  TaskIcon,
  TaskContent,
  TaskTitle,
  TaskTime,
  TaskAttachment,
  TaskActions,
  Checkbox,
  DeleteButton,
  EmojiPickerContainer,
  EmojiButton,
  ToggleButton,
  ScheduleCreationContainer,
  ScheduleInput,
  IconSelect,
  EditButton,
  TextArea,
} from '@/styles/morestyles';

interface GlassModalProps {
  tasks: Task[];
  schedules: Schedule[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddSchedule: (schedule: Schedule) => void;
  onClose: () => void;
}

const GlassModal: React.FC<GlassModalProps> = ({
  tasks,
  schedules,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddSchedule,
  onClose,
}) => {
  const [mode, setMode] = useState<'task' | 'schedule'>('task');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [reminderType, setReminderType] = useState<'none' | 'email' | 'notification'>('none');
  const [reminderTime, setReminderTime] = useState<number>(15);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [newScheduleTitle, setNewScheduleTitle] = useState<string>('');
  const [newScheduleDescription, setNewScheduleDescription] = useState<string>('');
  const [newScheduleIcon, setNewScheduleIcon] = useState<string>('📅');
  const [newScheduleTime, setNewScheduleTime] = useState<Date>(new Date());

  useEffect(() => {
    if (schedules && schedules.length > 0) {
      setSelectedSchedule(schedules[0].id);
    }
  }, [schedules]);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    return data.url;
  };

  const handleAddOrUpdateTask = async () => {
    if (newTask.trim() && selectedSchedule) {
      setIsLoading(true);
      setError(null);
      try {
        let fileUrl = '';
        if (file) {
          fileUrl = await uploadFile(file);
        }

        const taskData: Partial<Task> = {
          title: newTask,
          emoji: selectedEmoji,
          startTime: selectedDate,
          endTime: new Date(selectedDate.getTime() + 60 * 60 * 1000),
          completed: false,
          scheduleId: selectedSchedule,
          uploads: fileUrl ? [{ url: fileUrl, type: file ? file.type : '' }] : [],
        };

        if (selectedTask) {
          const response = await fetch(`/api/tasks/${selectedTask.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader(),
            },
            body: JSON.stringify(taskData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update task');
          }

          const updatedTask = await response.json();
          onUpdateTask(selectedTask.id, updatedTask);
        } else {
          const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader(),
            },
            body: JSON.stringify(taskData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add task');
          }

          const savedTask = await response.json();
          onAddTask(savedTask);
        }

        resetForm();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while processing the task');
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Please enter a task title and select a schedule');
    }
  };

  const handleAddSchedule = async () => {
    if (newScheduleTitle.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        const scheduleData = {
          title: newScheduleTitle,
          description: newScheduleDescription,
          time: newScheduleTime,
          icon: newScheduleIcon,
        };

        const response = await fetch('/api/schedules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify(scheduleData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add schedule');
        }

        const savedSchedule = await response.json();
        onAddSchedule(savedSchedule);
        setSelectedSchedule(savedSchedule.id);
        resetScheduleForm();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while creating the schedule');
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Please enter a schedule title');
    }
  };

  const resetForm = () => {
    setNewTask('');
    setSelectedEmoji('');
    setSelectedDate(new Date());
    setSelectedSchedule(schedules[0]?.id || '');
    setReminderType('none');
    setReminderTime(15);
    setFile(null);
    setSelectedTask(null);
  };

  const resetScheduleForm = () => {
    setNewScheduleTitle('');
    setNewScheduleDescription('');
    setNewScheduleIcon('📅');
    setNewScheduleTime(new Date());
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setNewTask(task.title);
    setSelectedEmoji(task.emoji || '');
    setSelectedDate(new Date(task.startTime));
    setSelectedSchedule(task.scheduleId);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await onDeleteTask(taskId);
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setSelectedEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleModeToggle = (newMode: 'task' | 'schedule') => {
    setMode(newMode);
    resetForm();
  };

  return (
    <Backdrop
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalContainer
        initial={{ y: '-100vh', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '-100vh', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 50 }}
      >
        <Header>
          <Title>{mode === 'task' ? 'Add New Task' : 'Add New Schedule'}</Title>
          <CloseIcon onClick={onClose}>
            <XCircle size={24} />
          </CloseIcon>
        </Header>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <ToggleButton active={mode === 'task'} onClick={() => handleModeToggle('task')}>
            Add Task
          </ToggleButton>
          <ToggleButton active={mode === 'schedule'} onClick={() => handleModeToggle('schedule')}>
            Add Schedule
          </ToggleButton>
        </div>

        {mode === 'task' ? (
          <InputContainer>
            <EmojiButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              {selectedEmoji || '😀'}
            </EmojiButton>
            {showEmojiPicker && (
              <EmojiPickerContainer
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </EmojiPickerContainer>
            )}
            <TaskInput
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
            />
            <DatePickerWrapper>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date || new Date())}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </DatePickerWrapper>
            <ScheduleSelect
  value={selectedSchedule}
  onChange={(e) => setSelectedSchedule(e.target.value)}
>
  <option value="">Select a schedule</option>
  {schedules && schedules.length > 0 ? (
    schedules.map((schedule) => (
      <option key={schedule.id} value={schedule.id}>
        {schedule.icon} {schedule.title}
      </option>
    ))
  ) : (
    <option disabled>No schedules available</option>
  )}
</ScheduleSelect>
            <ReminderContainer>
              <ReminderButton
                active={reminderType === 'email'}
                onClick={() => setReminderType('email')}
              >
                <Mail size={16} />
              </ReminderButton>
              <ReminderButton
                active={reminderType === 'notification'}
                onClick={() => setReminderType('notification')}
              >
                <Bell size={16} />
              </ReminderButton>
              {reminderType !== 'none' && (
                <ReminderTimeInput
                  type="number"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(Number(e.target.value))}
                  min={1}
                />
              )}
            </ReminderContainer>
            <FileInputWrapper>
              <FileInput
                type="file"
                onChange={handleFileChange}
                id="file-upload"
              />
              <FileInputLabel htmlFor="file-upload">
                <Upload size={16} />
                {file ? file.name : 'Upload File'}
              </FileInputLabel>
            </FileInputWrapper>
            <AddButton onClick={handleAddOrUpdateTask} disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : <PlusCircle size={24} />}
            </AddButton>
          </InputContainer>
        ) : (
          <ScheduleCreationContainer>
            <ScheduleInput
              value={newScheduleTitle}
              onChange={(e) => setNewScheduleTitle(e.target.value)}
              placeholder="Enter schedule title..."
            />
            <TextArea
              value={newScheduleDescription}
              onChange={(e) => setNewScheduleDescription(e.target.value)}
              placeholder="Enter schedule description..."
            />
            <DatePickerWrapper>
              <DatePicker
                selected={newScheduleTime}
                onChange={(date: Date | null) => setNewScheduleTime(date || new Date())}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </DatePickerWrapper>
            <IconSelect value={newScheduleIcon} onChange={(e) => setNewScheduleIcon(e.target.value)}>
              <option value="📅">📅</option>
              <option value="🗓️">🗓️</option>
              <option value="📆">📆</option>
              <option value="🕒">🕒</option>
            </IconSelect>
            <AddButton onClick={handleAddSchedule} disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : <PlusCircle size={24} />}
            </AddButton>
          </ScheduleCreationContainer>
        )}

        <AnimatePresence>
          {error && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </ErrorMessage>
          )}
        </AnimatePresence>

        {mode === 'task' && (
          <TaskList>
            {tasks.map((task) => (
              <TaskItem key={task.id}>
                <TaskIcon>{task.emoji}</TaskIcon>
                <TaskContent>
                  <TaskTitle>{task.title}</TaskTitle>
                  <TaskTime>
                    <Clock size={12} />
                    {new Date(task.startTime).toLocaleString()}
                  </TaskTime>
                  {task.uploads && task.uploads.length > 0 && (
                    <TaskAttachment>
                      <Upload size={12} />
                      Attachment
                    </TaskAttachment>
                  )}
                </TaskContent>
                <TaskActions>
                  <Checkbox
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => onUpdateTask(task.id, { completed: e.target.checked })}
                  />
                  <EditButton onClick={() => handleEditTask(task)}>
                    <Edit size={16} />
                  </EditButton>
                  <DeleteButton onClick={() => handleDeleteTask(task.id)}>
                    <XCircle size={16} />
                  </DeleteButton>
                </TaskActions>
              </TaskItem>
            ))}
          </TaskList>
        )}
      </ModalContainer>
    </Backdrop>
  );
};

export default GlassModal;
