import React, { useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import close from '../images/close.png'
import FriendDetails from './FriendDetails';
import { useQuery } from '@apollo/client';
import ChannelDetails from './ChannelDetails';
import { useEffect } from 'react';
import { client } from '../index';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment} from 'react'
import { mainColor } from '../const';
import { Container } from './EditProfile';

const ModalContainer = styled.div`
  position: fixed;
  top: 37%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: white;
  border: 2px solid #279314;
  max-width: 300px;
  width: 100%;
  text-align: center;
  border-radius: 10px;
  max-height: 50vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  margin: 0;
  ${tw`
    font-bold
  `}
`;

export const ModalCloseButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const ModalFilterInput = styled.input`
  width: 100%;
  margin-bottom: 5px;
  padding: 8px;
  border: 1px solid ${mainColor};
  border-radius: 5px; /* Aggiunto il bordo arrotondato */


`;

const DialogPanel = styled.div`

  max-height: 700px;
  overflow-y: auto;
  @media (max-width: 575px) {
    overflow-y: auto;
    max-height: 600px;
  }
`;



const FriendsChannelsPU = ({ type, data, onClose , channel}) => {
  const [filter, setFilter] = useState('');
  const isFriend = type === 'friends' || type === 'Iscritti';
  
  
  const filteredData = isFriend
    ? data.filter(item => item.toLowerCase().includes(filter.toLowerCase()))
    : data.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));


  return (
    <Container>
     <Transition appear show={true} as={Fragment}>
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
                  <Dialog.Panel as={DialogPanel} className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <ModalHeader>
                    <ModalTitle>{type}</ModalTitle>
                    <ModalCloseButton onClick={onClose}>
                      <img src={close} alt="Close" style={{ width: '50px' }} />
                    </ModalCloseButton>
                  </ModalHeader>
                    <ModalFilterInput
                            type="text"
                            placeholder={`Search...`}
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                          />
                          <ul style={{ gap: '10px' }}>
                            {isFriend && filteredData.map(username => (
                              <FriendDetails key={username} friendUsername={username}  channel={channel} />
                            ))}
                          {!isFriend && filteredData.map(channel => (
                            <ChannelDetails key={channel.name} channelId={channel._id} channelName={channel.name} />
                          ))}
                          </ul>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>


    </Container>
  );
};



export default FriendsChannelsPU;