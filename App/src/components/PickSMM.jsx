import React, { useState } from 'react';
import styled from 'styled-components';
import close from '../images/close.png';
import { ModalCloseButton } from './FriendsChannelsPU';
import user_image from '../images/user_image.jpg'
import ImageUpload from './ImageUpload';
import { useMutation, gql } from '@apollo/client';
import ImageModal from './ImageModal';
import { WebcamCapture } from './WebcamCapture';
import MainButton from "./MainButton";
import tw from "twin.macro";

const SELECT_SMM = gql`
  mutation selectSMM($smmId: String!) {
    selectSMM(smmId: $smmId)
  }
`;


const ButtonRow = styled.div`
  ${tw`
      flex
      justify-between
      items-center
  `}
  width: 100%;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    width: 70%;
  }
`;
const EditProfileContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px; /* Adjust the padding */
  background-color: #F7FAFC;
  border: 2px solid #279314;
  width: 40%; /* Adjust the width */
  max-height: 80vh; /* Adjust the max-height */
  overflow-y: auto; /* Add overflow-y for scrolling if needed */
  text-align: center;
  border-radius: 10px;
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  display: flex;
  flex-direction: column;
  z-index: 10;

 
  @media (max-width: 768px) {
    width: 90%; /* Adjust for smaller screens */
    max-height: 80vh; /* Adjust the max-height for smaller screens */
  }
`;
const ImageContainer = styled.div`
  display: flex;
  width: full;
  justify-content: center;

  @media (max-width: 768px) {
    img{
      width: 100px;
      height: 100px;
      margin-bottom: 15px;
    }
  }

  img{
    width: 130px;
    height: 130px;
    border: 1px solid black;
    margin-bottom: 20px;
    border-radius: 50%;
  }
`

const ProfileImageContainer = styled.div`
  width: 15vh;
  height: 19vh;
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

const ImageUploadButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: transparent;
  color: #DD532F;
  padding: 6px 12px;
  margin-right: 8px;
  cursor: pointer;
  border: 1px solid #DD532F;
  border-radius: 4px;
`;

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
  width: 100%;
`;

const StyledLabel = styled.label`
  color: #718096;
  font-size: 14px;
  margin-bottom: 5px; 
  margin-top: 10px;
`;

const StyledInput = styled.input`
  width: 100%;
  outline: none;
  font-size: 18px;
  padding: 10px 15px;
  border: 2px solid #cbd5e0;
  border-radius: 8px;
  transition: border-color 0.3s ease, color 0.3s ease;
  background-color: #F7FAFC;
  &:focus {
    border-color: #48bb78;
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  outline: none;
  font-size: 18px;
  padding: 10px 15px;
  border: 2px solid #cbd5e0;
  border-radius: 8px;
  transition: border-color 0.3s ease, color 0.3s ease;
  background-color: #F7FAFC;
  
  &:focus {
    border-color: #48bb78;
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const ButtonContainer = styled.div`
  ${tw`
      flex
      justify-center
  `}
`

const PickSMM = ({ isOpen, onClose, user }) => {
  const [uploadImage, {loading, error, data}] = useMutation(SELECT_SMM,{
    onError: () => {

    },
    onComplete: () => {

    }
  });

  
 return (
    <div>
      <EditProfileContainer isOpen={isOpen} onClose={onClose}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className='font-bold'>Scegli il tuo SMM</h2>
          <ModalCloseButton onClick={onClose}>
            <img src={close} alt="Close" style={{ width: '50px' }} />
          </ModalCloseButton>
        </div>
        <ButtonContainer>
          <MainButton text={"Conferma scelta"} active={true} fullButton={true} />
        </ButtonContainer>
      </EditProfileContainer>
    </div>
  );
};

export default PickSMM;