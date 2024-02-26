import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import channelImage from '../images/channel.jpeg';
import tw from 'twin.macro';
import FriendsChannelsPU from './FriendsChannelsPU';
import EditProfile from './PickSMM';
import SquealsShower from './SquealsShower';
import { gql, useMutation, useQuery } from '@apollo/client';
import { GET_MY_ACCOUNT } from './ProfileContainer';
import { ButtonStyled, FriendButton, WaitingButton, CheckIcon, WaitingIcon} from './ProfileContainer';
import checkIcon from '../images/check.png';
import waiting from '../images/waiting.png';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment} from 'react'
import CorrectPopUp from './CorrectMessage';
import ErrorPopUp from './ErrorMessage';
import EditChannel from './EditChannel';
import { useGlobalState } from '../GlobalStateContext';

export const CircularImage = styled.div`
  width: 15vh;
  height: 15vh;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 ;
  border: 1px solid;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }

  @media (max-width: 767px) {
    width: 30vw;
    height: 30vw;
  }
`;

const ChannelContainerWrapper = styled.div`
  ${tw`
    rounded
  `}
  padding: 20px;
  width: 40%;
  @media (max-width:576px){
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    padding-top:0;
  }
`;


const Tab = styled.span`
  cursor: pointer;
  position: relative;

  &:hover::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: green; 
    bottom: 0;
    left: 0;
  }
`;



const GET_CHANNEL_SQUEALS = gql`
query getSquealsByChannel($channelId: String!){
  getSquealsByChannel(channelId: $channelId){
    squeal{
      reactions{
        type
        user{
          _id
        }
      }
      views
      _id
      text
      uploadedFile
      typeOfUpload
      classification
      channelName
      keyword
      comments{
        text
        user{
          nome
          cognome
          username
          profileImage
        }
        date
      }
      publicationDate
      geolocation{
        latitude
        longitude
      }
    }
    user{
      username
      profileImage
      nome
      cognome
      _id
      typeOfUser
    }
  }
}
`;

const CHECK_USER_REQUEST = gql`
 query checkChannelRequest($channelId: String!){
    checkChannelRequest(channelId: $channelId)
  }
`;

const SEND_CHANNEL_REQUEST = gql`
  mutation sendChannelRequest($channelId: String!){
    sendChannelRequest(channelId: $channelId)
  }
`


