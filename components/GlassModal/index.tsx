import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, PlusCircle, Clock, Mail, Bell, Upload } from 'lucide-react';
import { Task, Schedule, User } from '@/type';
import { themes } from '@/styles/themes';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getAuthHeader } from '@/lib/utils/auth';

interface GlassModalProps {
  tasks: Task[];
  schedules: Schedule[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onClose: () => void;
  theme?: typeof themes.default;
}

const GlassModal: React.FC<GlassModalProps> = ({
  tasks,
  schedules,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onClose,
  theme = themes.default
}) => {
  const [newTask, setNewTask] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [reminderType, setReminderType] = useState<'none' | 'email' | 'notification'>('none');
  const [reminderTime, setReminderTime] = useState<number>(15);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (schedules && schedules.length > 0) {
      setSelectedSchedule(schedules[0].id);
    }
  }, [schedules]);

  const handleAddTask = async () => {
    if (newTask.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        let fileUrl = '';
        if (file) {
          fileUrl = await uploadFile(file);
        }

        const task: Task = {
          id: crypto.randomUUID(),
          title: newTask,
          startTime: selectedDate,
          endTime: new Date(selectedDate.getTime() + 60 * 60 * 1000), // Default 1 hour duration
          completed: false,
          scheduleId: selectedSchedule,
          schedule: schedules.find(s => s.id === selectedSchedule) || schedules[0],
          createdAt: new Date(),
          updatedAt: new Date(),
          uploads: fileUrl ? [{
            id: crypto.randomUUID(),
            url: fileUrl,
            type: file ? file.type : '',
            taskId: '', // Placeholder, will be updated after task creation
            task: {} as Task, // Placeholder, will be updated after task creation
            userId: '', // Placeholder, should be set to the current user's ID
            user: {} as User, // Placeholder, should be set to the current user
            createdAt: new Date()
          }] : [],
        };

        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify(task),
        });

        if (!response.ok) {
          throw new Error('Failed to add task');
        }

        const savedTask = await response.json();
        onAddTask(savedTask);
        setNewTask('');
        setFile(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while adding the task');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_cloudinary_upload_preset');

    const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      await onUpdateTask(taskId, { completed });
    } catch (err) {
      setError('Failed to update task completion status');
    }
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
          <Title>Task Scheduler</Title>
          <CloseIcon onClick={onClose}>
            <XCircle color={theme.text} size={24} />
          </CloseIcon>
        </Header>
        <InputContainer>
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
            {schedules?.length > 0 ? (
              schedules.map((schedule) => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.title}
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
          <AddButton onClick={handleAddTask} disabled={isLoading}>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <PlusCircle color={theme.clockFace} size={24} />
            )}
          </AddButton>
        </InputContainer>
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
        <TaskList>
          {tasks.map((task) => (
            <TaskItem key={task.id}>
              <TaskIcon src={task.schedule.icon} alt={task.title} />
              <TaskContent>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskTime>
                  <Clock size={12} />
                  {task.startTime.toLocaleString()}
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
                  onChange={(e) => handleTaskCompletion(task.id, e.target.checked)}
                />
                <DeleteButton onClick={() => handleDeleteTask(task.id)}>
                  <XCircle size={16} />
                </DeleteButton>
              </TaskActions>
            </TaskItem>
          ))}
        </TaskList>
      </ModalContainer>
    </Backdrop>
  );
};

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.clockFrame};
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 95%;
    padding: 15px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
`;

const CloseIcon = styled.div`
  cursor: pointer;
`;

const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const TaskInput = styled.input`
  flex: 1 1 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.clockFrame};
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.clockFace};
  }
`;

const DatePickerWrapper = styled.div`
  flex: 1 1 auto;
  
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.clockFrame};
    background: rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.text};
  }
`;

const ScheduleSelect = styled.select`
  flex: 1 1 auto;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.clockFrame};
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.clockFace};
  }
`;

const ReminderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ReminderButton = styled.button<{ active: boolean }>`
  padding: 5px;
  border-radius: 5px;
  border: none;
  background-color: ${({ active, theme }) => active ? theme.scheduleIndicator : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ theme }) => theme.text};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.scheduleIndicator};
  }
`;

const ReminderTimeInput = styled.input`
  width: 50px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.clockFrame};
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.text};
`;

const FileInputWrapper = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

const FileInput = styled.input`
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.clockFrame};
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.clockFrame};
  border: none;
  border-radius: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.scheduleIndicator};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  border: 2px solid ${({ theme }) => theme.clockFace};
  border-top: 2px solid transparent;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled(motion.div)`
  background-color: rgba(255, 0, 0, 0.1);
  color: ${({ theme }) => theme.error || '#ff0000'};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const TaskList = styled.div`
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.scheduleIndicator};
  }
`;

const TaskIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const TaskContent = styled.div`
  flex: 1;
`;

const TaskTitle = styled.span`
  color: ${({ theme }) => theme.text};
  display: block;
  font-weight: bold;
`;

const TaskTime = styled.span`
  color: ${({ theme }) => theme.clockHourMarks};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const TaskAttachment = styled.span`
  color: ${({ theme }) => theme.clockHourMarks};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
`;

const TaskActions = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

export default GlassModal;