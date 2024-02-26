import styled from "styled-components";
import React, { useState } from "react";
import searchIcon from "../images/search.png"
import cancelIcon from "../images/cancel.png"
import UserTypeResult from "./UserTypeResult";
import tw from 'twin.macro';
import { mainColor } from "../const";
import { useMutation, gql, useQuery } from '@apollo/client';
import ChannelDetails from "./ChannelDetails";
import ErrorPopUp from "./ErrorMessage";
import css from "styled-components";
import ChannelComponent from "./ChannelComponent";
import ProfileContainer from "./ProfileContainer";
import { GET_USER_BY_ID } from "./UserTypeResult";
import { useEffect } from "react";
import { useLazyQuery } from '@apollo/client';
import KeywordShower from "../main_pages/KeywordShower";
import SquealsShower from "./SquealsShower";
import { GET_MY_ACCOUNT } from "./ProfileContainer";
import { useNavigate } from "react-router-dom";
import { actionTypes, useGlobalState } from "../GlobalStateContext";


const GET_SQUEALS_BY_TEXT = gql`
query getSquealsByText($text: String!){
  getSquealsByText(text: $text){
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
    }
  }
}
`;

export const GET_USER_BY_USERNAME = gql`
query getByUsername($username: String!) {
  getByUsername(username: $username) {
    __typename
    ... on BasicUser {
      _id,
      nome,
      cognome,
      username,
      profileImage,
      friends,
      channels,
      bio
    }
    ... on SMMUser {
      _id
      
    }
    ... on SquealerUser {
      _id
    
    }
  }
}
`;

const GET_CHANNEL_BY_NAME = gql`
query getChannelByName($name: String!) {
  getChannelByName(name: $name) {
    _id
    name
    channelImage
    description
    partecipants
    squeals
    owners
    channelType
    isBlocked
  }
}
`;

const GET_TEMP_CHANNEL = gql`
query getTemporaryChannel($keyword: String!){
  getTemporaryChannel(keyword: $keyword){
    _id
    keyword
    expireAt
    channelType
    squeals
  }
}
`;

const GET_TEMP_CHANNEL_TRY = gql`
query getTemporaryChannel($keyword: String!){
  getTemporaryChannel(keyword: $keyword){
    _id
    keyword
    expireAt
    channelType
    squeals
  }
}
`;

const GET_CHANNEL_BY_ID = gql`
query getChannelById($_id: String!){
  getChannelById(_id: $_id){
     _id
    name
    channelImage
    description
    partecipants
    squeals
    owners
    keyword
    channelType
    isBlocked
  }
}
`;


const CLEAR_HISTORY = gql`
  mutation clearHistory {
    clearHistory
  }
`;

const CLEAR_ONE_HISTORY = gql`
  mutation clearOneHistory($historyId: String!) {
    clearOneHistory(historyId: $historyId)
  }
`;
const ADD_HISTORY_TO_USER = gql`
mutation addHistoryToUser($historyId: String!, $type: String!){
  addHistorytoUser(historyId: $historyId, type:$type)
}
`;
const StyledInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 41%;
  margin: 0 auto;
  z-index: 1;
  position: fixed;
  top: 40px;
  left: 29.5%;
  
  
  .xicon {
    position: absolute;
    right: 3%;
    top: 50%;
    transform: translateY(-50%);
  }

  .searchIcon {
    position: absolute;
    left: 22%;
    top: 50%;
    transform: translateY(-50%);
    @media(max-width: 576px){
      left:30%;
    }

  }

  .selectType {
    position: absolute;
    top: 50%;
    left: 3%;
    transform: translateY(-50%);
    select {
      text-align: center;
      padding: 4px 6px;
      border: none;
      border-bottom: 1px solid #cbd5e0;
      border-radius: 0;
      font-size: 15px;
      outline: none;
     
    }
    @media(max-width: 576px){
      width:2%;
    }
    

  }

  @media (max-width: 576px){
    width: 96%;
    margin-top: 10px;
    left: 1%;
  }
  
`;
const ButtonStyled = styled.div`
  color: black;
  border: none;
  font-weight: bold;
  ${tw`
    px-2
  `}
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    color: ${mainColor};
  }

`;

const RemoveButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    color: ${mainColor};
  }
`;

const StyledInput = styled.input`
  width: 100%;
  outline: none;
  font-size: 18px;
  padding: 10px 15px;
  border: 2px solid #cbd5e0;
  border-radius: 25px;
  transition: border-color 0.3s ease, color 0.3s ease;
  padding-left: 28%;

  &:focus {
    border-color: ${mainColor};
  }

  &::placeholder {
    color: #a0aec0;
  }
  @media (max-width: 576px){
    padding-left: 38%;
  }

`;

const SearchIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;


`;

const CancelIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;

`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 2vh;
  max-width: 100%;
  width: 50%;

  @media (max-width: 576px){
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
`;


const ResultContainer = styled.div`
  width: 40%; /* Imposta la larghezza massima desiderata */
  margin: 0 auto; /* Centra il contenuto */
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border: 1px solid #cbd5e0;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  margin-top: 15px;
  @media (max-width: 576px){
    width: 96%;
    margin-top:30px;
  }
`;

const ProfileContainerWrapper = styled.div`
width: 80%;
margin-left: 40%;
position: absolute;
overflow-y: auto;
max-height: 90vh;
border: none;
margin-top: 15px;
top: 80px;
@media (max-width: 576px){
  width: 96%;
  margin-left: 1%;
}

`;

const ChannelContainerWrapper = styled.div`
width: 80%;
margin-left: 40%;
position: absolute;
overflow-y: auto;
max-height: 90vh;
border: none;
margin-top: 15px;
top: 80px;

@media (max-width: 576px){
  width: 96%;
  margin-left: 1%;
}
`;

const SquealContainerWrapper = styled.div`
width: 40%; 
margin-right: 2%;
position: absolute;
overflow-y: auto;
max-height: 90vh;
border: none;
top: 40px;
margin-left: 3%;
@media (max-width: 576px){
  width: 96%;
  margin-top:14%;
}
`;

const NoHistoryText = styled.p`
  ${tw`
    font-light
    pt-3
    text-sm
  `}
  color: #a0aec0;
`;

const StyledUl = styled.ul`
  list-style: none;
  padding: 0;
  text-align: center;
`;

const StyledLi = styled.li`
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer; /* Imposta il cursore come pointer */
`;
const ResultText = styled.p`
  color: #a0aec0;
`;



export default function SearchComponent({ history }) {
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("user");
  const [cancel, showCancel] = useState(true);
  const [searchHistory, setSearchHistory] = useState([]);
  const [clearHistoryMutation] = useMutation(CLEAR_HISTORY);
  const [clearOneHistoryMutation] = useMutation(CLEAR_ONE_HISTORY);
  const [addHistoryToUserMutation] = useMutation(ADD_HISTORY_TO_USER);
  const [notFoundUser, setNotFoundUser] = useState(false);
  const [notFoundChannel, setNotFoundChannel] = useState(false);
  const [showChannel, setShowChannel] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [getById, setGetById] = useState(false);
  const [showKeyword, setShowKeyword] = useState(false);
  const [showSqueals, setShowSqueals] = useState(false);

  React.useEffect(() => {
    if (history) {
      setSearchHistory([...history]);
    }
  }, [history]);
 
  const navigate = useNavigate();
  const [getUserById, {  data: dataUserId }] = useLazyQuery(GET_USER_BY_ID);
  const [getChannelById, {  data: dataChannelId }] = useLazyQuery(GET_CHANNEL_BY_ID);
  const [getTempChannel, {  data: dataTempChannel }] = useLazyQuery(GET_TEMP_CHANNEL_TRY);
  const [getSquealsByText, {  data: dataSqueals }] = useLazyQuery(GET_SQUEALS_BY_TEXT);
  const [getUserByUsername, { loading: userLoading, data: userData }] = useLazyQuery(GET_USER_BY_USERNAME);
  const [getChannelByName, { loading: channelLoading, data: channelData }] = useLazyQuery(GET_CHANNEL_BY_NAME);
  const [getTempChannelByName, { loading: tempChannelLoading, data: tempChannelData }] = useLazyQuery(GET_TEMP_CHANNEL);
  
  
  const {loading: loadingCurrentUser, error: errorCurrentUser, data : dataUser, refetch} = useQuery(GET_MY_ACCOUNT);
  const [currentUser, setCurrentUser] = useState();
  useEffect( () => {
    if(dataUser && dataUser.getMyAccount){
      setCurrentUser({...dataUser.getMyAccount})
    }
  }, [dataUser])

  const {state, dispatch} = useGlobalState();

  function toggleDataUpdate(){
    dispatch({
      type: actionTypes.SET_NEW_HISTORY,
      payload: 'profileData'
    })
    refetch();
  }


  const handleClickItem = async (itemType, objectId) => {
    switch (itemType) {
      case "user":
        setShowResult(false);
        setShowChannel(false);
        setShowKeyword(false);
        if(objectId !== undefined){
           await getUserById({ variables: { _id: objectId } });
        }
        const user =  await getUserById({ variables: { _id: objectId } });

        if(user !== undefined){
          const username = user.data.getUserById.username;
          navigate(`/profileShower/${username}`);
        }  
        
        setShowUserProfile(true);
        setGetById(true);
        break;
      case "channels":
        setShowResult(false);
        setShowUserProfile(false);
        setShowKeyword(false);
        if(objectId !== undefined){
           await getChannelById({ variables: { _id: objectId } });
        }
        setGetById(true);
        setShowChannel(true);
        break;
      case "keyword":
        setShowResult(false);
        setShowUserProfile(false);
        setShowChannel(false);
        if(objectId !== undefined){
          await getTempChannel({ variables: { keyword: objectId } });
        }
        setGetById(true);
        setShowKeyword(true);
        break;
      case "Squeals":
        setShowResult(false);
        setShowUserProfile(false);
        setShowChannel(false);
        setShowKeyword(false);
        if(objectId !== undefined){
          await getSquealsByText({ variables: { text: objectId } });
        }
        setGetById(true);
        setShowSqueals(true);
        break;
        default:
        break;
    }
  };
  

  const handleSearch = () => {
    showCancel(true);
    setNotFoundChannel(false);
    setShowChannel(false);
    setNotFoundUser(false);
    setShowResult(true);
    setShowUserProfile(false);
    setShowKeyword(false);
    setShowSqueals(false);
    setGetById(false);
  };

  const handleCancel = () => {
    setSearch("");
    showCancel(false);
    setShowChannel(false);
    setShowResult(true);
    setShowUserProfile(false);
    setShowKeyword(false);
    setGetById(false);
    setShowSqueals(false);
  };

  const handleClearHistory = () => {
    clearHistoryMutation();
    setSearchHistory([]);
  };

    
  const handleRemoveHistoryItem = async (historyId) => {
    try {
      await clearOneHistoryMutation({
        variables: { historyId },
      });

      const updatedHistory = searchHistory.filter((item) => item.id !== historyId);
      setSearchHistory(updatedHistory);
      toggleDataUpdate();
    } catch (error) {
      console.error("Errore durante la cancellazione dell'elemento dalla cronologia:", error);
    }

  };
  
  const handleAddHistory = async () => {
    showCancel(true);
    let alreadyInHistory = false;
    try {
      let historyId = "";
  
      // Aggiorna i dati utilizzando le query lazy
      switch (searchType) {
        case "user":
         const user =  await getUserByUsername({ variables: { username: search } });
          if (user != undefined) {
            historyId = user.data.getByUsername._id;
            
          } else {
            setNotFoundUser(true);
            setSearch("");
            return;
          }
          break;
        case "channels":
          const channel = await getChannelByName({ variables: { name: search } });
          if (channel != undefined) {
            historyId = channel.data.getChannelByName._id;
          } else {
            setNotFoundChannel(true);
            setSearch("");
            return;
          }
          break;
        case "keyword":
          const tempChannel = await getTempChannelByName({ variables: { keyword: search } });
          if (tempChannel != undefined) {
            historyId = tempChannel.data.getTemporaryChannel.keyword;
          } else {
            setNotFoundChannel(true);
            setSearch("");
            return;
          }
          break;
        case "Squeals":
         const squeals =  await getSquealsByText({ variables: { text: search } });
          if (squeals != undefined) {
            historyId = search;  // Ovvero, puoi decidere quale valore utilizzare
          } else {
            setNotFoundChannel(true);
            setSearch("");
            return;
          }
          break;
        default:
          break;
      }
  
      if (searchHistory.some(item => item.id === historyId && item.type === searchType)) {
        alreadyInHistory = true;
        handleSearch();
      }
      if(!alreadyInHistory){
        await addHistoryToUserMutation({
          variables: {
            historyId: historyId,
            type: searchType,
          },
        });
    
        setSearchHistory([{ id: historyId, type: searchType }, ...searchHistory]);
        toggleDataUpdate();
     }
  
      // Imposta le flag in base al tipo di ricerca
      switch (searchType) {
        case "channels":
          setNotFoundChannel(false);
          setShowResult(false);
          setShowChannel(true);
          break;
        case "user":
          setNotFoundUser(false);
          setShowResult(false);
          setShowUserProfile(true);
          break;
        case "keyword":
          setNotFoundChannel(false);
          setShowResult(false);
          setShowKeyword(true);
          break;
        case "Squeals":
          setNotFoundChannel(false);
          setShowResult(false);
          setShowSqueals(true);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error adding history to user:', error);
    }
  };
  

  const handleSearchHistory = async () => {
    showCancel(true);
    setShowResult(false);
    setShowChannel(false);
    setShowUserProfile(false);
    setShowKeyword(false);
    setGetById(false);
    setShowSqueals(false);
    handleAddHistory();
  };

  return (
    <SearchContainer>
      <StyledInputContainer >
      <StyledInput
        type="search"
        id="searchBar"
        placeholder="Search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearchHistory();
          }
        }}
      />
        <label htmlFor="searchBar" className="selectType">
          <select
            name="type"
            id="type"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="user">User</option>
            <option value="channels">Channels</option>
            <option value="keyword">Keywords</option>
            <option value="Squeals">Squeals</option>
          </select>
        </label>
        <label htmlFor="searchBar" className="xicon">
          <CancelIcon src={cancelIcon} onClick={handleCancel} alt="Cancel Icon"/>
        </label>
        <label htmlFor="searchBar" className="searchIcon">
          <SearchIcon src={searchIcon} alt="Search Icon" onClick={handleSearchHistory} />
        </label>
       
      </StyledInputContainer>
      { showResult && <ResultContainer>
          <ResultText>Ricerche recenti</ResultText>
          {searchHistory.length === 0 && (
            <NoHistoryText>Cerca nuovi utenti, canali, keywords o squeals</NoHistoryText>
          )}
          <ButtonStyled className="absolute top-0 right-0 mt-3 mr-2" onClick={handleClearHistory}>
            <p className="text-sm">Cancella tutto</p>
          </ButtonStyled>
          <StyledUl className="mt-3">
            {searchHistory && (
              searchHistory.map((item) => {
                switch (item.type) {
                  case "user":
                    return (
                      <StyledLi 
                      key={item.id}
                       >
                        <div onClick={() => handleClickItem(item.type, item.id)}>
                          <UserTypeResult userId={item.id} onClick={() => handleClickItem(item.type, item.id)}/>
                        </div>
                        <RemoveButton onClick={() => handleRemoveHistoryItem(item.id)}>
                          <p> x </p>
                        </RemoveButton>
                      </StyledLi>
                    );
                  case "channels":
                    return (
                      <StyledLi
                       key={item.id}
                       >
                        <div onClick={() => handleClickItem(item.type, item.id)}>
                        <ChannelDetails channelId={item.id} />
                        </div>
                        <RemoveButton onClick={() => handleRemoveHistoryItem(item.id)}>
                          <p> x </p>
                        </RemoveButton>
                      </StyledLi>
                    );
                  case "keyword":
                    return (
                      <StyledLi key={item.id}>
                        <p className="font-bold ml-3 pr-2" onClick={() => handleClickItem(item.type, item.id)}>
                          #{item.id}
                        </p>
                        <RemoveButton onClick={() => handleRemoveHistoryItem(item.id)}>
                          <p> x </p>
                        </RemoveButton>
                      </StyledLi>
                    );
                  case "Squeals":
                    return (
                      <StyledLi key={item.id}>
                        <p className="font-bold ml-3 pr-2" onClick={() => handleClickItem(item.type, item.id)}>
                           {item.id}
                        </p>
                        <RemoveButton onClick={() => handleRemoveHistoryItem(item.id)}>
                          <p> x </p>
                        </RemoveButton>
                      </StyledLi>
                    );
                  default:
                    return null;
                }
              })
            )}
          </StyledUl>
        </ResultContainer>}
      {notFoundUser && <ErrorPopUp text="Utente non trovato" />}
      {notFoundChannel && <ErrorPopUp text="Canale non trovato" />}
      {showChannel &&  navigate(`/channelShower/${channelData &&  channelData.getChannelByName.name}`)}
      {showUserProfile && navigate(`/profileShower/${ userData && userData.getByUsername.username}`)}
      {showKeyword && (
        <SquealContainerWrapper>
          <KeywordShower
            channel={getById ? ( dataTempChannel.getTemporaryChannel ) : tempChannelData.getTemporaryChannel}
          />
        </SquealContainerWrapper>
      )}
      {showSqueals && <SquealContainerWrapper><SquealsShower  squeals={getById ? dataSqueals.getSquealsByText : dataSqueals.getSquealsByText} my_id={currentUser && currentUser._id} ignoreVisualization={state.unregisteredUser ? false : true}/></SquealContainerWrapper>}
    </SearchContainer>
  );
}
