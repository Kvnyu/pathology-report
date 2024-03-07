'use client';
import React, { useRef } from 'react';
// External Modules
import { Button } from '@tremor/react';

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  children?: React.ReactNode;
}

const FileUploadButton = ({
  onFileSelect,
  children
}: FileUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div>
      <Button onClick={handleButtonClick}>
        {children ? children : 'Upload File'}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploadButton;
