import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChannelComponent from "../components/ChannelComponent";
import Navbar from "../components/Navbar";
import Trending from "./Trending";
import { PageContainer } from "./HomePage";
import Header from "../components/Header";
import { ResponsiveDisappearDiv } from "./HomePage";
import MainButton from "../components/MainButton";
import { CenterTitle } from "../constStyles";
import styled from "styled-components";
import channelIm from "../images/channel.jpeg";
import userOut from "../images/user_outlined.png";
import messageIcon from "../images/message_icon_outlined.png"
import { mainColor } from "../const";
import { useInView } from "react-intersection-observer";
import { DotLoader, ClipLoader } from "react-spinners";
import tw from "twin.macro";

const GET_ALL_CHANNELS = gql`query getAllChannels($pageNumber: Float!){
    getAllChannels(pageNumber: $pageNumber){
      name
      description
      squeals
      partecipants
      description
      _id
      channelImage
      channelType
    }
  }
`;


const ChannelCard = styled.div`
  width: 30%;
  height: 400px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-radius: 30px;
  box-shadow: 0px 0px 5px 2px #00000044;
  transition: 0.3s; 

  .first-icon{
    margin-top: auto;
    margin-bottom: 5px;
   }
  &:hover {
    box-shadow: 0px 0px 5px 2px ${mainColor}88;
  }

  @media(max-width:576px){
    width: 260px;
    margin-left: 8%;
  }
`;
const ChannelImage = styled.img`
  width: 105px;
  height: 105px;
  border: 1px solid gray;
  border-radius: 50%;
  margin-top: 20px;
  @media(max-width:576px){
    width: 110px;
    height: 110px;
  }
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
  margin-top: 10px;
  color: ${mainColor};
  &.blueColor{
    color: #3399ff;
  }
  @media(max-width:576px){
    font-size: 20px;
    text-align: left;
  }
`;

const IconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  


  
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin: 0 5px;

`;

const Bio = styled.div`
overflow: hidden;
text-overflow: ellipsis;
width: 100%;
  font-size: 14px;
  padding: 0 10px;
    margin-top: 8px;
    text-align: left;
    margin-left: 10px;
    @media(max-width:576px){
        margin-top: 15px;
        margin-bottom: 12px;
    }
`;

const ButtonStyled = styled.button`
  background-color: ${mainColor};
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 80%;
  margin-bottom: 13%;
  margin-top:10px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #006c38;
  }
    @media(max-width:576px){
        margin-bottom: 8%;
    }
`;
const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
`;

const ContainerAll = styled.div`
    width: 50%;
    margin: auto;
    @media(max-width:576px){
        width: 80%;
        
    }
    `;

    const DotContainer = styled.div`
    ${tw`
        flex
        justify-center
        mt-10
        p-8
    `}
  `
   

const ChannelPage = () => {
  const [channels, setChannels] = useState([]);
  const [pageNumber, setPage] = useState(0);
  const [blockCallback, setBlock] = React.useState(false);
  const { loading, error, data } = useQuery(GET_ALL_CHANNELS, {
    variables: { pageNumber: pageNumber },
  });

  useEffect(() => {
    if (data && data.getAllChannels) {
      if(channels.length == 0){        
        setChannels([...data.getAllChannels]);
      } else{
        if(data.getAllChannels.length == 0) setBlock(true);
        else{
          setChannels((prevArray) => [...prevArray, ...data.getAllChannels])
        }
      }
    }
  }, [data]);

  const {ref: lastChannelRef, inView: lastVisible} = useInView();

  React.useEffect(() => {
    if(lastVisible){
      fetchOther();
    }
  }, [lastVisible])

  if (error) return <p>Error :</p>;

  const redirectToChannel = (channelName) => {
      window.location.href = `/app/channelShower/${channelName}`;
      };

  function fetchOther(){
    if(!blockCallback) setPage(prevNumber => prevNumber + 1);
  }

  return (
    <div>
    <Header menuPage={"canali"}/>
    <PageContainer>
          <Navbar currentPage={"canali"} />
          <ContainerAll>
      <CenterTitle className="mt-8">Lista Canali</CenterTitle>
        {loading && channels.length == 0 &&
          <DotContainer>
            <DotLoader loading={loading} size={80} color={mainColor} />
          </DotContainer>
          }
        {channels.length > 0 && <CardContainer>
      {channels.map((channel, index) => (
        <ChannelCard key={channel._id} ref={index == channels.length - 1 ? lastChannelRef : null}>
          <ChannelImage src={ channel.channelImage || channelIm } alt={channel.name} />
          {channel.name && (channel.name == channel.name.toLowerCase() ) && <Title className="themeColor">§{channel.name}</Title>}
        {channel.name && (channel.name != channel.name.toLowerCase() ) && <Title className="blueColor">§{channel.name}</Title>}
        <Bio>{channel.description}</Bio>
            <IconsContainer className="mr-auto ml-3 first-icon">
            <Icon src={userOut} alt="Utenti" />
            <span style={{ fontSize: '14px' }}>Utenti: {channel.partecipants.length}</span>
            </IconsContainer>
            <IconsContainer className="mr-auto ml-3">
            <Icon src={messageIcon}alt="Squeals" />
            <span  style={{ fontSize: '14px' }}>Squeals: {channel.squeals.length}</span>
            </IconsContainer>
          <ButtonStyled onClick={() => redirectToChannel(channel.name)}>Vai al canale</ButtonStyled>
        </ChannelCard>
      ))}
       </CardContainer>}
      {loading && channels.length > 0 &&
        <DotContainer>
          <ClipLoader loading={loading} size={80} color={mainColor} />
        </DotContainer>
      }
    </ContainerAll>
        <ResponsiveDisappearDiv>
        <Trending unregisteredUser={false}/>
       </ResponsiveDisappearDiv>
    </PageContainer> 
    </div>
  );
};

export default ChannelPage;