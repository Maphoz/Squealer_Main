import React, { useState } from 'react';
import styled from 'styled-components';
import no_image from '../images/no_image.jpeg';
import tw from 'twin.macro';
import FriendsChannelsPU from './FriendsChannelsPU';
import EditProfile from './EditProfile';
import { GET_CURRENT_USER } from '../main_pages/Profile';
import Cookies from 'js-cookie';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import CorrectPopUp from './CorrectMessage';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment} from 'react'
import checkIcon from '../images/check.png'
import { useEffect } from 'react';import ErrorPopUp from './ErrorMessage';
import SquealsShower from "../components/SquealsShower";
import waiting from "../images/waiting.png";
import vipIcon from "../images/vipIcon.png"
import MainButton from './MainButton';
import { mainColor } from '../const';
import PickSMM from './PickSMM';
import { useNavigate } from 'react-router-dom';
import { actionTypes, useGlobalState } from '../GlobalStateContext';
import options from '../images/settings.png';
import close from '../images/close.png';
import { ModalCloseButton } from './FriendsChannelsPU';
import { GoogleMap, Marker, MarkerF, useLoadScript } from "@react-google-maps/api";

const LOGOUT = gql`
mutation logout{
  logout
}
`;  
const ADD_FRIEND =  gql`
  mutation addFriend($userUsername: String!, $friendUsername: String!){
    addFriend(userUsername: $userUsername, friendUsername: $friendUsername)
  }
`;

const REMOVE_FRIEND =  gql`
  mutation removeFriend($userUsername: String!, $friendUsername: String!){
    removeFriend(userUsername: $userUsername, friendUsername: $friendUsername)
  }
`;

const SEND_FRIEND_REQUEST = gql`
  mutation sendFriendRequest($friendId: String!){
    sendFriendRequest(friendId: $friendId)
  }
`;

const GET_CHANNEL_BY_ID = gql`
query getChannelById($_id: String!){
  getChannelById(_id: $_id){
     _id
    name
    channelImage
    description
    partecipants
    squeals
  }
}
`;

const GET_USER_PUBLIC_SQUEALS = gql`
  query getUserPublicSqueals($senderId: String!){
    getUserPublicSqueals(senderId: $senderId){
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
        destinationChannels
        channelName
        isPublic
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
        typeOfUser
      }
    }
  }

    `;

export const CircularImage = styled.div`
  width: 15vh;
  height: 15vh;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
  border: 1px solid;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }

  @media (max-width: 576px) {
    margin-top: 15px;
    width: 25vw;
    height: 25vw;
  }
`;

const ProfileContainerWrapper = styled.div`
  ${tw`
    rounded
  `}
  width: 48%;
  padding: 20px;

  @media (max-width:576px){
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    padding-top:0;
  }
`;

const ButtonDivContainer = styled.div`
  ${tw`
      absolute
      top-0
      right-0
      mt-3
      mr-2
      flex
      flex-col
  `}

  .desktop-button {
    ${tw`block`}

    @media (max-width: 576px) {
      ${tw`hidden`}
    }
  }

  .mobile-button {
    ${tw`hidden`}

    @media (max-width: 576px) {
      ${tw`block`}
    }
  }
`
export const ButtonStyled = styled.div`
  color: ${mainColor};
  border: 1px solid ${mainColor};
  ${tw`
    px-2
    mb-2
  `}
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background-color: ${mainColor};
    color: white;
    transition: 0.3s ease-in-out;
  }
  @media (max-width: 576px) {
    margin-top: 0.5rem;
    width: 20%;
  }
`;

export const ButtonStyledSMM = styled.div`
  color: red;
  border: 1px solid red;
  ${tw`
    px-6
    mb-2
  `}
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background-color: red;
    color: white;
    transition: 0.3s ease-in-out;
  }
  @media (max-width: 576px) {
    margin-top: 0.5rem;
    width: 20%;
  }
`;

export const WaitingButton = styled.div`
color: #279314;
border: 1px solid #279314;
${tw`
  px-2
