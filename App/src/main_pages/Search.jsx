
import React from "react";
import Navbar from "../components/Navbar"
import SearchComponent from "../components/SearchComponent";
import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { useEffect } from "react";
import ProfileContainer from "../components/ProfileContainer";
import Trending from "./Trending";
import { PageContainer } from "./HomePage";
import { useGlobalState } from "../GlobalStateContext";
import Header from "../components/Header";
import { ResponsiveDisappearDiv } from "./HomePage";

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
    typeOfUser
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



const Search = () => {

  const {loading: loadingCurrentUser, error: errorCurrentUser, data : dataUser} = useQuery(GET_MY_ACCOUNT);
  const [user, setUser] = useState();

  useEffect( () => {
    if(dataUser && dataUser.getMyAccount){
      setUser({...dataUser.getMyAccount})
    }
  }, [dataUser])

  const [history, setHistory] = useState([]);
  useEffect(() => {
    if(user && user.history){
      setHistory([...user.history])
    }
  }, [user])
  
  const {state} = useGlobalState();
  return (
    <div>
      <Header />
      <PageContainer>
      <Navbar currentPage={"search"} />
       { history && <SearchComponent history={history}/>}
       <ResponsiveDisappearDiv>
        <Trending unregisteredUser={false}/>
       </ResponsiveDisappearDiv>
    </PageContainer> 
    </div>
  );
};

export default Search;