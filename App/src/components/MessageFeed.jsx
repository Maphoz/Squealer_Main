import React, { Fragment } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import SquealsShower from "./SquealsShower";
import { ApolloCache, gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useGlobalState } from "../GlobalStateContext";
import { DotLoader } from "react-spinners";
import { mainColor } from "../const";
import { InfoTextContainer, MessageContainer, NoItems, SectionDescription } from "../constStyles";
import roundAlert from "../images/alertIcon.png"

const SquealContainer = styled.div`
  margin-top: 40px;
  width: 50%;
  padding-left: 40px;
  padding-right: 80px;

  @media (max-width: 576px) {
    width: 100%;
    padding-inline: 15px;
    margin-top: 10px;
  }
`

const GET_MESSAGE_FEED = gql`
  query{
    getMessageSqueals{
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
`
const Title = styled.div`
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 30px;
  text-align: center;

  @media(max-width: 576px){
    margin-bottom: 15px;
  }
`
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
const DotContainer = styled.div`
  ${tw`
      flex
      justify-center
      mt-10
      p-8
  `}
`

export default function MessageFeed({unregisteredUser}){
 const [squeals, setSqueals] = React.useState([]);
 const {state} = useGlobalState();

 const {error: errorFeed, loading: loadingFeed, data} = useQuery(GET_MESSAGE_FEED);

 React.useEffect(() => {
  if(data){
    setSqueals([...data.getMessageSqueals])
  }
 }, [data])
 

 const {loading: loadingMyProfile, error: errorMyProfile, data: dataMyProfile} = useQuery(GET_MY_PROFILE);
 const [myAccount, setMyAccount] = React.useState();

  React.useEffect( ( ) => {
    if(dataMyProfile){
      setMyAccount({...dataMyProfile.getMyAccount})
    }
  }, [dataMyProfile])
 return(
  <SquealContainer>
    <Title>Messaggi</Title>
    <SectionDescription>In questa sezione, puoi vedere gli squeal diretti a te.</SectionDescription>
    {loadingFeed && 
    <DotContainer>
      <DotLoader loading={loadingFeed} size={80} color={mainColor} />
    </DotContainer>
    }
    {!loadingFeed && squeals.length > 0 && <SquealsShower squeals={squeals} my_id={myAccount && myAccount._id} ignoreVisualization={state.unregisteredUser} unregisteredUser={unregisteredUser} />}
    {!loadingFeed && squeals.length == 0 && 
      <div className="flex w-full justify-center">
        <NoItems>
          <img src={roundAlert} />
          <MessageContainer>
            <span>Non hai messaggi per te!</span>
          </MessageContainer>
        </NoItems>
        </div>
    }
  </SquealContainer>
 )
 //funzione che fa chiamata
}

