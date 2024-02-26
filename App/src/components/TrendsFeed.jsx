import React, { Fragment } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import SquealsShower from "./SquealsShower";
import { ApolloCache, gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useGlobalState } from "../GlobalStateContext";
import { DotLoader } from "react-spinners";
import { mainColor } from "../const";
import { SectionDescription } from "../constStyles";

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

const GET_TREND_FEED = gql`
  query{
    getTrendingSqueals{
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

const DotContainer = styled.div`
  ${tw`
      flex
      justify-center
      mt-10
      p-8
  `}
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

export default function TrendsFeed({unregisteredUser}){
 const [squeals, setSqueals] = React.useState();
 const {state} = useGlobalState();

 const {error: errorFeed, loading: loadingFeed, data} = useQuery(GET_TREND_FEED);

 React.useEffect(() => {
  if(data){
    setSqueals([...data.getTrendingSqueals]);
  }
 }, [data])
 

 const {loading: loadingMyProfile, error: errorMyProfile, data: dataMyProfile, refetchProfile} = useQuery(GET_MY_PROFILE);
 const [myAccount, setMyAccount] = React.useState();

React.useEffect( ( ) => {
    if(dataMyProfile){
      setMyAccount({...dataMyProfile.getMyAccount})
    }
  }, [dataMyProfile])

 return(
  <SquealContainer>
    <Title>Trends</Title>
    <SectionDescription>In questa sezione, puoi vedere gli squeal di tendenza.</SectionDescription>
    {!loadingFeed ? 
      squeals && <SquealsShower squeals={squeals} my_id={myAccount && myAccount._id} ignoreVisualization={state.unregisteredUser} unregisteredUser={unregisteredUser} />
    : <DotContainer>
        <DotLoader loading={loadingFeed} size={80} color={mainColor} />
      </DotContainer>}
  </SquealContainer>
 )
 //funzione che fa chiamata
}