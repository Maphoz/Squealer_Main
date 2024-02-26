import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import styled from 'styled-components';

const WebcamContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const WebcamImg = styled.div`
  img {
    width: ${({ captured }) => (captured ? 'auto' : '15vh')};
    height: ${({ captured }) => (captured ? 'auto' : '15vh')};
    border-radius: 50%;
    cursor: pointer;
    margin-bottom: 2vh;
    margin-top: 1vh;
    border: 1px solid;
  }
`;

const CaptureButton = styled.button`
  background-color: transparent;
  color: #4caf50;
  padding: 8px 16px;
  margin-top: 10px;
  border: 2px solid #4caf50;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #4caf50;
    color: white;
  }
`;

const RetakeButton = styled.button`
  color: #f44336;
  margin-left: 8px;
  border: 2px solid #f44336;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  padding: 8px 16px;

  &:hover {
    background-color: #f44336;
    color: white;
  }
`;

const videoConstraints = {
  width: 220,
  height: 200,
  facingMode: 'user',
};

function generateRandomFileName(extension) {
  const randomString = Math.random().toString(36).substring(2, 8);
  const timestamp = Date.now();
  return `${randomString}_${timestamp}.${extension}`;
}

export const WebcamCapture = ({ onCaptureComplete, onClose }) => {
  const [image, setImage] = useState('');
  const [showSaveButton, setShowSaveButton] = useState(false);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const randomFileName = generateRandomFileName('jpg');

    // Convert Base64 to Blob
    const byteCharacters = atob(imageSrc.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // Create a File from Blob
    const file = new File([blob], randomFileName, { type: 'image/jpeg' });

    setImage(file);
    setShowSaveButton(true);
  });

  const retakeImage = () => {
    setShowSaveButton(false);

    // Cleanup if needed (e.g., remove the Blob)
    if (image instanceof Blob) {
      URL.revokeObjectURL(image);
    }

    setImage('');
  };

  const handleSave = () => {
    setShowSaveButton(false);
    onCaptureComplete(image);
    onClose();
  };

  return (
    <WebcamContainer>
      <WebcamImg captured={image !== ''}>
        {image === '' ? (
          <Webcam
            audio={false}
            height={200}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={220}
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={URL.createObjectURL(image)} alt="Captured" onClick={retakeImage} />
        )}
      </WebcamImg>
      <div>
        {image !== '' ? (
          <ButtonContainer>
            <RetakeButton onClick={retakeImage}>Retake Image</RetakeButton>
            {showSaveButton && <CaptureButton onClick={handleSave} >Save</CaptureButton>}
          </ButtonContainer>
        ) : (
          <CaptureButton onClick={capture}>Capture</CaptureButton>
        )}
      </div>
    </WebcamContainer>
  );
};
