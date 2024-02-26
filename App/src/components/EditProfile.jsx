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
import { useNavigate } from 'react-router-dom';
import ErrorPopUp from './ErrorMessage';
import CorrectPopUp from './CorrectMessage';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment} from 'react'
import { mainColor } from '../const';
import { GET_MY_ACCOUNT } from './ProfileContainer';
import { useGlobalState } from '../GlobalStateContext';
import { useQuery} from '@apollo/client';
import { useEffect } from 'react';
import { actionTypes } from '../GlobalStateContext';

const UPLOAD_IMAGE = gql`
  mutation uploadImage($userId: String!, $file: Upload!) {
    uploadImage(userId: $userId, file: $file)
  }
`;

const CHANGE_FIRST_NAME = gql`
mutation changeFirstName($newFirstName: String!){
  changeFirstName(newFirstName: $newFirstName)
}
`;

const CHANGE_LAST_NAME = gql`
mutation changeLastName($newLastName: String!){
  changeLastName(newLastName: $newLastName)
}
`;

const CHANGE_USERNAME = gql`
mutation ChangeUsername($_id: String!, $newUsername: String!){
  changeUsername(_id: $_id, newUsername: $newUsername)
}
`;

const ADD_BIO = gql`
  mutation AddBio($_id: String!, $bio: String!){
    addBio(_id: $_id, bio: $bio)
  }
`;

const DELETE_USER= gql`
mutation deleteUser{
  deleteUser
}
`;

const CHANGE_PASSWORD = gql`
mutation changePassword($newPassword: String!, $newPassword2: String!){
  changePassword(newPassword: $newPassword, newPassword2: $newPassword2)
}
`;


export const Container = styled.div`
  max-width: 576px;
  margin: 0 auto;
  overflow-y: auto; 

  @media (max-width: 576px) {
    max-height: 20vh; 
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
  background-color: white;
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
const DialogPanel = styled.div`

  max-height: 700px;
  overflow-y: auto;
  
  @media (max-width: 575px) {
    overflow-y: auto;
    max-height: 600px;
  }
