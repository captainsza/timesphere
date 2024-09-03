import { Button, Input } from "@mui/material";
import { motion } from "framer-motion";
import styled from "styled-components";

export const Backdrop = styled(motion.div)`
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

export const ModalContainer = styled(motion.div)`
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

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
`;

export const CloseIcon = styled.div`
  cursor: pointer;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

export const TaskInput = styled.input`
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

export const DatePickerWrapper = styled.div`
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

export const ScheduleSelect = styled.select`
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

export const ReminderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const ReminderButton = styled.button<{ active: boolean }>`
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

export const ReminderTimeInput = styled.input`
  width: 50px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.clockFrame};
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.text};
`;

export const FileInputWrapper = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

export const FileInput = styled.input`
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
`;

export const FileInputLabel = styled.label`
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

export const AddButton = styled.button`
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

export const LoadingSpinner = styled.div`
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

export const ErrorMessage = styled(motion.div)`
  background-color: rgba(255, 0, 0, 0.1);
  color: ${({ theme }) => theme.error || '#ff0000'};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

export const TaskList = styled.div`
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
`;

export const TaskItem = styled.div`
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

export const TaskIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

export const TaskContent = styled.div`
  flex: 1;
`;

export const TaskTitle = styled.span`
  color: ${({ theme }) => theme.text};
  display: block;
  font-weight: bold;
`;

export const TaskTime = styled.span`
  color: ${({ theme }) => theme.clockHourMarks};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const TaskAttachment = styled.span`
  color: ${({ theme }) => theme.clockHourMarks};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
`;

export const TaskActions = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const Checkbox = styled.input`
  cursor: pointer;
`;

export const DeleteButton = styled.button`
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

export const ModalContent = styled.div`
  background: linear-gradient(135deg, #1f1c2c, #928dab);
  padding: 20px;
  border-radius: 10px;
  color: white;
  text-align: center;
`;

export const StyledButton = styled(Button)`
  background: #6a11cb;
  background: -webkit-linear-gradient(to right, #2575fc, #6a11cb);
  background: linear-gradient(to right, #2575fc, #6a11cb);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const StyledInput = styled(Input)`
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
`;