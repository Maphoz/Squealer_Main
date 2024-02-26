import React from 'react';
import styled from 'styled-components';
import noImage from '../images/no_image.jpeg'; 
import { useQuery, gql } from '@apollo/client';
import tw from 'twin.macro';
import channelImage from '../images/channel.jpeg';
import { useNavigate } from "react-router-dom";

export const GET_CHANNEL_BY_ID = gql`
  query getChannelById($_id: String!){
    getChannelById(_id: $_id){
      name,
      channelImage
    }
  }
`;

const ChannelDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  flex-wrap: nowrap;
`;


const ChannelDetailsText = styled.div`
  margin-left: 20px;
  margin-right: 20px;
  max-height: 100%;
  overflow: hidden;

  p:first-child {
    font-weight: bold; 
  }
  &:hover {
    cursor: pointer;
  }
`;

const ChannelImageContainer = styled.div`
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

const ChannelDetails = ({ channelId }) => {
  const navigate = useNavigate();

  const handleChannelClick = (channelName) => {
    navigate(`/channelShower/${channelName}`);
  };

  const { loading, error, data } = useQuery(GET_CHANNEL_BY_ID, {
    variables: { _id: channelId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const channel = data.getChannelById;
  return (
    <ChannelDetailsContainer onClick={() => handleChannelClick(channel.name)}>
      <ChannelImageContainer>
        <img
          src={channel.channelImage ? channel.channelImage : channelImage}
          alt="Immagine profilo"
        />
      </ChannelImageContainer>
      <ChannelDetailsText>
        <p>{channel.name}</p>
      </ChannelDetailsText>
    </ChannelDetailsContainer>
  );
};

export default ChannelDetails;