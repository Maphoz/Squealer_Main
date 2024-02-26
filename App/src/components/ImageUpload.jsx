import React, { useState } from 'react';
import { WebcamCapture } from './WebcamCapture';
import ImageModal from './ImageModal';
import no_image from '../images/no_image.jpeg';
import styled from 'styled-components';

const ProfileImageContainer = styled.div`
  width: 15vh;
  height: 15vh;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
  border: 1px solid;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }
`;


function ImageUpload({user, onImageCapture}){

  const[image, setImage] = useState(user.profileImage || "");
  const [showWebcamModal, setShowWebcamModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState("");
  
  const handleImageChange = () => {
    setShowWebcamModal(true);
  };

 const handleWebcamCaptureClose = () => {
    setShowWebcamModal(false);
    setImage(URL.createObjectURL(image));
    onImageCapture(image);
  };
  

  const handleSaveImage = () => {
    setShowWebcamModal(false);
    onImageCapture(image);
  };

  async function uploadFromMemory(e) {
    const file = e.target.files[0];
    onImageCapture(file);
    setImage(URL.createObjectURL(file));
  }

  return (
    <div>
       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <p className="text-gray-500 font-semibold">Update Profile Picture</p>
          <ProfileImageContainer>
          <img
            src={image || no_image}
            alt="User Profile"
          />
         </ProfileImageContainer>
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1vh' }}>
              <button
                style={{
                  backgroundColor: 'transparent',
                  color: '#DD532F',
                  padding: '6px 12px',
                  marginRight: '8px',
                  cursor: 'pointer',
                  border: '1px solid #DD532F',
                  borderRadius: '4px',
                }}
                onClick={() => {
                  handleImageChange();
                }}
              >
              Take a picture
            </button>
            <label htmlFor="fileInput" style={{ position: 'relative' }}>
              <button
                style={{
                  backgroundColor: 'transparent',
                  color: '#DD532F',  // Colore arancione più scuro
                  padding: '6px 12px',
                  cursor: 'pointer',
                  border: '1px solid #DD532F',
                  borderRadius: '4px',
                }}
                onClick={() => {
                    document.getElementById('fileInput').click();
                  }}
              >
                Choose a file
              </button>
              <input
                    accept='image/*'
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={uploadFromMemory}
                />
              </label>
              </div>
            </div>
        {showWebcamModal && (
        <ImageModal onClose={handleWebcamCaptureClose}>
          <WebcamCapture onCaptureComplete={setImage}  onClose={handleWebcamCaptureClose} />
        </ImageModal>
      )}
    </div>
  )

}

export default ImageUpload;