const ChannelComponent = ({ channel }) => {

  const [channelRequestCorrect, setChannelRequestCorrect] = React.useState(false);
  const [channelRequestError, setChannelRequestError] = React.useState(false);

  const [isUsersModalOpen, setUsersModalOpen] = useState(false);
  const [channelSqueals, setChannelSqueals] = useState([]);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const [userReq, setUserReq] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  let [isOpenRemove, setIsOpenRemove] = useState(false)
  let [isOpenAdd, setIsOpenAdd] = useState(false)
  const [user, setUser] = useState();
  const [isEditChannel, setIsEditChannelOpen] = useState(false);
  const isPublic = channel.channelType === 'CANALE_SQUEALER';
  const isBlocked = channel.isBlocked;

  const { loading: loadingCurrentUser, error: errorCurrentUser, data: dataUser } = useQuery(GET_MY_ACCOUNT);
  const [sendChReq, {loading: loadingReqC, data: dataReqC, error: errorReqC}] = useMutation(SEND_CHANNEL_REQUEST, {
    onCompleted: () => {
      setChannelRequestCorrect(true);
      setTimeout( ( ) => {
        setChannelRequestCorrect(false);
      }, 1500)
    },
    onError: () => {
      setChannelRequestError(true);
      setTimeout( ( ) => {
        setChannelRequestError(false);
      }, 1500)
    }
  });
  useEffect(() => {
    if (dataUser && dataUser.getMyAccount) {
      setUser({ ...dataUser.getMyAccount })
    }
  }, [dataUser])
  

  const openRemove = () => {
    setIsOpenRemove(true);
  }

  const openAdd = () => {
    setIsOpenAdd(true);
  }

  const closeAdd = () => {
    setIsOpenAdd(false);
  }

  const closeRemove = () => {
    setIsOpenRemove(false);
   }

   const closeEditChannel = () => {
    setIsEditChannelOpen(false);
    }

    const openEditChannel = () => {
      setIsEditChannelOpen(true);
    }



  const { loading: loadingSqueals, error: errorSqueals, data: dataSqueals } = useQuery(GET_CHANNEL_SQUEALS, {
    variables: { channelId: channel._id },
  });


  useEffect(() => {
    if (dataSqueals) {
      setChannelSqueals([...dataSqueals.getSquealsByChannel]);
    }
  }, [dataSqueals]);
  const { loading: loadingReq, error: errorReq, data: dataReq } = useQuery(CHECK_USER_REQUEST, {
    variables: { userId: user?._id, channelId: channel?._id },
  });
  useEffect(() => {
    //check if the user is subscribed to the channel
    if (user && channel && channel.partecipants && channel.partecipants.includes(user.username)) {
      setIsUserSubscribed(true);
    }
  
    //check if the user is admin of the channel
    if (user && channel.owners.includes(user._id)) {
      setIsUserAdmin(true);
    }
  
    //check if the user has already sent a request to join the channel
    if(user && dataReq && dataReq.checkChannelRequest) {
      setUserReq(true);
    }
  }, [user, channel, dataReq]);

  const openUsersModal = () => {
    setUsersModalOpen(true);
  };

  const closeUsersModal = () => {
    setUsersModalOpen(false);
  };

  function sendChannelRequest(){
    sendChReq({
      variables: {
        channelId: channel._id
      }
    })
    setIsOpenAdd(false);
    window.location.reload();
  }
  const {state, dispatch} = useGlobalState();
  return (
   <ChannelContainerWrapper className="col-span-1 md:col-span-2 md:ml-7 relative">
      {(!isUserSubscribed && !isUserAdmin && !userReq && !isPublic && !isBlocked) &&
       <ButtonStyled className="absolute top-0 right-0 mt-3 mr-2" onClick={openAdd}>
        <p className="text-sm">Iscriviti</p>
      </ButtonStyled>}

      {(isUserSubscribed  && !isUserAdmin && !isPublic && !isBlocked) && <FriendButton className="absolute top-0 right-0 mt-3 mr-2" onClick={openRemove}>
        <CheckIcon src={checkIcon} alt="Check Icon" className="ml-1 " /> <p className="text-sm">Iscritto</p>
      </FriendButton>}
      { (userReq && !isUserAdmin && !isPublic && !isBlocked) && <WaitingButton className="absolute top-0 right-0 mt-3 mr-2" ><WaitingIcon src={waiting} className='ml-1'/><p className="text-sm">Richiesta Inviata</p>
      </WaitingButton>}
      {isUserAdmin && !isBlocked && <ButtonStyled className="absolute top-0 right-0 mt-3 mr-2" onClick={openEditChannel}>
        <p className="text-sm">Modifica</p>
      </ButtonStyled>}

      <div className="mt-7">
        <div className="flex items-start">
          <div className="ml-2">
            <div className="mb-3">
            <CircularImage>
  <img
    src={ channel.channelImage || channelImage}
    alt="Immagine canale"
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
</CircularImage>
            </div>
          </div>
          <div className="mr-auto ml-6 mt-4">
            <div>
              <p className="text-3xl font-bold">{channel.name}</p>
              <div className="flex mt-1">
                  { !isPublic &&  <Tab
                        onClick={openUsersModal}
                        className="text-sm text-gray-500 cursor-pointer"
                    >
                        <span className="font-bold text-black">{channel.partecipants.length}</span> Iscritti
                    </Tab>}
                    <Tab className="text-sm ml-2 text-gray-500 cursor-pointer">
                        <span className="font-bold text-black">{channel.squeals.length}</span> Squeals
                    </Tab>
                    </div>
            </div>
          </div>
        </div>
        {channel.description && (
          <p
            style={{ marginTop: '0.5rem', marginLeft: '1rem'}}
            className="text-sm "
          >
            {channel.description}
          </p>
        )}
      </div>
      
      <div className="text-center mt-2 mb-0">
        {isUsersModalOpen && (
          <div isOpen={isUsersModalOpen} onRequestClose={closeUsersModal}>
            <FriendsChannelsPU type="Iscritti" data={channel.partecipants} onClose={closeUsersModal} channel={channel}/>
          </div>
        )}
      </div>
      <div className='text-center mt-2 mb-0'>
          <p className='font-bold'>Squeals</p>
      </div>
      {
        (isUserSubscribed || isUserAdmin || isPublic ) && !isBlocked && channelSqueals && <SquealsShower my_id={user && user._id} squeals={channelSqueals} ignoreVisualization={state.unregisteredUser ? false : true} unregisteredUser={state.unregisteredUser}/>
      }
      {
        (!isUserSubscribed && !isUserAdmin && !isPublic && !isBlocked) && <p className='text-center text-sm text-gray-400 mt-2 mb-0'>Iscriviti al canale per vedere gli Squeals</p>
      }
      {
        isBlocked && <p className='text-center text-sm text-gray-400 mt-2 mb-0'>Il canale è stato bloccato</p>
      }
      {isOpenRemove && 
          <Transition appear show={isOpenRemove} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeRemove}>
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
                    Rimuovi iscrizione
                  </Dialog.Title>
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-500">
                      Sei sicuro di voler rimuovere l'iscrizione al canale?
                    </p>
                  </div>
                    <div className="mt-4 flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                     
                    >
                      Si
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={closeRemove}
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
       {isOpenAdd && 
          <Transition appear show={isOpenAdd} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeAdd}>
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
                    Iscriviti al canale
                  </Dialog.Title>
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-500">
                      Sei sicuro di volerti iscrivere al canale?
                    </p>
                  </div>
                    <div className="mt-4 flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={sendChannelRequest}
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
      <EditChannel  
        isOpen={isEditChannel}
        onClose={closeEditChannel}
        channel={channel}
      />
      {channelRequestCorrect && <CorrectPopUp text="Richiesta inviata con successo!"/>}
      {channelRequestError && <ErrorPopUp text="Richiesta non inviata." />}
    </ChannelContainerWrapper>
  );
};

export default ChannelComponent;
