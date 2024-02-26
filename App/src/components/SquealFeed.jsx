import React, { Fragment } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { GeolocCharCost, ImgCharCost, VideoCharCost, getMin, getTarif, mainColor, temporizedTimeFramesString } from "../const";
import image_icon from "../images/image_icon.png"
import time_icon from "../images/time_icon.png"
import video_icon from "../images/video_icon.png"
import position_icon from "../images/position_icon.png"
import profile_icon from '../images/user_image.jpg';
import SquealsShower from "./SquealsShower";
import { fakeSqueals } from "../const";
import { Dialog, Transition } from "@headlessui/react";
import MainButton from "../components/MainButton";
import no_image from '../images/user_image.jpg';
import ImageModal from "../components/ImageModal";
import { WebcamCapture } from "../components/WebcamCapture";
import { ApolloCache, gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ClipLoader, DotLoader } from "react-spinners";
import cancelIcon from "../images/cancel.png"
import selectedIcon from "../images/selectedIcon.png"
import { GoogleMap, Marker, MarkerF, useLoadScript } from "@react-google-maps/api";
import delete_icon from "../images/cancel.png"
import { CenterTitle, InfoTextContainer } from "../constStyles";
import CorrectPopUp from "./CorrectMessage";
import ErrorPopUp from "./ErrorMessage";
import news_icon from "../images/newsIcon.png"
import quoteIcon from "../images/quoteIcon.png"
import { ResponsiveDisappearDiv } from "../main_pages/HomePage";
import NewSquealComponent from "./NewSqueal";
import { useGlobalState } from "../GlobalStateContext";

const DotContainer = styled.div`
  ${tw`
      flex
      justify-center
      mt-10
      p-8
  `}
`

const SquealContainer = styled.div`
  margin-top: 40px;
  width: 50%;
  padding-left: 40px;
  padding-right: 40px;

  @media (max-width: 576px) {
    width: 100%;
    padding-inline: 15px;
    margin-top: 10px;
  }
`

const GET_MY_SQUEALS = gql`
query getUserFeed($pageNumber: Float!){
  getUserFeed(pageNumber: $pageNumber){
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

const GET_PUBLIC_FEED = gql`
query getPublicFeed($pageNumber: Float!){
  getPublicFeed(pageNumber: $pageNumber){
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


const GET_MY_PROFILE = gql`
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
    caratteri_giornalieri_rimanenti
    caratteri_settimanali_rimanenti
    caratteri_mensili_rimanenti
    caratteri_acquistabili_rimanenti
    profileImage
    friends
    popularityIndex
    channels
    bio
    squeals 
    history{
      id
      type
    }
  }
}
}
`



export default function SquealFeed({unregisteredUser}){
  const {state} = useGlobalState();
  const [page, setPage] = React.useState(0);


  
  //!unregisteredUser ? GET_MY_SQUEALS : PUBLIC_FEED
  const {loading: loadingSqueals, error: errorSqueals, data: dataSqueals} = useQuery(!unregisteredUser ? GET_MY_SQUEALS : GET_PUBLIC_FEED, {
    variables: {
      pageNumber: page
    }
  });
  const {loading: loadingMyProfile, error: errorMyProfile, data: dataMyProfile, refetchProfile} = useQuery(GET_MY_PROFILE);
  //else la chiamata per public feed
  const [squeals, setSqueals] = React.useState([]);
  const [myAccount, setMyAccount] = React.useState();

  React.useEffect( ( ) => {
    if(!unregisteredUser && dataSqueals){
      if(squeals.length == 0){
        setSqueals([...dataSqueals.getUserFeed]);
      }
      else{
        setSqueals((prevArray) => [...prevArray, ...dataSqueals.getUserFeed])
      }
    }
  }, [dataSqueals, unregisteredUser]);

  React.useEffect( ( ) => {
    if(unregisteredUser && dataSqueals){
      setSqueals([...dataSqueals.getPublicFeed]);
    }
  }, [dataSqueals, unregisteredUser]);


  React.useEffect( ( ) => {
    if(dataMyProfile){
      setMyAccount({...dataMyProfile.getMyAccount})
    }
  }, [dataMyProfile])
  

  function fetchOther(){
    setPage(prevPage => prevPage + 1);
  }

  return(
    <SquealContainer>
      {unregisteredUser && <CenterTitle>Squealer</CenterTitle>}
      {!unregisteredUser && 
      <ResponsiveDisappearDiv>
        <NewSquealComponent mapLoaded={true}/>
      </ResponsiveDisappearDiv>}
      {squeals.length > 0 && <SquealsShower unregisteredUser={unregisteredUser} squeals={squeals} my_id={myAccount ? myAccount._id : null} ignoreVisualization={false} fetchOther={() => fetchOther()}/>}
      {loadingSqueals && squeals.length == 0 &&
      <DotContainer>
        <DotLoader loading={loadingSqueals} size={80} color={mainColor} />
      </DotContainer>
      }
      {!state.unregisteredUser && loadingSqueals && squeals.length > 0 &&
      <DotContainer>
        <ClipLoader loading={loadingSqueals} size={80} color={mainColor} />
      </DotContainer>
      }
    </SquealContainer>
  )
}