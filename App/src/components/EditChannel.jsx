import React, { useState } from 'react';
import styled from 'styled-components';
import close from '../images/close.png';
import { ModalCloseButton } from './FriendsChannelsPU';
import ChannelImage from '../images/channel.jpeg'
import ImageUpload from './ImageUpload';
import { useMutation, gql } from '@apollo/client';
import ImageModal from './ImageModal';
import { WebcamCapture } from './WebcamCapture';
import MainButton from "./MainButton";
import tw from "twin.macro";
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment} from 'react'
import { mainColor } from '../const';

const DELETE_CHANNEL = gql`
mutation deleteChannel($channelId: String!){
  deleteChannel(_id: $channelId)
}
`;

const CHANGE_DESCRIPTION = gql`
mutation changeChannelDescription($channelId: String!, $newDescription: String!){
  changeChannelDescription(channelId: $channelId, newDescription: $newDescription){
    description
  }
}
`;

const UPLOAD_IMAGE = gql`
  mutation uploadChannelImage($channelId: String!, $file: Upload!) {
    uploadChannelImage(channelId: $channelId, file: $file){
      _id
      name,
      description,
      channelImage,
      owners,
      partecipants,
      squeals
    }
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





const StyledLabel = styled.label`
  color: #718096;
  font-size: 14px;
  margin-bottom: 5px; 
  margin-top: 10px;
`;



const StyledTextarea = styled.textarea`
  width: 100%;
  outline: none;
  font-size: 18px;
  padding: 10px 15px;
  border: 2px solid #cbd5e0;
  border-radius: 8px;
  transition: border-color 0.3s ease, color 0.3s ease;
  background-color: white;
  
  &:focus {
    border-color: #48bb78;
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const ButtonStyledSave = styled.button`
  background-color: ${mainColor};
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;

  &:hover {
    background-color: #207b10;
  }
`;

const ButtonStyledDelete = styled.button`
  background-color: #DD532F;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;

  &:hover {
    background-color: #b23c25;
  }
`;



const EditChannel = ({ isOpen, onClose, channel }) => {
  const navigate = useNavigate();
  const [channelImage, setChannelImage] = useState(channel.channelImage || null);

  const [bio, setBio] = useState('');
  const [showCam, setCam] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadImage] = useMutation(UPLOAD_IMAGE);
  const [changeDescription] = useMutation(CHANGE_DESCRIPTION);
  const [deleteChannel] = useMutation(DELETE_CHANNEL);
  const fileInputRef = React.useRef(null);
  const [changedImage, setChangedImage] = useState(false);

  function handleFileUpload() {
    fileInputRef.current.click();
  }

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (file) {
      setFile(file);
      convertToBase64(file);
    }
  }

  function convertToBase64(file) {
    setFile(file);

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const base64String = e.target.result;
        setChannelImage(base64String);
        setChangedImage(true);
      };

      reader.readAsDataURL(file);
    }
  }

  const showWebcam = () => {
    onClose();
    setCam(true);
  };

  const handleSaveChanges = async () => {
    try {
      if (bio !== '') {
        await changeDescription({
          variables: { channelId: channel._id, newDescription: bio },
        });
      } if (channelImage !== null && changedImage) {
        await uploadImage({
          variables: { channelId: channel._id, file: file },
          context: {
            headers: {
              'Access-Control-Request-Headers': 'content-type',
              'x-apollo-operation-name': 'singleUpload',
            },
          },
        });
      }
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDeleteChannel = async () => {
    try {
      await deleteChannel({
        variables: { channelId: channel._id },
      });
      onClose();
      navigate('/home');
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

  
  const handleWebcamCaptureClose = () => {
    setCam(false);
  };

  
 return (
    <div>
  <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-15" onClose={onClose}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>
  
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className='font-bold'>Modifica Canale</h2>
                    <ModalCloseButton onClick={onClose}>
                      <img src={close} alt="Close" style={{ width: '50px' }} />
                    </ModalCloseButton>
                  </div>
                  <ImageContainer>
            <img src={channelImage || ChannelImage} alt="ChannelImage" />
            </ImageContainer>
            <ButtonRow >
              <MainButton width="48%;" text="Selfie" fullButton={false} active={true} onClickFunction={showWebcam}/>
              <MainButton width="48%;" text="Carica" fullButton={true} active={true} onClickFunction={handleFileUpload}/>
            <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(event) => handleFileChange(event)}
            />
            </ButtonRow>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
            {/* Bio */}
            <StyledLabel htmlFor="bio">Descrizione</StyledLabel>
            <StyledTextarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        <div className='ml-auto' style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <ButtonStyledSave onClick={ handleSaveChanges} >Salva</ButtonStyledSave>
        <ButtonStyledDelete onClick={handleDeleteChannel}>Elimina Canale</ButtonStyledDelete>
        </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
  
      {showCam && (
            <ImageModal onClose={handleWebcamCaptureClose}>
            <WebcamCapture onCaptureComplete={(capturedImage) => convertToBase64(capturedImage)}  onClose={handleWebcamCaptureClose}/>
            </ImageModal>
        )}
    </div>
  );
};

export default EditChannel;