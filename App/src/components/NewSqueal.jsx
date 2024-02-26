import React, { Fragment } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { GeolocCharCost, ImgCharCost, VideoCharCost, getMin, getTarif, greyColor, mainColor, temporizedTimeFramesString } from "../const";
import image_icon from "../images/image.png"
import time_icon from "../images/temporized.png"
import video_icon from "../images/video.png"
import position_icon from "../images/position.png"
import profile_icon from '../images/user_image.jpg';
import { Dialog, Transition } from "@headlessui/react";
import MainButton from "../components/MainButton";
import ImageModal from "../components/ImageModal";
import { WebcamCapture } from "../components/WebcamCapture";
import { gql, useMutation, useQuery } from "@apollo/client";
import selectedIcon from "../images/selectedIcon.png"
import { Autocomplete, GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import delete_icon from "../images/cancel.png"
import CorrectPopUp from "./CorrectMessage";
import ErrorPopUp from "./ErrorMessage";
import news_icon from "../images/news.png"
import quoteIcon from "../images/quote.png"
import { ResponsiveDisappearDiv } from "../main_pages/HomePage";
import { actionTypes, useGlobalState } from "../GlobalStateContext";
import userIcon from "../images/user.png"
import channelIcon from "../images/channel.jpeg"

const ReceiversContainer = styled.div`
  border-radius: 15px;
  width: 100%;
  overflow-y: hidden;
  scrolling-behaviour: smooth;
  background: white;
  display: flex;
  max-height: 500px;

  .columns::-webkit-scrollbar {
    display: none;
  }
  .br{
    border-right: 1px solid lightgreen;
  }

  .closeIcon{
    position: absolute;
    top: 5px;
    right: 10px;
    width: 20px;
    height: 20px;
  }
  z-index: 10;

  @media(max-width:576px){
    top: 20%;
    max-height: 350px;
  }
`

const ReceiversColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0px;
  padding: 0px 10px;
  width: 50%;
  overflow-x: hidden;

`

const ReceiverTitle = styled.div`
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 15px;
`

const ReceiverSearch = styled.input`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid ${greyColor};
  padding: 5px 10px;
  &:focus{
    outline: none;
    border: 1px solid ${mainColor};
    box-shadow: 0px 0px 1px 1px ${mainColor};
  }
`

const Receiver = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 20px 5px 10px;
  justify-content: start;
  color: white;
  border-radius: 15px;
  position: relative;
  cursor: pointer;

  ${props => props.active ? 'color: white;' : 'color: black;'}
  ${props => props.active && 'background-color: #279314bb;'}

  img{
    width: 30px;
    height: 30px;
    margin-right: 10px;
    border-radius: 50%;

  }

  .receiverName{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    width: 100px;
  }

  .selected{
    position: absolute;
    right: -10px;
    width: 25px;
    height: 25px;
  }
`

const MessageReceiversContainer = styled.div`
  ${tw`
      flex
      justify-center
      w-full
  `}
  position: absolute;
  top: 15%;
  background: transparent;
`

const MessageContainer = styled.div`
  ${tw`
      flex
      flex-col
      items-center
      p-3
  `}
  width: 40%;
  background: white;
  border-radius: 10px;

  @media(max-width:576px){
    width: 80%;
  }
`


const GET_RECEIVERS = gql`
  query getReceivers{
    getReceivers{
      channels{
        name
        channelImage
        _id
      }
      friends{
        username
        profileImage
        _id
      }
    }
  }
`

const NewSquealBox = styled.div`
  overflow: hidden;
`

const ButtonActions = styled.div`
  ${tw`
      w-full
      flex
      justify-between
      px-2
      mb-4
  `}
  display: none;

  @media(max-width: 576px){
    display: flex;
  }
`

const TextRow = styled.div`
  display: flex;
  align-items: start;
  margin-left: 15px;
  margin-right: 20px;
  position: relative;
  
  .imgProfile{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 20px;
    border: 1px solid black
  }
  margin-bottom: 50px;

  @media(max-width:576px){
    margin-inline: 5px;
    margin-bottom: 10px;

    .imgProfile{
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
  }
`

const StyledTextarea = styled.textarea`
  box-sizing: border-box;
  resize: none;
  font-size: 18px;
  width: 65%;
  &:focus{
    outline: none;
  }
  margin-right: 10px;

  @media(max-width: 576px){
    width: 100%;
  }
`

const MapContainer = styled.div`
  width: 70%;
  position: relative;
  display: flex;
  justify-content: flex-start;
  .mapNewSqueal{
    width: 350px;
    height: 350px;
  }

  .customComplete{
    position: absolute;
    z-index: 100;
    left: 5px;
    top: 5px;
  }

  .customComplete input{
    padding: 5px 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 5px 1px ${greyColor};
  }

  input:focus{
    outline: none;
  }

  @media(max-width: 576px){
    width: 100%;
    justify-content: start;
    .mapNewSqueal{
      width: 250px;
      height: 250px;
    }
  }
`

const XIcon = styled.img`
  position: absolute;
  right: 5px;
  top: 5px;

  height: 25px;
  width: 25px;

  @media(max-width: 576px){
    height: 20px; 
    width: 20px;
    right: -5px;
  }
`

const ImageSqueal = styled.div`
  width: 70%;
  display: flex;
  justify-content: center;  
  position: relative;
  .squealImage{ 
    width: 80%;
    height: auto;
  }

  @media(max-width: 576px){
    width: 100%;
    
    .squealImage{
      width: 90%;
      height: auto;
    }
  }
`
const VideoSqueal = styled.div`
  position: relative;
  width: 70%;
  display: flex;
  justify-content: center;
  video{
    width: 80%;
    height: auto;
  }

  @media(max-width: 576px){
    width: 100%;
    video{
      width: 90%;
      height: auto;
    }
  }
`

const IconRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 20px;

  @media(max-width: 576px){
    flex-direction: column;
    margin-top: 25px;
  }
`

const IconActionBar = styled.div`
  display: flex;
  padding-left: 10px;

  @media(max-width: 576px){
    margin-left: 10px;
    padding-left: 0px;
    margin-top: 50px;
  }
`

const IconLink = styled.img`
  width: 35px;
  height: 35px;
  padding: 5px;
  border-radius: 10px;

  &:hover{
    background: #eeeeee;
  }

  @media(max-width: 576px){
    margin-right: 5px;
  }
`


const CharBigTitle = styled.div`
  display: none;

  @media(max-width:576px){
    display: block;
    font-size: 18px;
    font-weight: 600;
    color: ${mainColor};
    margin-left: 10px;
    margin-top: 20px;
  }
`

const CharIndicator = styled.div`
  display: flex;
  justify-content: center;

  @media(max-width: 576px){
    margin-top: 10px;
    margin-bottom: 10px;
    justify-content: start;
  }
`

const CharValue = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px 15px;
  line-height: 1.2;

  ${props => props.orange && `color: orange;`}
  ${props => props.red && `color: red;`}
  ${props => (props.orange || props.red) && 'font-weight: 700;'}
`

const CharTitle = styled.div`
  font-size: 14px;
  @media(max-width: 576px){
    font-size: 12px;
  }
`

const CharNumber = styled.div`
  font-size: 16px;
  font-weight: 600;
  @media(max-width: 576px){
    font-size: 14px;
  }
`

const PostButton = styled.button`
  padding: 4px 15px;
  background: ${mainColor};
  color: white;
  font-weight: 600;
  border-radius: 10px;
  border: 1px solid ${mainColor};


  &:hover{
    color: ${mainColor};
    background: white;
    border: 1px solid ${mainColor};
    transition: 0.3s ease-in-out;
  }

  @media(max-width: 576px){
    display: none;
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

const CREATE_SQUEAL = gql`
  mutation createSqueal($squealInput: CreateSquealInput!, $file: Upload){
    createSqueal(squealInput: $squealInput, file: $file)
  }
`
const PURCHASE_CHARS = gql`
  mutation reduceChars($chars: Float!){
    reduceChars(chars: $chars)
  }
`

const IconPost = styled.div`
  position: relative;

  cursor: pointer;
  .tooltip{
      font-size: 10px;
      visibility: hidden;
      background-color: #333;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 3px 6px;
      position: absolute;
      z-index: 1;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.3s;
  }

  &:hover .tooltip{
    visibility: visible;
    opacity: 1;
    z-index: 5;
  }
`


const StyledButton = styled.button`
  color: white;
  ${tw`
    px-2
  `}
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background-color: ${mainColor};
  margin-bottom: 15px;
  margin-right: 0px;

  &:hover {
    color: ${mainColor};
    background-color: white;
    transition: 0.3s ease-in-out;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 10px;
  }

  @media (max-width: 576px) {
    font-size: 14px;
    margin-bottom: 5px;
  }

  border: 1px solid ${mainColor};
`

const CREATE_TEMPORIZED = gql`
  mutation createTemporized($squealInput: CreateSquealInput!, $file: Upload){
    createTemporized(squealInput: $squealInput, file: $file)
  }
`
const TemporizedContainer = styled.div`
    @keyframes slideUp{
      0% {
        bottom: -600px;
      }
      100% {
        bottom: 0px;
      }
    }

  ${tw`
      flex
      justify-center
      w-full
  `}
  position: absolute;
  background: white;
  top: 10%;
  z-index: 10;
  
  @media(max-width:576px){
    height: 600px;
    animation: slideUp 0.3s ease-in-out;
    bottom: 0px;
    top: auto;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
  }
`
const TemporizedForm = styled.div`
  ${tw`
    py-6
    flex
    flex-col
    items-center
  `}
  width: 50%;
  position: fixed;
  border-radius: 15px;
  background: white;

  @media(max-width:576px){
    width:100%;
  }
`
const TemporizedTitle = styled.div`
  font-size: 25px;
  margin-bottom: 10px;
  font-weight: 600;
  margin-left: 5px;
`

const TemporizedTextContainer = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: start;

  @media(max-width:576px){
    width: 90%;
  }
`

const TemporizedTextArea = styled.textarea`
  padding: 10px;
  width: 100%;
  height: 150px;
  border-radius: 10px;
  border: 1px solid ${mainColor};

  @media(max-width:576px){
    height:100px;
    font-size: 16px;
  }
`
const TemporizedRepetition = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45%;

  .choice{
    font-size: 14px;
  }

  .noArrows {
    -moz-appearance: textfield; /* Firefox */
  }
  
  .noArrows::-webkit-inner-spin-button,
  .noArrows::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  .noArrows[type="number"] {
    -moz-appearance: textfield; /* Firefox */
  }
`
const TemporizedInput = styled.input`
  border: 1px solid ${mainColor};
  border-radius: 5px;
  width: 100px;
  text-align: center;
  font-size: 18px;

  @media(max-width:576px){
    font-size: 14px;
    width: 50px;
  }
`


const ChoiceContainer = styled.div`
  ${tw`
      flex
      justify-between
  `}

  width: 60%;
  margin-top: 20px;
`
const TemporizedRow = styled.div`
  ${tw`
      flex
      justify-between
      items-center
      w-full
  `}
  position: relative;

  @media(max-width:576px){
    justify-content: space-around;
  }
`

const InputName = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`

const TextDiv = styled.div`
  ${tw`
      my-2
  `}
  width: 70%;
  text-align: left;

  @media(max-width:576px){
    width:90%;
    font-size: 14px;
  }
`

const TempTextContainer = styled.div`
  font-size: 16px;
  margin-bottom: 30px;

  @media(max-width: 576px){
    font-size: 12px;
    margin-bottom: 5px;
  }

  .red{
    color: red;
  }
`

export default function NewSquealComponent(){
  const {state, dispatch} = useGlobalState();

  const handleRefetched = () => {
    dispatch({
      type: actionTypes.TOGGLE_DATA_UPDATE,
      payload: 'homeData',
    });
  }

  const toggleNewSqueal = () => {
    dispatch({
      type: actionTypes.SET_SELECTED_TRUE,
      payload: ['profileData', 'buyCharacterData']
    })
  }
  
  React.useEffect( () => {
    if(state.dataUpdated.homeData){
      refetchAll();
      handleRefetched();
    }
  }, []);

  function refetchAll(){
    refetchProfile();
    refetchReceivers();
  }
  function closeForm(){
    setTemporized(false);
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
    libraries: ['places']
  });
  const {loading: loadingMyProfile, error: errorMyProfile, data: dataMyProfile, refetch: refetchProfile} = useQuery(GET_MY_PROFILE);

  const {loading: loadingReceivers, error: errorReceivers, data: dataReceivers, refetch: refetchReceivers} = useQuery(GET_RECEIVERS)
  const [createSqueal, {loading: loadingNewSqueal, error: errorNewSqueal, data: dataNewSqueal}] = useMutation(CREATE_SQUEAL, {
    onError : () => {
      setSquealError(true);
      setTimeout( () => {
        setSquealError(false);
      }, 1500)
    },
    onCompleted : () => {
      setCharUsed(0);
      setSquealCorrect(true);
      setImage(null);
      setNewPost('');
      setVideo(null);
      setUserLocation(null);
      refetchProfile();
      toggleNewSqueal();
      setTimeout( () => {
        setSquealCorrect(false);
      }, 1500)
    }
  });
  const [reducePurchasableChars, {loading: loadingPur, error: errorPur, data: dataPur}] = useMutation(PURCHASE_CHARS, {
    onError : () => {
    },
    onCompleted : () => {
      refetchProfile();
    }
  });
  const [squealError, setSquealError] = React.useState(false);
  const [squealCorrect, setSquealCorrect] = React.useState(false);
  const [newPost, setNewPost] = React.useState("");
  const [textRows, setTextRows] = React.useState(1);
  const [showImagePicker, setShowImagePicker] = React.useState(false);
  const [image, setImage] = React.useState();
  const [selectedVideo, setVideo] = React.useState();
  const [charUsed, setCharUsed] = React.useState(0);
  const [userReceivers, setUserReceivers] = React.useState([]);
  const [channelReceivers, setChannelReceivers] = React.useState([]);
  const [showReceivers, setShowReceivers] = React.useState(false);
  const [friendsIncluded, setFriendsIncluded] = React.useState([]);
  const [channelsIncluded, setChannelsIncluded] = React.useState([]);
  const [showVideoPicker, setShowVideoPicker] = React.useState(false);
  const [showUsers, setShowUsers] = React.useState([]);
  const [showChannels, setShowChannels] = React.useState([]);
  const [file, setFile] = React.useState();
  const [myAccount, setMyAccount] = React.useState();
  const [minChar, setMinChar] = React.useState(0);
  React.useEffect( () => {
    if (dataReceivers){
      const {friends, channels} = dataReceivers.getReceivers;
      setUserReceivers([...friends]);
      setChannelReceivers([...channels]);
      setShowUsers([...friends]);
      setShowChannels([...channels]);
    }
  }, [dataReceivers])

  React.useEffect( ( ) => {
    if(dataMyProfile){
      setMyAccount({...dataMyProfile.getMyAccount})
      setMinChar(getMin(dataMyProfile.getMyAccount.caratteri_giornalieri_rimanenti, dataMyProfile.getMyAccount.caratteri_settimanali_rimanenti, dataMyProfile.getMyAccount.caratteri_mensili_rimanenti));
    }
  }, [dataMyProfile])
  

  const fileInputRef = React.useRef(null);
  const fileVideoRef = React.useRef(null);
  const [showCam, setCam] = React.useState(false);
  const [containsTemporary, setTemporary] = React.useState(false);
  const [showReceiversPop, setNoReceiversPop] = React.useState(false);
  function handleFileUpload() {
    fileInputRef.current.click();
  }

  function handleVideoUpload(){
    fileVideoRef.current.click();
  }
  
  function deleteNewSqueal(){
    setVideo(null);
    setImage(null);
    setUserLocation(null);
  }

  function handleVideoChange(event){
    const video = event.target.files[0];
    setFile(video);

    setVideo(video);
    setCharUsed(VideoCharCost * (channelsIncluded && channelsIncluded.length));
    setShowVideoPicker(false);
    setImage(null);
    setNewPost('');
    setUserLocation(null);
  }

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (file) {
      convertToBase64(file);
      setFile(file);
    }
  }

  function changeNewPost(event){
    const {value} = event.target;
    setNewPost(value);
    setCharUsed(value.length * (channelsIncluded && channelsIncluded.length));
    setTextRows(parseInt(value.length / 40 ) + 1);
  }

  React.useEffect( () => {
    const isTemp = /(?:^|\s)#(\w+)/.test(newPost);
    if (isTemp !== containsTemporary){
      setTemporary(isTemp);
    }
    if(isTemp){
      setCharUsed(newPost.length);
    }
    if (channelsIncluded.length == 0 && friendsIncluded.length == 0)
      setCharUsed(newPost ? newPost.length : 0);
  }, [newPost])  
  
  React.useEffect( ( ) => {
    if(containsTemporary){
      setChannelsIncluded([]);
      setFriendsIncluded([]);
      setCharUsed(newPost.length);
    }
  }, [containsTemporary])

  function showPickImage(){
    setShowImagePicker(!showImagePicker);
  }
  function showVideoImage(){
    setShowVideoPicker(!showVideoPicker);
  }

  const showWebcam = () => {
    setCam(true);
    setShowImagePicker(false);
  };

  const handleWebcamCaptureClose = () => {
    setCam(false);
  };
  
  function convertToBase64(file) {

    if (file) {
      setFile(file);
      const reader = new FileReader();

      reader.onload = function (e) {
        const base64String = e.target.result;
        setImage(base64String);
        setCharUsed(ImgCharCost  * (channelsIncluded && channelsIncluded.length));
        setShowImagePicker(false);
        setVideo(null);
        setNewPost('');
        setUserLocation(null);
      };

      reader.readAsDataURL(file);
    }
  }

  function displayReceivers(caller){
    if(containsTemporary){
      setNoReceiversPop(true);
    } else if(caller == "regular"){
      setShowReceivers(true);
    }
  }

  function closeNoReceivers(){
    setNoReceiversPop(false);
  }

  function includeReceiver(index, array){
    if (array == "friends"){
      const isSelected = friendsIncluded.indexOf(index);
      if (isSelected >= 0){
        setFriendsIncluded([...friendsIncluded.filter(username => username.username !== index.username)])
      }
      else{
        setFriendsIncluded([...friendsIncluded, index]);
      }
    }
    else{
      const isSelected = channelsIncluded.indexOf(index);
      if (isSelected >= 0){
        setChannelsIncluded([...channelsIncluded.filter(name => name.name !== index.name)])
      }
      else{
        setChannelsIncluded([...channelsIncluded, index]);
      }
    }
  }

  const [userLocation, setUserLocation] = React.useState(null);
  const [searchResult, setSearchResult] = React.useState();

  const onLoadMaps = (autocomplete) => {
    setSearchResult(autocomplete)
 }

  // define the function that finds the users geolocation
  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          // update the value of userlocation variable
          setUserLocation({ lat: latitude, lng: longitude });
          setImage(null);
          setNewPost('');
          setVideo(null);
          setCharUsed(GeolocCharCost * (channelsIncluded && channelsIncluded.length));
        },
        // if there was an error getting the users location
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
    // if geolocation is not supported by the users browser
    else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const onPlaceSelected = () => {
    if(searchResult){
      const { geometry } = searchResult.getPlace();

      if (geometry && geometry.location) {
        const { lat, lng } = geometry.location;
        setUserLocation({ lat: lat(), lng: lng() });
      }
    }
  };

  React.useEffect( () => {
    if(channelsIncluded.length > 0){
      if(userLocation) setCharUsed(GeolocCharCost * channelsIncluded.length);
      if(newPost) setCharUsed(newPost.length * channelsIncluded.length);
      if(image) setCharUsed(ImgCharCost * channelsIncluded.length);
      if(selectedVideo) setCharUsed(VideoCharCost * channelsIncluded.length);
    } else if(channelsIncluded.length == 0){
      if(friendsIncluded.length > 0) setCharUsed(0);
      if(friendsIncluded.length == 0){
        if(userLocation) setCharUsed(GeolocCharCost);
        if(newPost) setCharUsed(newPost.length);
        if(image) setCharUsed(ImgCharCost);
        if(selectedVideo) setCharUsed(VideoCharCost);
      }
    }
  }, [channelsIncluded])

  React.useEffect(( ) => {
    if(image){
      if(channelsIncluded.length > 0){
        setCharUsed(ImgCharCost * channelsIncluded.length);
      } else if(friendsIncluded.length > 0) setCharUsed(0);
      else setCharUsed(ImgCharCost);
    } else{
      if(!newPost && !selectedVideo && !userLocation) setCharUsed(0);
    }
  }, [image])

  React.useEffect(( ) => {
    if(selectedVideo){
      if(channelsIncluded.length > 0){
        setCharUsed(VideoCharCost * channelsIncluded.length);
      } else if(friendsIncluded.length > 0) setCharUsed(0);
      else setCharUsed(VideoCharCost);
    }  else{
      if(!newPost && !image && !userLocation) setCharUsed(0);
    }
  }, [selectedVideo])

  React.useEffect(( ) => {
    if(userLocation){
      if(channelsIncluded.length > 0){
        setCharUsed(GeolocCharCost * channelsIncluded.length);
      } else if(friendsIncluded.length > 0) setCharUsed(0);
      else setCharUsed(GeolocCharCost);
    }  else{
      if(!newPost && !selectedVideo && !image) setCharUsed(0);
    }
  }, [userLocation])

  React.useEffect( () => {
    if(friendsIncluded.length > 0 && channelsIncluded.length == 0){
      setCharUsed(0);
    } else if (friendsIncluded.length == 0 && channelsIncluded.length == 0){
      if(userLocation) setCharUsed(GeolocCharCost);
      if(newPost) setCharUsed(newPost.length);
      if(image) setCharUsed(ImgCharCost);
      if(selectedVideo) setCharUsed(VideoCharCost);
    } else{
      if(userLocation) setCharUsed(GeolocCharCost * channelsIncluded.length);
      if(newPost) setCharUsed(newPost.length * channelsIncluded.length);
      if(image) setCharUsed(ImgCharCost * channelsIncluded.length);
      if(selectedVideo) setCharUsed(VideoCharCost * channelsIncluded.length);
    }
  }, [friendsIncluded])

  const newSquealMapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  }