`}
cursor: pointer;
border-radius: 8px;
display: flex;
align-items: center; 
justify-content: center; 
@media (max-width: 576px) {
  margin-top: 0.5rem;
  width: 20%;
}
`;


export const FriendButton = styled.div`
  background-color: #279314;
  color: white;
  ${tw`
    px-2
  `}
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center; 
  justify-content: center; 
  position: relative;
  width: 12%;
  margin-left: auto;  
  margin-top: 0;
  margin-bottom: 0;
  &:hover {
    background-color: red;
    color: white;
  }
  @media (max-width: 576px) {
    margin-top: 0.5rem;
    width: 20%;
  }
`;

export const CheckIcon = styled.img`
  width: 10px;
  height: 10px;
  margin-left: 1px;  
`;

export const WaitingIcon = styled.img`
  width: 15px;
  height: 15px;
  margin-left: 1px;
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
export const GET_MY_ACCOUNT = gql`
query getMyAccount{
  getMyAccount{
     __typename
  ... on BasicUser {
    _id
    email
    username
    nome
    cognome
    userType
    caratteri_giornalieri
    caratteri_settimanali
    caratteri_mensili
    profileImage
    friends
    popularityIndex
    channels
    bio

    history{
      id
      type
    }
  }
 
}
}

`;

const GET_SQUEALS_BY_USER = gql`
query getSquealReturnByUserId($profileId: String!){
  getSquealReturnByUserId(profileId: $profileId){
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
      destinationChannels
      isPublic
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
    }
  }
}
    `;

const NameDiv = styled.div`
  ${tw`
      flex
      items-center
  `}

  img{
    width: 30px;
    height: 30px;
    margin-left: 5px;
  }

  p{
    @media (max-width: 576px) {
      ${tw`text-2xl`}
    }
  }

  
`

const CHECK_FRIEND_REQUEST = gql`
  query checkFriendRequest($receiverId: String!){
    checkFriendRequest(receiverId: $receiverId)
  }
`;

const BioContainer = styled.div`  
    margin-top: 0.5rem;
    margin-left: 1rem;

    width:60%;
    ${tw`
      text-sm
      w-full
    `}

