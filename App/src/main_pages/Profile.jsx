import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import ProfileContainer from "../components/ProfileContainer";
import Navbar from "../components/Navbar"
import Cookies from "js-cookie";
import Trending from "./Trending";
import { useActionData, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PageContainer, ResponsiveDisappearDiv } from "./HomePage";
import { actionTypes, useGlobalState } from "../GlobalStateContext";
import Header from "../components/Header";
import { MessageContainer, NoItems } from "../constStyles";
import roundAlert from "../images/alertIcon.png"
import MainButton from "../components/MainButton";


export const GET_CURRENT_USER = gql`
  query getCurrentUser($token: String!){
    getCurrentUser(token: $token)
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
    squeals 
    history{
      id
      type
    }
  }
  }
 
}

`;


const ProfilePage = () => {
  const navigate = useNavigate();
  //call the get my account query
  const {loading: loadingCurrentUser, error: errorCurrentUser, data : dataUser, refetch} = useQuery(GET_MY_ACCOUNT);
  const [user, setUser] = useState();

  useEffect( () => {
    if(dataUser && dataUser.getMyAccount){
      setUser({...dataUser.getMyAccount})
    }
  }, [dataUser])

  const {state, dispatch} = useGlobalState();

  const handleRefetched = () => {
    dispatch({
      type: actionTypes.TOGGLE_DATA_UPDATE,
      payload: 'profileData',
    });
  }
  
  React.useEffect( () => {
    if(state.dataUpdated.profileData){
      refetch();
      handleRefetched();
    }
  }, []);

  return (
    <div>
      <Header />
        <PageContainer>
          <Navbar currentPage={"profile"} unregisteredUser={state.unregisteredUser}/>
        {
          user && <ProfileContainer  user={user || null} isUserProfile={true} unregisteredUser={state.unregisteredUser}/>
        }
        {
          state.unregisteredUser && 
        <NoItems>
          <img src={roundAlert} />
          <MessageContainer>
            <span>Per visualizzare il tuo profilo devi essere registrato!</span>
          </MessageContainer>
          <MainButton fs={'20px;'} active={true} text="Registrati" fullButton={true} onClickFunction={() => {navigate('/registration');}}/>
        </NoItems>
        }
        <ResponsiveDisappearDiv>
        <Trending unregisteredUser={state.unregisteredUser}/>
       </ResponsiveDisappearDiv>
    </PageContainer> 
    </div>
  );
};

export default ProfilePage;