function trySendingSqueal(){
    if(charUsed <= minChar) sendSqueal();
    else setIsOpenAdd(true);
  }
function sendSqueal(){
    closeAdd();
    var charsToPay = charUsed;

    if(charUsed > (minChar)){
      charsToPay = minChar;
      reducePurchasableChars({
        variables: {
          chars: charUsed - minChar
        }
      });
    }
    const destinationFr = friendsIncluded.map((obj) => obj._id);
    const destinationCh = channelsIncluded.map((obj) => obj._id);

    try{
      createSqueal({
        variables: {
          squealInput: {
            text: newPost,
            destinationUserIds: [...destinationFr],
            destinationChannels: [...destinationCh],
            typeOfUpload: (image && "image") || (selectedVideo && "video") || null,
            lat: userLocation? userLocation.lat : null,
            lng: userLocation? userLocation.lng : null,
            keyword: containsTemporary ? newPost.match(/#(\w+)/)[1] : null,
            charactersCost: charsToPay
          },
          file: file || null
        }
      })
    }catch(error){
      console.log(error);
    }
  }

  async function generateNews() {
    const apiUrl =
      'https://api.thenewsapi.com/v1/news/top?api_token=jrlpUzNRyPoXW6GM9Vgl77UzH1toil19CsZIf03a&language=it&categories=science,travel,politics,tech';
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': 'jrlpUzNRyPoXW6GM9Vgl77UzH1toil19CsZIf03a',
          // You may need to include other headers if required by the API
          // For example, 'Content-Type': 'application/json' for JSON requests
        },
      });
  
      const data = await response.json();
      const randomArticle = Math.floor(Math.random() * 3);
      const text = data.data[randomArticle].title;
      const url = data.data[randomArticle].url;
  
      const resp = await fetch(`https://api.tinyurl.com/create`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer J3xAPhU5PuuBUbM5oO1VI3gE3OnB5od7Le65rVirrWy42iaNJQVS69vSFJVX',
          'Content-type': 'Application/json'
        },
        body: JSON.stringify({
          url: url,
          domain: 'tinyurl.com'
        })
      })
      
      const dataurl = await resp.json();
      const tinyurl = dataurl.data.tiny_url;
      setVideo(null);
      setImage(null);
      setUserLocation(null);
      changeNewPost({ target: {value: `${text} - ${tinyurl}`}});
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  function generateRandomQuote(){
    const proxyUrl = 'https://api.quotable.io/random';
    fetch(proxyUrl)
      .then(res => res.json())
      .then((quote) => {
        changeNewPost({ target: {value: `${quote.content} - ${quote.author}`}});
        setVideo(null);
        setImage(null);
        setUserLocation(null);
      })
  }

  const [isOpenAdd, setIsOpenAdd] = React.useState(false);
  function closeAdd(){
      setIsOpenAdd(false);
    }

  const [filterDestinationUsers, setFilterUsers] = React.useState();
  const [filterChannelUsers, setFilterChannel] = React.useState();

  const handleUserFilter = (e) => {
    const term = e.target.value;
    setFilterUsers(term);
    const newDestUsers = userReceivers.filter((item) => item.username.toLowerCase().includes(term.toLowerCase()));
    setShowUsers(newDestUsers);
  }

  const handleChannelFilter = (e) => {
    const term = e.target.value;
    setFilterChannel(term);
    const newDestChannel = channelReceivers.filter((item) => item.name.toLowerCase().includes(term.toLowerCase()));
    setShowChannels(newDestChannel);
  }

  const [showTemporizedForm, setTemporized] = React.useState(false);
  const [selectedTimeFrame, setSelectedTimeFrame] = React.useState(Object.keys(temporizedTimeFramesString)[0]);
  const [temporizedSqueal, setTemporizedText] = React.useState("");
  const [temporizedRepetitions, setRepetitions] = React.useState(0);

  const handleTimeframeChange = (e) => {
    setSelectedTimeFrame(e.target.value);
  };
  const [planTemporized, {loading: loadingNewTemp, error: errorNewTemp, data: dataNewTemp}] = useMutation(CREATE_TEMPORIZED, {
    onError : () => {
      setSquealError(true);
      setTimeout( () => {
        setSquealError(false);
      }, 1500)
    },
    onCompleted : () => {
      setSquealCorrect(true);
      toggleNewSqueal();
      setTimeout( () => {
        setSquealCorrect(false);
      }, 1500)
    }
  });

  React.useEffect( () => {
    const isTemp = /\s#(\w+)/.test(temporizedSqueal);
    if (isTemp !== containsTemporary){
      setTemporary(isTemp);
    }
  }, [temporizedSqueal]) 


  function handleTemporizedSqueal(e){
    setTemporizedText(e.target.value);
  }

  function createTemporized(){
    const destinationFr = friendsIncluded.map((obj) => obj._id);
    const destinationCh = channelsIncluded.map((obj) => obj._id);

    planTemporized({
      variables: {
        squealInput: {
          text: temporizedSqueal,
          destinationUserIds: [...destinationFr],
            destinationChannels: [...destinationCh],
          lat: userLocation? userLocation.lat : null,
          lng: userLocation? userLocation.lng : null,
          keyword: containsTemporary ? temporizedSqueal.match(/#(\w+)/)[1] : null,
          delay: temporizedTimeFramesString[selectedTimeFrame],
          repetitions: parseInt(temporizedRepetitions)
        },
        file: null
      }
    })
    setTemporized(false);
  }

  const initialRef= React.useRef(null);
  const initialReceiversRef = React.useRef(null);
  

  const [showTemporizedReceivers, setShowTempReceivers] = React.useState(false);

  const closeRecOpenTemp = () => {
    setShowTempReceivers(false);
    setTemporized(true);
  }
  
  return(
    <div>
    <NewSquealBox>
        <ButtonActions>
          <StyledButton onClick={() => displayReceivers("regular")}>Destinatari</StyledButton>
          <StyledButton onClick={() => trySendingSqueal()} disabled={(myAccount && charUsed > (minChar + myAccount.caratteri_acquistabili_rimanenti) || (myAccount && minChar == 0 && myAccount.userType !== 'VIP' && friendsIncluded.length == 0))}>Pubblica squeal</StyledButton>
        </ButtonActions> 
        <TextRow>
          <img className="imgProfile" src={(myAccount && myAccount.profileImage) || profile_icon} />
          {!image && !selectedVideo && !userLocation && <StyledTextarea rows={textRows} cols={40} placeholder="A cosa stai pensando?" value={newPost} onChange={changeNewPost} />}
          {image && <ImageSqueal><XIcon src={delete_icon} onClick={deleteNewSqueal}/><img className="squealImage" src={image} /></ImageSqueal>}
          {selectedVideo &&
          <VideoSqueal> 
            <XIcon src={delete_icon} onClick={deleteNewSqueal}/>
          <video controls>
            <source src={URL.createObjectURL(selectedVideo)}/>  
          </video>
          </VideoSqueal>}
          {userLocation && 
            (isLoaded && <MapContainer>
              <XIcon src={delete_icon} onClick={deleteNewSqueal}/>
              <Autocomplete
                className="customComplete"
                onLoad = {onLoadMaps}
                onPlaceChanged={(autocomplete) => onPlaceSelected(autocomplete)}
              >
                <input type="text" placeholder="Cerca luogo..." />
              </Autocomplete>
              <GoogleMap 
                mapContainerClassName="mapNewSqueal"
                center={userLocation}
                zoom={15}
                options={newSquealMapOptions}
              >
                <MarkerF
                  position={userLocation}
                  icon={"https://maps.google.com/mapfiles/ms/icons/green-dot.png"}
                />
              </GoogleMap>
            </MapContainer> )    
          }
          <ResponsiveDisappearDiv>
          <StyledButton onClick={() => displayReceivers("regular")}>Destinatari</StyledButton>
          </ResponsiveDisappearDiv>
        </TextRow>
        <IconRow>
          <IconActionBar>
            <IconPost>
              <IconLink src={image_icon} onClick={ () => showPickImage()}/>
              <div className="tooltip">Immagine</div>
            </IconPost>
            <IconPost>
              <IconLink src={time_icon} onClick={() => setShowTempReceivers(true)}/>
              <div className="tooltip">Messaggi temporizzati</div>
            </IconPost>
            <IconPost>
              <IconLink src={video_icon} onClick={ () => handleVideoUpload()}/>
                <input
                type="file"
                ref={fileVideoRef}
                style={{ display: "none" }}
                onChange={handleVideoChange}
              />
              <div className="tooltip">Video</div>
            </IconPost>
            <IconPost>
              <IconLink src={position_icon} onClick={ () => getUserLocation()}/>
              <div className="tooltip">Geolocalizzazione</div>
            </IconPost>
            <IconPost>
              <IconLink src={news_icon} onClick={ () => generateNews()}/>
              <div className="tooltip">Notizie</div>
            </IconPost>
            <IconPost>
              <IconLink src={quoteIcon} onClick={ () => generateRandomQuote()}/>
              <div className="tooltip">Citazione</div>
            </IconPost>
          </IconActionBar>
          <CharBigTitle>
            Utilizzo caratteri
          </CharBigTitle>
          {myAccount && <CharIndicator>
            <CharValue orange={charUsed > minChar && charUsed < (minChar + myAccount.caratteri_acquistabili_rimanenti) ? "true" : ''} red={(charUsed > (minChar + myAccount.caratteri_acquistabili_rimanenti) || (myAccount && minChar == 0 && myAccount.userType !== 'VIP' && friendsIncluded.length == 0))  ? "true" : ''}>
              <CharTitle>
                Giornalieri
              </CharTitle>
              <CharNumber>
                {charUsed} / {myAccount.caratteri_giornalieri_rimanenti}
              </CharNumber>
            </CharValue>
            <CharValue orange={charUsed > minChar && charUsed < (minChar + myAccount.caratteri_acquistabili_rimanenti)  ? "true" : ''} red={(charUsed > (minChar + myAccount.caratteri_acquistabili_rimanenti) || (myAccount && minChar == 0 && myAccount.userType !== 'VIP' && friendsIncluded.length == 0))  ? "true" : ''}>
              <CharTitle>
                Settimanali
              </CharTitle>
              <CharNumber>
                {charUsed} / {myAccount.caratteri_settimanali_rimanenti}
              </CharNumber>
            </CharValue>
            <CharValue orange={charUsed > minChar && charUsed < (minChar + myAccount.caratteri_acquistabili_rimanenti)  ? "true" : ''} red={(charUsed > (minChar + myAccount.caratteri_acquistabili_rimanenti) || (myAccount && minChar == 0 && myAccount.userType !== 'VIP' && friendsIncluded.length == 0))  ? "true" : ''}>
              <CharTitle>
                Mensili
              </CharTitle>
              <CharNumber>
                {charUsed} / {myAccount.caratteri_mensili_rimanenti}
              </CharNumber>
            </CharValue>
          </CharIndicator>}
          <PostButton onClick={() => trySendingSqueal()} disabled={(myAccount && charUsed > (minChar + myAccount.caratteri_acquistabili_rimanenti) || (myAccount && minChar == 0 && myAccount.userType !== 'VIP' && friendsIncluded.length == 0))}>
            Squeal
          </PostButton>
        </IconRow>
      </NewSquealBox>
      {showCam && (
        <ImageModal onClose={handleWebcamCaptureClose}>
          <WebcamCapture onCaptureComplete={(capturedImage) => convertToBase64(capturedImage)}  onClose={handleWebcamCaptureClose}/>
        </ImageModal>
      )}

{showReceiversPop && <Transition.Root show={showReceiversPop}>
      <div className="fixed inset-0 z-40 bg-black/30"></div>

        <Dialog as="div" static className="fixed inset-0 z-50 overflow-y-auto" 
          open={showReceiversPop}
          onClose={() => closeNoReceivers()}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <MessageReceiversContainer>
                <MessageContainer>
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-500">
                      Attenzione! Quando uno squeal è indirizzato a un canale temporaneo (#parola), non può essere mandato ad ulteriori destinatari!
                    </p>
                  </div>
                    <div className="mt-4 flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={closeNoReceivers}
                    >
                      Capito!
                    </button>
                  </div>
                </MessageContainer>
              </MessageReceiversContainer>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>}
      {isOpenAdd && <Transition appear show={isOpenAdd} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeAdd}>
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    Caratteri superati!
                  </Dialog.Title>
                  <div className="mt-2 text-center">
                    <p className="text-md text-gray-500">
                      Attenzione, il tuo squeal supera il tuo limite di caratteri utilizzabili. 
                      Tuttavia, puoi ancora acquistare i caratteri che ti mancano per pubblicare il tuo post. 
                      Vuoi acquistare <b>{charUsed - (minChar)}</b> caratteri a <b>€{((charUsed - (minChar)) * getTarif(myAccount.userType)).toFixed(2)}</b>?
                    </p>
                  </div>
                    <div className="mt-4 flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={() => sendSqueal()}
                    >
                      Conferma
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => closeAdd()}
                    >
                      Annulla
                    </button>
                  </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>}
        {showReceivers && <Transition appear show={showReceivers} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setShowReceivers(false)}
            initialFocus={initialReceiversRef}
          >
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white py-3 px-2 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    Scegli destinatari
                  </Dialog.Title>
                  <ReceiversContainer>
                    <ReceiversColumn className="columns br">
                      <ReceiverTitle ref={initialReceiversRef}>
                        Amici
                      </ReceiverTitle>
                      <ReceiverSearch 
                        value={filterDestinationUsers}
                        onChange={handleUserFilter}
                        placeholder={"Cerca username"}
                      />
                      {showUsers.map( (obj, index) => (
                        <Receiver key={index} onClick={() => includeReceiver(obj, "friends")}>
                          <img src={obj.profileImage || userIcon} />
                          <span className="receiverName">{obj.username}</span>
                          {friendsIncluded.indexOf(obj) >= 0 && <img className="selected" src={selectedIcon} />}
                        </Receiver>
                      ))}
                    </ReceiversColumn>
                    <ReceiversColumn className="columns">
                      <ReceiverTitle>
                        Canali
                      </ReceiverTitle>
                      <ReceiverSearch 
                        value={filterChannelUsers}
                        onChange={handleChannelFilter}
                        placeholder={"Cerca canale"}
                      />
                      {showChannels.map( (obj, index) => (
                        <Receiver key={index} onClick={() => includeReceiver(obj, "channels")}>
                          <img src={obj.channelImage || channelIcon} />
                          <span className="receiverName">{obj.name}</span>
                          {channelsIncluded.indexOf(obj) >= 0 && <img className="selected" src={selectedIcon} />} 
                        </Receiver>
                      ))}
                    </ReceiversColumn>
                  </ReceiversContainer>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>}
        {showTemporizedReceivers && <Transition appear show={showTemporizedReceivers} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setShowTempReceivers(false)}
            initialFocus={initialReceiversRef}
          >
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white py-3 px-2 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    Scegli destinatari dei tuoi futuri messaggi
                  </Dialog.Title>
                  <ReceiversContainer>
                    <ReceiversColumn className="columns br">
                      <ReceiverTitle ref={initialReceiversRef}>
                        Amici
                      </ReceiverTitle>
                      <ReceiverSearch 
                        value={filterDestinationUsers}
                        onChange={handleUserFilter}
                        placeholder={"Cerca username"}
                      />
                      {showUsers.map( (obj, index) => (
                        <Receiver key={index} onClick={() => includeReceiver(obj, "friends")}>
                          <img src={obj.profileImage || userIcon} />
                          <span className="receiverName">{obj.username}</span>
                          {friendsIncluded.indexOf(obj) >= 0 && <img className="selected" src={selectedIcon} />}
                        </Receiver>
                      ))}
                    </ReceiversColumn>
                    <ReceiversColumn className="columns">
                      <ReceiverTitle>
                        Canali
                      </ReceiverTitle>
                      <ReceiverSearch 
                        value={filterChannelUsers}
                        onChange={handleChannelFilter}
                        placeholder={"Cerca canale"}
                      />
                      {showChannels.map( (obj, index) => (
                        <Receiver key={index} onClick={() => includeReceiver(obj, "channels")}>
                          <img src={obj.channelImage || channelIcon} />
                          <span className="receiverName">{obj.name}</span>
                          {channelsIncluded.indexOf(obj) >= 0 && <img className="selected" src={selectedIcon} />} 
                        </Receiver>
                      ))}
                    </ReceiversColumn>
                  </ReceiversContainer>
                    <div className="flex justify-center">
                      <MainButton fullButton={true} active={"true"} text="Continua pianificazione" onClickFunction={closeRecOpenTemp} /> 
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>}
        {showImagePicker && <Transition appear show={showImagePicker} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => {setShowImagePicker(false)}}>
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    Condividi immagine
                  </Dialog.Title>
                    <div className="mt-4 flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={() => handleFileUpload()}
                    >
                      <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                      Carica
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => showWebcam()}
                    >
                      Selfie
                    </button>
                  </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>}

        <Transition.Root show={showTemporizedForm}>
        <Dialog as="div" static className="fixed inset-0 z-10 overflow-y-auto" 
          open={showTemporizedForm}
          onClose={() => closeForm()}
          initialFocus={initialRef}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-60" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
          >
              <TemporizedContainer>
              <TemporizedForm>
                <TemporizedTitle>
                  Pianifica i tuoi squeal!
                </TemporizedTitle>
                <TextDiv>
                  <TempTextContainer>
                    All'interno di uno squeal temporizzato, puoi inserire le diciture &#123;NUM&#125;, &#123;TIME&#125; e &#123;DATE&#125;, che al momento della pubblicazione verranno sostituiti con il numero del post, l'ora e il tempo di pubblicazione. 
                  </TempTextContainer>
                </TextDiv>
                <TemporizedTextContainer>
                  <InputName ref={initialRef}>
                  Scrivi il tuo squeal
                  </InputName>
                  <TemporizedTextArea value={temporizedSqueal} placeholder={"Il tuo squeal"} onChange={handleTemporizedSqueal}/>
                </TemporizedTextContainer>
                <TemporizedTextContainer>
                <TemporizedRow>
                  <ChoiceContainer>
                  <TemporizedRepetition>
                    <InputName className="choice">
                      Numero di ripetizioni
                    </InputName>
                    <TemporizedInput value={temporizedRepetitions} type="number" className="noArrows" onChange={(e) => setRepetitions(e.target.value)}/>
                  </TemporizedRepetition>
                  <TemporizedRepetition>
                    <InputName className="choice">
                      Ogni quanto tempo
                    </InputName>
                    <select value={selectedTimeFrame} onChange={handleTimeframeChange}>
                      {Object.keys(temporizedTimeFramesString).map((timeFrame) => (
                        <option key={timeFrame} value={timeFrame}>
                          {timeFrame}
                        </option>
                      ))}
                    </select>
                  </TemporizedRepetition>
                  </ChoiceContainer>   
                </TemporizedRow>
              </TemporizedTextContainer>
              <TextDiv>
                <TempTextContainer>
                  <b>Nota: </b> il costo di uno squeal temporizzato viene determinato al momento della pubblicazione.<br/>
                  <b className="red">Se non avrai caratteri sufficienti, lo squeal non verrà pubblicato.</b>
                </TempTextContainer>
              </TextDiv>
              <MainButton text="Pianifica pubblicazione" fullButton={true} active={temporizedRepetitions > 0 ? "true" : ''} onClickFunction={() => createTemporized()}/>
              </TemporizedForm> 
              </TemporizedContainer>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {squealCorrect && <CorrectPopUp text="Squeal inviato con successo!"/>}
      {squealError && <ErrorPopUp text="Squeal non inviato."/>}
    </div>
  )
}

/**
 * {showReceivers && 
          <ReceiversContainer>
            <img className="closeIcon" src={cancelIcon} onClick={() => setShowReceivers(false)} />
            <ReceiversColumn className="columns br">
              <ReceiverTitle>
                Amici
              </ReceiverTitle>
              {userReceivers.map( (obj, index) => (
                <Receiver key={index} onClick={() => includeReceiver(index, "friends")}>
                  <img src={obj.profileImage} />
                  <span className="receiverName">{obj.username}</span>
                  {friendsIncluded.indexOf(index) >= 0 && <img className="selected" src={selectedIcon} />}
                </Receiver>
              ))}
            </ReceiversColumn>
            <ReceiversColumn className="columns">
              <ReceiverTitle>
                Canali
              </ReceiverTitle>
              {channelReceivers.map( (obj, index) => (
                <Receiver key={index} onClick={() => includeReceiver(index, "channels")}>
                  <img src={obj.channelImage} />
                  <span className="receiverName">{obj.name}</span>
                  {channelsIncluded.indexOf(index) >= 0 && <img className="selected" src={selectedIcon} />} 
                </Receiver>
              ))}
            </ReceiversColumn>
          </ReceiversContainer>}
 */