`;




const ProfileContainer = ({ user, isUserProfile, unregisteredUser }) => {
  //reload 
  const navigate = useNavigate();
  const [removeFriendMutation, { loading, error }] = useMutation(REMOVE_FRIEND);
  const [addFriendMutation, {loadingAdd, errorAdd}] = useMutation(ADD_FRIEND);
  const [requestError, setRequestError] = useState(false);
  const [requestCorrect, setRequestCorrect] = useState(false);
  const [friendReq, setFriendReq] = useState(false);
  const {state, dispatch} = useGlobalState();
  unregisteredUser = state.unregisteredUser;

  const {loading: loadingCurrentUser, error: errorCurrentUser, data : dataUser, refetch} = useQuery(GET_MY_ACCOUNT);

  const [currentUser, setCurrentUser] = useState();
  useEffect( () => {
    if(dataUser && dataUser.getMyAccount){
      setCurrentUser({...dataUser.getMyAccount})
    }
  }, [dataUser])



  function toggleDataUpdate(){
    dispatch({
      type: actionTypes.SET_ALL_TRUE,
      payload: 'profileData'
    })
    refetch();
  }

  const isVip = currentUser && currentUser.userType == "VIP";
  if(user.username == currentUser?.username){
    isUserProfile = true;
  } else {
    isUserProfile = false;
  }

  
  const [getChannelById, { data: dataChannel }] = useLazyQuery(GET_CHANNEL_BY_ID);

  const [friendRequest, {loading: loadingReq, error: errorReq, data: dataReq}] = useMutation(SEND_FRIEND_REQUEST, {
    onError: (e) => {
      setRequestError(true);
      setTimeout( ( ) => {
        setRequestError(false);
      }, 1500)
    },
    onCompleted: () => {
      setRequestCorrect(true);
      setTimeout( ( ) => {
        setRequestCorrect(false);
      }, 1500)
    }
  });

  const [logoutMutation, { data: dataLogout, loading: loadingLogout, error: errorLogout }] = useMutation(LOGOUT);
    

  const logout = () => {

    logoutMutation().then(() => {
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/app'
    })
    
  }

  const {data} = useQuery(GET_SQUEALS_BY_USER, {
    variables: {profileId: user._id}
  });

  const {data: dataCheck} = useQuery(CHECK_FRIEND_REQUEST, {
    variables: {senderId: currentUser?._id, receiverId: user?._id}
  });

  const{data: dataPulic} = useQuery(GET_USER_PUBLIC_SQUEALS, {
    variables: {senderId: user?._id}
  })
  
  useEffect( () => {
    if(dataCheck && dataCheck.checkFriendRequest){
      setFriendReq(dataCheck.checkFriendRequest)
    }
  }, [dataCheck])

  let [squealDocuments, setSquealDocuments] = useState([]);
  //call this function only if unregistered user is false
  useEffect( () => {
    if(!unregisteredUser && data){
      setSquealDocuments([...data.getSquealReturnByUserId])
    }
  }, [data, unregisteredUser])
  const isCurrentUser = isUserProfile;
  if(!isCurrentUser){
    //filter the squeal documents
    let userChannels = currentUser && currentUser.channels;
    let newArraySqueals = [];
    for(let i = 0; i < squealDocuments.length; i++){
      let squealDoc = squealDocuments[i];
      if(squealDoc.squeal.isPublic == 'true'){
        newArraySqueals.push(squealDoc);
      } else {
        for(let j = 0; j < userChannels.length; j++){
          let channel = userChannels[j];
          if(squealDoc.squeal.destinationChannels.includes(channel)){
            newArraySqueals.push(squealDoc);
            break;
          }
        }
      }
    }
    squealDocuments = newArraySqueals;
  }
 


const [userPublicSqueals, setUserPublicSqueals] = useState([]);
useEffect(() => {
  if(unregisteredUser && dataPulic){
    setUserPublicSqueals([...dataPulic.getUserPublicSqueals])
}
}, [dataPulic,unregisteredUser])

  
  
  const showEditButton = isCurrentUser;
  const showSMMButton = true;
  const showFriendsButton = isCurrentUser;
  const currentUserUsername = currentUser && currentUser.username;
  const isFriend = user.friends.includes(currentUserUsername);


  const [isFriendsModalOpen, setFriendsModalOpen] = useState(false);
  const [isChannelsModalOpen, setChannelsModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [smmModalOpen, setSmmOpen] = useState(false);
  const [addedFriend, setAddedFriend] = useState(false);
  const [removedFriend, setRemoveFriend] = useState(false);
  let [isOpenRemove, setIsOpenRemove] = useState(false)
  let [isOpenAdd, setIsOpenAdd] = useState(false)
  const [isOpenSettings, setIsOpenSettings] = useState(false)
  


  const [editedProfile, setEditedProfile] = useState({
      nome: user.nome,
      cognome: user.cognome,
      username: user.username,
      bio: user.bio,
      profileImage: user.profileImage
  });

  const addFriend = () => {
    if(!isFriend){
      const userUsername = user.username;
      const friendUsername = currentUserUsername;
      friendRequest({
        variables: {
          friendId: user._id
        },
      })
      setAddedFriend(true);
      closeAdd();
      window.location.reload();
    }
  }
  const removeFriend = () => {
    if(isFriend){
      const userUsername = user.username; 
      const friendUsername = currentUserUsername; 
      removeFriendMutation({
        variables: { userUsername, friendUsername },
      })
      setRemoveFriend(true);
      closeRemove();
      window.location.reload();
    } 
  }

  const openRemove = () => {
    setIsOpenRemove(true);
  }

  const openAdd = () => {
    setIsOpenAdd(true);
  }

  const closeAdd = () => {
    setIsOpenAdd(false);
  }

  const openEditModal = () => {
    setIsOpenSettings(false);
    setEditModalOpen(true);
    setChannelsModalOpen(false);
    setSmmOpen(false);
    setFriendsModalOpen(false);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const openFriendsModal = () => {
    setFriendsModalOpen(true);
    setChannelsModalOpen(false);
    setEditModalOpen(false);
    setSmmOpen(false);
  };

  const closeFriendsModal = () => {
    setFriendsModalOpen(false);
  };

  const openChannelsModal = () => {
    setChannelsModalOpen(true);
    setFriendsModalOpen(false);
    setEditModalOpen(false);
    setSmmOpen(false);
  };

  const closeChannelsModal = () => {
    setChannelsModalOpen(false);
  };
  
 const closeRemove = () => {
  setIsOpenRemove(false);
 }

 const openSmmModal = () => {
  setSmmOpen(true);
  setEditModalOpen(false);
  setChannelsModalOpen(false);
  setFriendsModalOpen(false);
};

const purchaseVip = () => {
  setIsOpenSettings(false);
  navigate('/vipSubscription');
}
  

const closeSmmModal = () => {
  setSmmOpen(false);
};

const openSettings = () => {
  setIsOpenSettings(true);
}

const closeSetting = () =>{
  setIsOpenSettings(false)
}

useEffect(() => {
  let channelPromises = [];

  if (user && user.channels) {
    // Iterate through channel squeals and call the query for each
      user.channels.forEach((channel) => {
      channelPromises.push(getChannelById({ variables: { _id: channel } }));
    });

    // Once all promises are resolved, update the state with squeals
    Promise.all(channelPromises)
      .then((results) => {
        const  newChannels = results.map((result) => result.data.getChannelById);
        // Update state with the newSqueals array
        // This will trigger a single re-render
        setChannels(newChannels);
      })
      .catch((error) => {
        console.error("Error fetching squeals:", error);
      });
  }
}, [user, getChannelById]);

const [channels, setChannels] = useState([]);



  return (
    <>
    <ProfileContainerWrapper className="col-span-1 md:col-span-2 md:ml-7 relative">
    <ButtonDivContainer>
  { !unregisteredUser && showEditButton && <ButtonStyled className="desktop-button" onClick={openEditModal}>Edit Profile</ButtonStyled> }
  {!unregisteredUser && isCurrentUser && <ButtonStyledSMM className="desktop-button" onClick={logout}>Logout</ButtonStyledSMM> }
  { !unregisteredUser && isUserProfile && <button className="mobile-button" >
    <img src={options} alt="Options" style={{width: '30px', height: '30px'}} onClick={openSettings}/>
  </button>}
</ButtonDivContainer>
      {(!showFriendsButton && !isFriend && !friendReq && !unregisteredUser) &&
       <ButtonStyled className="absolute top-0 right-0 mt-3 mr-3 " onClick={openAdd}>
        <p className="text-sm">Aggiungi amico</p>
      </ButtonStyled>}

      {(!showFriendsButton && isFriend && !friendReq && !unregisteredUser) && <FriendButton className="absolute top-0 right-0 mt-3 mr-2" onClick={openRemove}>
        <CheckIcon src={checkIcon} alt="Check Icon" className="ml-1 " /> <p className="text-sm">Amici</p>
      </FriendButton>}
      { friendReq && <WaitingButton className="absolute top-0 right-0 mt-3 mr-2" ><WaitingIcon src={waiting} className='ml-1'/><p className="text-sm">Richiesta Inviata</p>
      </WaitingButton>}


      <div className="mt-7">
        <div className="flex items-start">
          <div className="ml-2">
            <div className="mb-3">
            <CircularImage>
  <img
    src={ user.profileImage || no_image}
    alt="Immagine utente"
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
</CircularImage>
            </div>
          </div>
          <div className="mr-auto ml-6 mt-4">
            <div>
              <NameDiv>
                <p className="text-3xl font-bold mr-1">{user.nome} {user.cognome}</p>
                {user && user.userType == "VIP" && <img src={vipIcon} />}
              </NameDiv>
              <p className="mt-1 text-lg font-medium text-gray-500">@{user.username}</p>
              <div className="flex mt-1">
                    <Tab
                        onClick={openFriendsModal}
                        className="text-sm text-gray-500 cursor-pointer"
                    >
                        <span className="font-bold text-black">{user.friends.length}</span> Friends
                    </Tab>
                    <Tab
                         onClick={openChannelsModal}
                        className="text-sm ml-2 text-gray-500 cursor-pointer"
                    >
                        <span className="font-bold text-black">{user.channels.length}</span> Channels
                    </Tab>
                    </div>
            </div>
          </div>
          
        </div>
    {user.bio && (
      <BioContainer
      >
        {user.bio}
      </BioContainer>
    )}
        <div className='text-center mt-2 mb-0'>
          <p className='font-bold'>Squeals</p>
      </div>
      
      </div>
      
      <div className="text-center mt-2 mb-0">
        {isFriendsModalOpen && (
          <div isOpen={isFriendsModalOpen} onRequestClose={closeFriendsModal}>
            <FriendsChannelsPU type="friends" data={user.friends} onClose={closeFriendsModal} />
          </div>
        )}
        {isChannelsModalOpen && (
          <div isOpen={isChannelsModalOpen} onRequestClose={closeChannelsModal}>
            <FriendsChannelsPU type="channels" data={channels} onClose={closeChannelsModal} />
          </div>
        )}
      </div>
      <EditProfile
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          editedProfile={editedProfile}
          setEditedProfile={setEditedProfile}
          user={user}
          //onSave={handleSaveProfile} 
        />
      <PickSMM
          isOpen={smmModalOpen}
          onClose={closeSmmModal}
          user={user}
          //onSave={handleSaveProfile} 
        />
      {removedFriend && <CorrectPopUp text={'Amico rimosso'} /> }
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
                    Rimuovi amico
                  </Dialog.Title>
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-500">
                      Sei sicuro di voler rimuovere 
                      <span className="font-bold"> @{user.username}</span> dagli amici?
                    </p>
                  </div>
                    <div className="mt-4 flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={removeFriend}
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
                    Aggiungi amico
                  </Dialog.Title>
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-500">
                      Sei sicuro di voler aggiungere
                      <span className="font-bold"> @{user.username}</span> agli amici?
                    </p>
                  </div>
                    <div className="mt-4 flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={addFriend}
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
      {isOpenSettings &&   <Transition appear show={isOpenSettings} as={Fragment}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className='font-bold'>Opzioni</h2>
                    <ModalCloseButton onClick={closeSetting}>
                      <img src={close} alt="Close" style={{ width: '50px' }} />
                    </ModalCloseButton>
                  </div>
                  <div className="mt-4 flex-col space-y-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-green-300 w-full px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                          onClick={openEditModal}
                        >
                          Modifica Profilo
                        </button>

                        {!isVip && <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-300 w-full px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          onClick={purchaseVip}
                        >
                          Acquista Vip
                        </button>} 
                        {
                          isVip && <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-300 w-full px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            onClick={purchaseVip}
                            disabled
                          >
                            Già Vip
                          </button>
                        }
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-500 w-full px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
                          onClick={logout}
                        >
                          Logout
                        </button>
                      </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>}
      {
        !unregisteredUser &&  squealDocuments && <SquealsShower squeals={squealDocuments} my_id={currentUser && currentUser._id} ignoreVisualization={unregisteredUser? false : true} unregisteredUser={unregisteredUser}/>
     } 
     {
      unregisteredUser && userPublicSqueals && <SquealsShower squeals={userPublicSqueals} my_id={null} ignoreVisualization={unregisteredUser ? false : true} unregisteredUser={unregisteredUser}/>
     }
  
    </ProfileContainerWrapper>
    {requestCorrect && <CorrectPopUp text="Richiesta inviata con successo" />}
      {requestError && <ErrorPopUp text="Richiesta non inviata" />}
    </>

    
  );
};

export default ProfileContainer;