`;

const EditProfile = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();
  const {loading: loadingCurrentUser, error: errorCurrentUser, data : dataUser, refetch} = useQuery(GET_MY_ACCOUNT);

  const [currentUser, setCurrentUser] = useState();
  useEffect( () => {
    if(dataUser && dataUser.getMyAccount){
      setCurrentUser({...dataUser.getMyAccount})
    }
  }, [dataUser])

  const {state, dispatch} = useGlobalState();

  function toggleDataUpdate(){
    dispatch({
      type: actionTypes.UPDATE_PROFILE,
      payload: 'profileData'
    })
    refetch();
  }


  const [profileImage, setProfileImage] = useState(user.profileImage || null);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newUsername, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [showCam, setCam] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadImage] = useMutation(UPLOAD_IMAGE);
  const [changeFirstName] = useMutation(CHANGE_FIRST_NAME, {
    onError: () => {
      setNotChanged(true);
      setTimeout( () => {
        setNotChanged(false);
      }, 1500)
    },
    onCompleted: () => {
      setCorrectlyChanged(true);
      setTimeout(( ) => {
        setCorrectlyChanged(false);
      }, 1500)
    }
  });
  const [changeLastName] = useMutation(CHANGE_LAST_NAME, {
    onError: () => {
      setNotChanged(true);
      setTimeout( () => {
        setNotChanged(false);
      }, 1500)
    },
    onCompleted: () => {
      setCorrectlyChanged(true);
      setTimeout(( ) => {
        setCorrectlyChanged(false);

      }, 1500)
    }
  });
  const [changeUsername] = useMutation(CHANGE_USERNAME, {
    onError: () => {
      setNotChanged(true);
      setTimeout( () => {
        setNotChanged(false);
      }, 1500)
    },
    onCompleted: () => {
      setCorrectlyChanged(true);
      setTimeout(( ) => {
        setCorrectlyChanged(false);

      }, 1500)
    }
  });
  const [addBio] = useMutation(ADD_BIO, {
    onError: () => {
      setNotChanged(true);
      setTimeout( () => {
        setNotChanged(false);
      }, 1500)
    },
    onCompleted: () => {
      setCorrectlyChanged(true);
      setTimeout(( ) => {
        setCorrectlyChanged(false);

      }, 1500)
    }
  });
  const [deleteUser] = useMutation(DELETE_USER, {
    onError: () => {
      setNotChanged(true);
      setTimeout( () => {
        setNotChanged(false);
      }, 1500)
    },
    onCompleted: () => {
      setCorrectlyChanged(true);
      setTimeout(( ) => {
        setCorrectlyChanged(false);

      }, 1500)
    }
  });
  const [changePassword] = useMutation(CHANGE_PASSWORD, {
    onError: () => {
      setNotChanged(true);
      setTimeout( () => {
        setNotChanged(false);
      }, 1500)
    },
    onCompleted: () => {
      setCorrectlyChanged(true);
      setTimeout(( ) => {
        setCorrectlyChanged(false);

      }, 1500)
    }
  });
  const [changePassword1, setChangePassword1] = useState('');
  const [changePassword2, setChangePassword2] = useState('');
  const [correctlyChanged, setCorrectlyChanged] = useState(false);
  const [notChanged, setNotChanged] = useState(false);
  const [mismatchingPasswords, setMismatchingPasswords] = useState(false);
  const [notValidPassword, setNotValidPassword] = useState(false);

  const fileInputRef = React.useRef(null);


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
        setProfileImage(base64String);
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
      if (changePassword1 !== '' && changePassword2 !== '') {
        if (changePassword1 !== changePassword2) {
          setMismatchingPasswords(true);
          throw new Error('Passwords do not match');
        } else if(!checkPassword(changePassword1)){
          setNotValidPassword(true);
          throw new Error('Password not valid');
        } else {
          await changePassword({
            variables: { newPassword: changePassword1, newPassword2: changePassword2 },
          });
        }
      }
      if (firstName !== '') {
        await changeFirstName({
          variables: { newFirstName: firstName },
        });
      }
      if (lastName !== '') {
        await changeLastName({
          variables: { newLastName: lastName },
        });
      }
      
      if (newUsername !== '') {
        await changeUsername({
          variables: { _id: user._id, newUsername: newUsername },
        });
      }
      if (bio !== '') {
        await addBio({
          variables: { _id: user._id, bio },
        });
      }
      if (profileImage !== null && profileImage !== user.profileImage) {
        await uploadImage({
          variables: { userId: user._id, file: file },
          context: {
            headers: {
              'Access-Control-Request-Headers': 'content-type',
              'x-apollo-operation-name': 'singleUpload',
            },
          },
        });
      }
      setChangePassword1('');
      setChangePassword2('');
      setFirstName('');
      setLastName('');
      setUsername('');
      setBio('');
      setProfileImage(null);
      onClose();
      toggleDataUpdate();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  function checkPassword(str){
    const hasNumber = /\d/.test(str);
    const hasLetter = /[a-zA-Z]/.test(str);
    const hasSpecialSymbol = /[^a-zA-Z0-9]/.test(str);
    const minLength = str.length >= 8;

    return hasNumber && hasLetter && hasSpecialSymbol && minLength;
  }

  
  const handleWebcamCaptureClose = () => {
    setCam(false);
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser();
      onClose();
      navigate('/');
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

  const closeModal = () => {
    setChangePassword1('');
    setChangePassword2('');
    setFirstName('');
    setLastName('');
    setUsername('');
    setBio('');
    setProfileImage(null);
    onClose();
  }

  
 return (
    <Container>
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-15 " onClose={onClose}>
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
                <Dialog.Panel as={DialogPanel}className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 className='font-bold'>Edit Profile</h2>
                  <ModalCloseButton onClick={onClose}>
                    <img src={close} alt="Close" style={{ width: '50px' }} />
                  </ModalCloseButton>
                </div>
                <ImageContainer>
            <img src={profileImage || user_image} alt="ProfileImage" />
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
          <StyledInputContainer>
            <StyledLabel htmlFor="firstName">First Name</StyledLabel>
            <StyledInput
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <StyledLabel htmlFor="lastName">Last Name</StyledLabel>
            <StyledInput
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
<StyledLabel htmlFor="newPassword">Nuova Password</StyledLabel>
<StyledInput
  type="password"
  id="newPassword"
  value={changePassword1}
  onChange={(e) => setChangePassword1(e.target.value)}
/>

<StyledLabel htmlFor="newPassword2">Conferma Password</StyledLabel>
<StyledInput
  type="password"
  id="newPassword2"
  value={changePassword2}
  onChange={(e) => setChangePassword2(e.target.value)}
/>


            {/* Username */}
            <StyledLabel htmlFor="username">Username</StyledLabel>
            <StyledInput type="text" id="username" value={newUsername} onChange={(e) => setUsername(e.target.value)} />
            
            {/* Bio */}
            <StyledLabel htmlFor="bio">Bio</StyledLabel>
            <StyledTextarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          </StyledInputContainer>
        </div>
        
        <div className='ml-auto' style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <ButtonStyledSave style={{ width: '100%' }} onClick={handleSaveChanges}>Salva</ButtonStyledSave>
          <ButtonStyledDelete style={{ width: '100%' }} onClick={handleDeleteUser}>Elimina Profilo</ButtonStyledDelete>
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
         {
    correctlyChanged && <CorrectPopUp text="Modifiche salvate correttamente" />
  }
 {
  notChanged && (
    <CorrectPopUp text="Modifiche salvate correttamente" onClose={
      () => setCorrectlyChanged(false)
    } />
  )
}
{
  mismatchingPasswords && (
    <ErrorPopUp text="Le password non coincidono" onClose={
     () => setMismatchingPasswords(false)
    } />
  )
}
{
  notValidPassword && (
    <ErrorPopUp text="La password non è valida" onClose={
     () => setNotValidPassword(false)
    } />
  )
}

    </Container>
  );
 
 
};

export default EditProfile;