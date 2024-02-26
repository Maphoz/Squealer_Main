import React, { useState } from 'react';
import styled from 'styled-components';
import noImage from '../images/no_image.jpeg'; 
import { useQuery, gql } from '@apollo/client';
import tw from 'twin.macro';
import { useNavigate } from "react-router-dom";
import addRemove from '../images/addRemove.png';
import { Dialog, Transition } from '@headlessui/react'
import { useMutation } from '@apollo/client';
import { Fragment} from 'react'
import { GET_MY_ACCOUNT } from './ProfileContainer';
import { useEffect } from 'react';
const ADD_ADMIN = gql`
mutation addAdminChannel($channelId: String!, $username: String!){
  addAdminChannel(channelId:$channelId, username: $username)
}
`;

const REMOVE_FROM_CHANNEL = gql`
mutation removeUserFromChannel($channelId: String!, $username: String!){
  removeUserFromChannel(channelId: $channelId, username: $username){
    partecipants
  }
}
`;

export const GET_USER_BY_USERNAME = gql`
  query getByUsername($username: String!) {
    getByUsername(username: $username) {
      __typename
      ... on BasicUser {
      _id
        nome
        cognome
        username
        friends 
        channels
        profileImage
        bio
        
      }
      ... on SMMUser {
        nome
        cognome
        username
      }
      ... on SquealerUser {
        nome
        cognome
        username
      }
    }
  }
`;

const FriendDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  flex-wrap: nowrap;
  &:hover {
    cursor: pointer;
  }
`;


const FriendDetailsText = styled.div`
  margin-left: 30px;
  margin-top: 5px;
  margin-right: 20px;
  max-height: 100%;
  overflow: hidden;

  p:first-child {
    font-weight: bold; 
  }

  p:last-child {
    margin-top: 0;
    color: gray; 
    ${tw`
    font-medium
  `}
  }
`;

const ProfileImageContainer = styled.div`
  width: 5vh;
  height: 5vh;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid;
  margin-right: 5px;
  margin-left: 5px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }
`;

const AddRemoveContainer = styled.div`
  width: 2vh;
  height: 2vh;
  border-radius: 50%;
  overflow: hidden;
  margin-left: auto;
  margin-right:20px;

  `;

const FriendDetails = ({ friendUsername, channel = undefined}) => {
  const navigate = useNavigate();
  const {loading: loadingCurrentUser, error: errorCurrentUser, data : dataUser} = useQuery(GET_MY_ACCOUNT);
  const [currentUser, setCurrentUser] = useState();
  useEffect( () => {
    if(dataUser && dataUser.getMyAccount){
      setCurrentUser({...dataUser.getMyAccount})
    }
  }, [dataUser])

  const { loading, error, data } = useQuery(GET_USER_BY_USERNAME, {
    variables: { username: friendUsername },
  });

  let [isOpenAdd, setIsOpenAdd] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null);

  const [addAdminChannel] = useMutation(ADD_ADMIN);
  const [removeUserFromChannel] = useMutation(REMOVE_FROM_CHANNEL);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  

  const handleUserClick = (username) => {
    navigate(`/profileShower/${username}`);
  };

  let isUserAdmin = false;
  const friendId = data && data.getByUsername._id;
  if (friendId !== undefined && channel && channel.owners) {
    isUserAdmin = channel.owners.includes(friendId);
  }


  const openAdd = () => {
    setIsOpenAdd(true);
  };

  const closeAdd = () => {
    setIsOpenAdd(false);
    setSelectedAction(null);
  };

  const handleAction = (selectedAction) => {
    
    if (selectedAction === "makeAdmin") {
      addAdminChannel({variables: {channelId: channel._id, username: friendUsername}})
      //close the modal after the mutation
      closeAdd();

    } else if (selectedAction === "removeFromChannel") {
      removeUserFromChannel({variables: {channelId: channel._id, username: friendUsername}})
    }
    closeAdd();
    //reload the page
    window.location.reload();
  };



  let isCurrentUserAdmin = false;
  const currentUserId = dataUser && dataUser.getMyAccount._id;
  if (currentUserId !== undefined && channel && channel.owners) {
    isCurrentUserAdmin = channel.owners.includes(currentUserId);
  }


  



  const friend = data.getByUsername;
  return (
    <FriendDetailsContainer >
      <ProfileImageContainer onClick={() => handleUserClick(friendUsername)}>
        <img
          src={friend.profileImage ? friend.profileImage : noImage}
          alt="Immagine profilo"
        />
      </ProfileImageContainer>
      <FriendDetailsText onClick={() => handleUserClick(friendUsername)}>
        <p>{friend.nome} {friend.cognome}</p>
        <p>@{friend.username}</p>
      </FriendDetailsText>
      <AddRemoveContainer onClick={openAdd}>
        <img 
          src={addRemove }
          alt="addRemove"
          style={{display: isCurrentUserAdmin ? "block" : "none"}}
        />
      </AddRemoveContainer>
      {(isOpenAdd  && !isUserAdmin) && 
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
                    Opzioni utente
                  </Dialog.Title>
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-500">
                      Scegli l'azione da compiere:
                    </p>
                  </div>
                  <div className="mt-4 space-y-4">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            onClick={() => handleAction("makeAdmin")}
          >
            Rendi Amministratore
          </button>
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            onClick={() => handleAction("removeFromChannel")}
          >
            Rimuovi dal Canale
          </button>
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent bg-blue-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={closeAdd}
          >
            Torna Indietro
          </button>
        </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      }
       {(isOpenAdd  && isUserAdmin) && 
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
                    Opzioni utente
                  </Dialog.Title>
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-500">
                      Non puoi modificare le opzioni di questo utente
                    </p>
                  </div>
                  <div className="mt-4 space-y-4">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent bg-blue-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={closeAdd}
          >
            Torna Indietro
          </button>
        </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      }
    </FriendDetailsContainer>
  );
};

export default FriendDetails;