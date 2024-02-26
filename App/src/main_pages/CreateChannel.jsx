/*

    Nome 
    Descrizione
    Tipo (pubblico, privato)
    Immagine
    keyword?
*/

import React from 'react';
import Navbar from '../components/Navbar';
import styled from 'styled-components';
import channel from '../images/channel.jpeg';
import { useState, useRef } from 'react';
import tw from "twin.macro";
import { mainColor } from '../const';
import MainButton from "../components/MainButton";
import ImageModal from '../components/ImageModal';
import { WebcamCapture } from '../components/WebcamCapture';
import CorrectPopUp from '../components/CorrectMessage';
import ErrorPopUp from '../components/ErrorMessage';
import FormField from '../components/FormField';
import Cookies from "js-cookie";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment} from 'react'
import {useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import Trending from './Trending';
import { PageContainer } from './HomePage';
import Header from '../components/Header';
import { ResponsiveDisappearDiv } from './HomePage';
import { actionTypes, useGlobalState } from '../GlobalStateContext';
import { GET_MY_ACCOUNT } from './Profile';

export const GET_CURRENT_USER = gql`
  query getCurrentUser($token: String!){
    getCurrentUser(token: $token)
  }
`;

export const CREATE_CHANNEL = gql`
mutation createChanel($channelInfo: NewChannelArgs!, $file: Upload ){
    createChannel(channelInfo: $channelInfo, file: $file){
        _id
        description
      }
  }
`;

const UPLOAD_IMAGE = gql`
mutation uploadChannelImage($channelId: String!, $file: Upload!){
    uploadChannelImage(channelId: $channelId, file: $file)
  }
`;


const Title = styled.div`
  color: ${mainColor};
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 40px;
  
  @media (max-width: 576px){
    font-size: 35px;
    margin-bottom:20px;
  }

`

const PageChannelContainer = styled.div`
  ${tw`
      flex
      flex-col
      items-center
      mt-5
  `}
  width: 50%;

  @media (max-width: 576px){
    width: 100%;
  }
  
`

const ImageContainer = styled.div`
  display: flex;
  width: full;
  justify-content: center;


  img{
    width: 130px;
    height: 130px;
    border: 1px solid black;
    margin-bottom: 20px;
    border-radius: 50%;
  }
`


const CustomForm = styled.form`
  ${tw`
      w-full
  `}

  padding-inline: 20%;


  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 576px){
    padding-inline: 5%;
  }
`



const ButtonRow = styled.div`
  ${tw`
      flex
      justify-between
      items-center
  `}
  width: 50%;
  margin-bottom: 20px;

`

const Appendix = styled.div`
  ${tw`
      w-full 
      ml-2
  `}
  font-size: 14px;

`

const BiographyContainer = styled.div`
  ${tw`
      w-full
      mt-2
  `}

  .red{
    color: red;
  }
`

const SmallTitle = styled.div`
  ${tw`
      ml-3
  `}
  color: black;
  font-weight: 500;
  font-size: 18px;


  .optional{
    opacity: 0.8;
  }
  @media (max-width: 576px){
    font-size: 16px;
  }
`

const StyledText = styled.textarea`
  ${tw`
      w-full
  `}
  height: 150px;
  border: 1px solid ;
  color: black;
  border-radius: 15px;

  font-size: 16px;


  &:focus{
    outline: none; // Remove the default focus outline
    box-shadow: 0px 0px 1px 1px ;
  }

  /* Adjust text position */
  padding: 10px; // Add padding to the input
  margin: 5px 0 0 5px; // Adjust margin for the text position
  box-sizing: border-box; // Include padding and border in the element's total width and height
`

const ButtonStyled = styled.button`
  background-color: ${mainColor};
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-bottom:8%;

  &:hover {
    background-color: ##006c38;
  }
`;


export default function CreateChannel() {

    const navigate = useNavigate();
    const maxChars = 250;
    const [image, setImage] = useState();
    const [description, setDescription] = useState("");
    const [remainingChars, setRemaining] = useState(maxChars);
    const [file, setFile] = useState();
    const fileInputRef = useRef(null);
    const [completed, setCompleted] = useState(false);
    const [notCompleted, setNotCompleted] = useState(false);
    const [showCam, setCam] = useState(false);
    const [channelName, setChannelName] = useState("");
    let [isOpenAdd, setIsOpenAdd] = useState(false)
    const [openPurchase, setOpenPurchase] = useState(false);

    const token = Cookies.get('accessToken');
    const {loading: loadingCurrentUser, error: errorCurrentUser, data : dataUser, refetch} = useQuery(GET_MY_ACCOUNT);
    

    const [createChannel, {loading, error, data}] = useMutation(CREATE_CHANNEL);

    const openAdd = () => {
      setIsOpenAdd(true);
    }

    const closePurchase = () => {
      setOpenPurchase(false);
    }

    const openPurchaseModal = () => {
      setOpenPurchase(true);
    }

  
    const closeAdd = () => {
      navigate('/home');
      setIsOpenAdd(false);
    }

    const [user, setUser] = useState();
    let userType = "";
    useEffect( () => {
      if(dataUser && dataUser.getMyAccount){
        setUser({...dataUser.getMyAccount})
        userType = dataUser.getMyAccount.userType;
        if (userType === "VIP") {
          setIsOpenAdd(false);
        } else {
          setIsOpenAdd(true);
        }
      }
    }, [dataUser])
    
    const {state, dispatch} = useGlobalState();

    function toggleDataUpdate(){
      dispatch({
        type: actionTypes.SET_NEW_CHANNEL,
        payload: 'profileData'
      })
      refetch();
    }
  
   

    async function createNewChannel() {
      closePurchase();
      if (channelName) {
          // Aggiungi il controllo per verificare se il nome del canale contiene una lettera maiuscola
          if (/[A-Z]/.test(channelName)) {
              // Mostra un messaggio di errore se il nome del canale contiene una lettera maiuscola
              setNotCompleted(true);
              setTimeout(() => {
                  setNotCompleted(false);
              }, 2000);
              
              return; // Esce dalla funzione se il controllo non passa
          }
  
          // Resto del codice per la creazione del canale...
          await createChannel({
              variables: {
                  channelInfo: {
                      name: channelName,
                      description: description,
                      channelType: "CANALE_UTENTI"
                  },
                  file: file
              },
              context: {
                  headers: {
                      'Access-Control-Request-Headers': 'content-type',
                      'x-apollo-operation-name': 'singleUpload',
                  },
              },
          });
  
         toggleDataUpdate();
  
          setCompleted(true);
          setTimeout(() => {
              setCompleted(false);
              const navigatePath = `/channelShower/${channelName}`;
              navigate(navigatePath);
          }, 2000);
  
      } else {
       //close the modal
        
          setNotCompleted(true);
          setTimeout(() => {
              setNotCompleted(false);
          }, 2000);
      }
  }

    function handleFileUpload(event) {
      event.preventDefault(); 
        fileInputRef.current.click();
    }

  function convertToBase64(file) {
    setFile(file);

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const base64String = e.target.result;
        setImage(base64String);
      };

      reader.readAsDataURL(file);
    }
  }

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (file) {
      setFile(file);
      convertToBase64(file);
    }
  }

  function handleDescription(event){
    const {value} = event.target;
    if (value.length <= maxChars){
      setDescription(value);
      setRemaining(maxChars - value.length);
    }
  }

  const showWebcam = () => { 
    setCam(true);
  };

  const handleWebcamCaptureClose = () => {
    setCam(false);
  };



    return(
      <div>
      <Header menuPage={"createChannel"}/>
          <PageContainer>
            <Navbar currentPage="createChannel"/>
            {  !isOpenAdd && <PageChannelContainer>
                <Title >
                  Crea un nuovo canale
                </Title>
                  <CustomForm >
                      <ImageContainer>
                      <img src={image || channel} alt="ChannelImage" />
                      </ImageContainer>
                      <ButtonRow >
                      <MainButton 
                        width="48%;" 
                        text="Selfie" 
                        fullButton={false} 
                        active={true} 
                        onClickFunction={(e) => {
                          e.preventDefault();
                          showWebcam();
                        }}
                      />
                      <MainButton width="48%;" text="Carica" fullButton={true} active={true} onClickFunction={handleFileUpload}/>
                      <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={(event) => handleFileChange(event)}
                      />
                      </ButtonRow>
                          <FormField 
                          name="Nome canale" 
                          value={channelName}
                          handler={(e) => setChannelName(e.target.value)}
                          inputName="username"
                          textColor={channelName && true}
                          width={"100%;"}
                      />
                      <BiographyContainer>
                      <SmallTitle>
                          Descrivi il canale con qualche parola <span className="optional">(opzionale)</span>
                      </SmallTitle>
                      <StyledText value={description} onChange={handleDescription}>

                      </StyledText>
                      {remainingChars > 0 ? <Appendix>Caratteri rimanenti: {remainingChars}</Appendix> : <Appendix className="red">Hai esaurito i caratteri per la descrizione!</Appendix>}
                      </BiographyContainer>
                    <ButtonStyled type="button" onClick={(e) => { e.preventDefault(); openPurchaseModal(); }}>Acquista Canale </ButtonStyled>
                  </CustomForm>
                  {showCam && (
                      <ImageModal onClose={handleWebcamCaptureClose}>
                      <WebcamCapture onCaptureComplete={(capturedImage) => convertToBase64(capturedImage)}  onClose={handleWebcamCaptureClose}/>
                      </ImageModal>
                  )}
                     {openPurchase &&
          <Transition appear show={openPurchase} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closePurchase}>
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    Completa Acquisto
                  </Dialog.Title>
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-500">
                    Sei sicuro di voler acquistare questo canale per €5?
                    </p>
                  </div>
                    <div className="mt-4 flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={createNewChannel}
                    >
                      Si
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={closePurchase}
                    >
                      No
                    </button>
                  </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      }
                  {
                      completed && <CorrectPopUp text="Canale creato con successo"/>
                  }
                  {
                      notCompleted && <ErrorPopUp text="Errore durante la creazione del canale"/>
                  }
    
                  </PageChannelContainer>
                  
                  } 
                  {isOpenAdd &&
          <Transition appear show={isOpenAdd} as={Fragment}>
          <Dialog as="div" className="relative z-15" onClose={closeAdd}>
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    Errore
                  </Dialog.Title>
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-500">
                     Devi essere un utente VIP per poter creare un canale. Vuoi diventarlo?
                    </p>
                  </div>
                    <div className="mt-4 flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={() => navigate('/vipSubscription')}
                    >
                      Si
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={closeAdd}
                    >
                      No
                    </button>
                  </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      }
        
     
        <ResponsiveDisappearDiv>
        <Trending unregisteredUser={false}/>
       </ResponsiveDisappearDiv>
    </PageContainer> 
    </div>

    );
}