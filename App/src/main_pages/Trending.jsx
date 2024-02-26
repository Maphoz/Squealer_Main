import React from "react";
import { gql, useQuery } from "@apollo/client";
import channelImage from '../images/channel.jpeg';
import user_image from '../images/user_image.jpg';
import trending from '../images/trending.png';
import { mainColor } from "../const";
import tw from 'twin.macro';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { actionTypes, useGlobalState } from "../GlobalStateContext";


const GET_MOST_POPULAR_USERS = gql`
  query getMostPopularUsers {
    getMostPopularUsers {
      __typename
      ... on BasicUser {
        profileImage
        username
      }
    }
  }
`;

const GET_MOST_POPULAR_CHANNELS = gql`
  query getMostPopularChannels {
    getMostPopularChannels {
      channelImage
      name
    }
  }
`;
const Container = styled.div`
  ${tw`
    p-4 
    rounded-xl
    transition-all
    border
    border-solid
    border-gray-300
    hover:border-green-500
  `}
`;

const Header = styled.div`
  ${tw`
    flex
    items-end
    justify-between
    pr-16
  `}
`;

const Title = styled.h2`
  ${tw`
    text-xl
    font-bold
  `}
`;

const TrendingIcon = styled.img`
  ${tw`
    w-8
    h-8
  `}
`;

const ClickableContainer = styled.div`
  ${tw`
    flex
    items-center
    mb-4
    mt-4
    ml-2
    transition-all
    hover:font-bold
    cursor-pointer
  `}
`;

const UserProfileImage = styled.img`
  ${tw`
    w-8
    h-8
    rounded-full
    mr-3
    border
    border-solid
    border-gray-300
  `}
`;

const Trending = ({unregisteredUser}) => {
  const navigate = useNavigate();
  const {state, dispatch} = useGlobalState();
  unregisteredUser = state.unregisteredUser;
  const { loading: loadingUsers, data: userData } = useQuery(
    GET_MOST_POPULAR_USERS
  );

  const { loading: loadingChannels, data: channelData } = useQuery(
    GET_MOST_POPULAR_CHANNELS
  );

  if (loadingUsers || loadingChannels) {
    return <p>Loading...</p>;
  }

  const mostPopularUsers = userData?.getMostPopularUsers || [];
  const mostPopularChannels = channelData?.getMostPopularChannels || [];

  const handleUserClick = (username) => {
    navigate(`/profileShower/${username}`);
  };

  const handleChannelClick = (channelName) => {
    navigate(`/channelShower/${channelName}`);
  };

  

  return (
    <div className="space-y-6 mt-8 ml-8 mr-4">
      {/* Container for Most Popular Users */}
      <Container>
        <Header>
          <Title>Trending Users</Title>
          <TrendingIcon src={trending} alt="Trending" />
        </Header>
        {mostPopularUsers.map((user, index) => (
          <ClickableContainer key={index} onClick={() => handleUserClick(user.username)}>
            <UserProfileImage
              src={user.profileImage || user_image}
              alt={`Profile of ${user.username}`}
            />
            <span>{user.username}</span>
          </ClickableContainer>
        ))}
      </Container>
  
      {/* Container for Most Popular Channels */}
     {!unregisteredUser && <Container>
        <Header>
          <Title>Trending Channels</Title>
          <TrendingIcon src={trending} alt="Trending" />
        </Header>
        {mostPopularChannels.map((channel, index) => (
          <ClickableContainer key={index} onClick={() => handleChannelClick(channel.name)}>
            <UserProfileImage
              src={channel.channelImage || channelImage}
              alt={`Channel ${channel.name}`}
            />
            <span>{channel.name}</span>
          </ClickableContainer>
        ))}
      </Container>}
      
    </div>
  );
};

export default Trending;