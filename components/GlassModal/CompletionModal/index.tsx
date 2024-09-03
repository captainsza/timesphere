import React, { useState, ChangeEvent } from 'react';

import { Upload } from 'lucide-react';
import { ModalContent, StyledButton, StyledInput } from '@/styles/morestyles';
import { Modal } from '@mui/material';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (taskId: string, file: File, caption: string) => Promise<void>;
  taskId: string;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ isOpen, onClose, onUpload, taskId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      await onUpload(taskId, file, caption);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <h2>Task Completed!</h2>
        <p>Would you like to upload a related image or content?</p>
        <StyledInput
          type="file"
          onChange={handleFileChange}
        />
        <StyledInput
          type="text"
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <StyledButton onClick={handleUpload} disabled={!file}>
          <Upload size={16} />
          Upload
        </StyledButton>
      </ModalContent>
    </Modal>
  );
};

export default CompletionModal;