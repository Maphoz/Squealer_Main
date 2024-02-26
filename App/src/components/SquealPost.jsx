import React, { Fragment } from "react"
import styled from "styled-components"
import tw from "twin.macro"
import profile_icon from '../images/user_image.jpg';
import comment_icon from '../images/comment_icon.png';
import thumbsDown_icon from '../images/thumbsDown_icon.png';
import thumbsUp_icon from '../images/thumbsUp_icon.png';
import like_emoji from "../images/heart_emoji.png"
import laugh_emoji from "../images/laugh_emoji.png"
import angry_emoji from "../images/angry_emoji.png"
import dislike_emoji from "../images/brokenheart_emoji.png"
import agree_emoji from "../images/agree_emoji.png"
import disagree_emoji from "../images/disagree.png"
import inappropriate_emoji from "../images/inappropriate_emoji.png"
import emotional_emoji from "../images/emotional_emoji.png"
import thumbUpGrey from "../images/thumbsUp_grey.png"
import views_icon from "../images/views.png"
import thumbDownGrey from "../images/thumbsDown_grey.png"
import comment_grey from "../images/comment_grey.png"
import { formatTimeDifference, greyColor, mainColor } from "../const";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import CorrectPopUp from "./CorrectMessage";
import ErrorPopUp from "./ErrorMessage"
import MainButton from "../components/MainButton";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useInView } from "react-intersection-observer";
import dots from "../images/addRemove.png"
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

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

const MapContainer = styled.div`
  width: 70%;
  margin-top: 5px;

  .mapNewSqueal{
    width: 300px;
    height: 300px;
  }

  @media (max-width: 576px){
    width: 100%;

    
  }
`

const SingleSquealContainer = styled.div`
  border-bottom: 1px solid lightgrey;
  padding: 5% 0% 10px 0;
  overflow: hidden;
  width: 100%;
  position: relative;
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: start;
`

const ImageContainer = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid black;
`

const SquealDataRow = styled.div`
  color: black;
  display: flex;
  line-height: 1.2;
  flex-direction: column;
  width: 100%;

  .name{
    font-weight: 600;
    margin-right: 5px;
    font-size: 14px;
  }

  .themeColor{
    color: ${mainColor};
    font-weight: 600;
  }

  .blueColor{
    color: #3399ff;
    font-weight: 600;
  }
  
  .tag{
    font-size: 14px;
  }

  .date{
    font-size: 14px;
  }
`

const NameDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

const SpanDiv = styled.div`
  
`

const StyledSpan = styled.span` 
  font-weight: 600;
  margin-left: 5px;
  font-size: 14px;
  padding: 1px 5px;
  @media(max-width: 576px){
    font-size: 12px;
  }
  border-radius: 10px;

  ${props => props.popular && `border: 1px solid blue;`}
  ${props => props.impopular && `border: 1px solid red;`}
  ${props => props.controverse && `border: 1px solid #B99AFF;`}

  ${props => props.popular && `color: blue;`}
  ${props => props.impopular && `color: red;`}
  ${props => props.controverse && `color: #B99AFF;`}
`

const ContentContainer = styled.div`
  margin-top: -20px;
  font-size: 16px;
  padding-left: 50px;
`

const IconsContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
  padding-left: 50px;

  @media (max-width: 576px){
    margin-top: 10px;
  }
`

const IconDiv = styled.div`

  @media(max-width:576px){
    margin-right: 10px;
  }
  display: flex;
  align-items: center;
  position: relative;

  img{
    width: 16px;
    height: 16px;
  }
  margin-right: 15px;
  font-size: 14px;

  .viewsIcon{
    width: 20px;
    height: 20px;
  }
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
    white-space: nowrap;
  }

  &:hover .tooltip{
    visibility: visible;
    opacity: 1;
  }
`

const ActionContainer = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding-inline: 8%;

  @media (max-width: 576px) {
    .actionText{
      display: none;
    }
  }
`

const SingleAction = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 15px;
  padding: 8px 18px;
  position: relative;
  color: ${greyColor};
  ${props => props.positiveactive && 'border: 1px solid red;'}
  ${props => props.negativeactive && 'border: 1px solid blue;'}

  ${props => props.positiveactive && 'color: red;'}
  ${props => props.negativeactive && 'color: blue;'}

  img{
    width: 22px;
    height: 22px;
    margin-right: 5px;
  }

  @media (max-width: 576px){
    padding: 5px 10px;
    border-radius: 5px;

    img{
      width: 28px;
      height: 28px;
      margin-right: 0px;
    }
  }

  .br{
    border-right: 1px solid lightgrey;
  }  

  .bl{
    border-left: 1px solid lightgrey;
  }
  font-weight: 600;

  &:hover{
    background-color: #eeeeee;
  }
`

const ReactionContainer = styled.div`
  @keyframes appear{
    0%{
      scale: 0.5;
    }
    100%{
      scale: 1;
    }
  }

  @keyframes scaleBig{
    0%{
      scale: 1;
    }
    50%{
      scale: 1.2;
    }
    100%{
      scale: 1;
    }
  }
  width: 200px;
  position: absolute;
  display: flex;
  justify-content: space-between;
  top: -120%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 5px 10px;
  animation: appear 0.1s ease-in-out;
  border-radius: 10px;
  border: 1px solid lighgrey;
  z-index: 1;
  box-shadow: 0px 0px 2px 2px #dddddd;

  img{
    width: 40px;
    height: 40px;
    margin: 3px 5px;
  }

  img:hover{
    animation: scaleBig 0.4s ease-in-out;    
  }

  @media (max-width: 576px){
    width: 150px;

    img{
      width: 30px;
      height: 30px;
    }
  }
`

const EmojiContainer = styled.div`
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
  }
`


const ADD_REACTION = gql`
  mutation addReaction($squealId: String!, $reaction: String!){
    addReaction(squealId: $squealId, reaction: $reaction){
      squeal
      {reactions{
        type
        user{
          _id
        }
      }}
    }
  }
`

const ADD_COMMENT = gql`
  mutation addComment($squealId: String!, $commentText: String!){
    addComment(squealId: $squealId, commentText: $commentText){
      squeal
      {comments{
        text
        user{
          nome
          cognome
          username
          profileImage
        }
        date
      }}
    }
  }
`
const ImageSqueal = styled.div`
  display: flex;
  justify-content: start;  
  margin-top: 5px;
  img{ 
    width: 70%;
    height: auto;
  }

  @media (max-width: 576px){
    img{
      width: 100%;
      height: auto;
    }
  }
`
const VideoSqueal = styled.div`
  display: flex;
  justify-content: start;  
  width: 70%;
  margin-right: 15px;
  margin-top: 5px;

  @media (max-width: 576px){
    width: 100%;
    height: auto;
  }
`

const CommentsContainer = styled.div`
  ${tw`
      flex
      flex-col
      items-start
      py-3
      px-6
  `}

  .commentImage{
    width: 25px;
    height: 25px;
    margin-right: 10px;
  }
`

const Comment = styled.div`
  padding-top: 5px;
  width: 100%;
  padding-bottom: 5px;
  border-bottom: 1px solid #dddddd;
`

const CommentText = styled.div`
  font-size: 16px;
  margin-top: -20px;
  margin-bottom: 10px;
  padding-left: 50px;
  width: 100%;
  text-align: left;
`

const AddCommentSection = styled.div`
  width: 100%;
  margin: 10px 0px;
  display: flex;
  align-items: center;

  textarea::-webkit-scrollbar {
    display: none;
}

  /* Remove arrows in Webkit browsers (Chrome, Safari) */
  textarea::-webkit-scrollbar-thumb {
      display: none;
  }
`

const NewComment = styled.textarea`
  width: 100%;
  padding: 8px 10px 5px 10px;
  background: #dddddd;
  height: 45px;
  border-radius: 10px;
  line-height: 1.2;
  margin-right: 20px;

  &:focus{
    background: white;
  }

  ${props => props.length > 0 ? 'background: white;' : 'background: #dddddd;'}
  ${props => props.length > 0 && 'border: 1px solid #dddddd;'}
`

const UPDATE_SQUEAL = gql`
  query getSquealByIdFull($squealId: String!){
    getSquealByIdFull(squealId: $squealId){
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
`

const DotContainer = styled.div`
  box-shadow: 0px 3px 5px 5px #ffffffdd;

  img{
    width: 15px;
    height: auto;
  }

  :hover{
    cursor: pointer;
    border-radius: 50%;
    background-color: #efefef;
  }
`

const ADD_VISUALIZED = gql`
  mutation addSquealVisualized($squealId: String!){
    addSquealVisualized(squealId: $squealId)
  }
`

const DELETE_SQUEAL = gql`
  mutation deleteSqueal($squealId: String!){
    deleteSqueal(squealId: $squealId)
  }
`

export default function SquealPost(props){
  const navigate = useNavigate();
  const {squealInfo , my_id, ignoreVisualization, unregisteredViewer, functionDelete, lastSqueal, fetchOther, isLoaded} = props;
  const [newComment, setNewComment] = React.useState("");
  const [showPositive, setShowPositive] = React.useState(false);
  const [showNegative, setShowNegative] = React.useState(false);
  const [reactionSent, setReactionSent] = React.useState(false);
  const [reactionError, setReactionError] = React.useState(false);
  const [deleteSent, setDeleteSent] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState(false);
  const [commentSent, setCommentSent] = React.useState(false);
  const [commentError, setCommentError] = React.useState(false);
  const [squealSent, setSquealSent] = React.useState(false);
  const [squealError, setSquealError] = React.useState(false);
  const [totalPositives, setTotalPositives] = React.useState(0);
  const [totalNegatives, setTotalNegatives] = React.useState(0);
  const [squealData, setSquealData] = React.useState({...squealInfo});
  const [addReaction, {loadingReaction, errorReaction, data: dataReaction}] = useMutation(ADD_REACTION, {
    onError: () => {
      setReactionError(true);
      setTimeout( () => {
        setReactionError(false);
      }, 1500)
    },
    onCompleted: () => {
      setReactionSent(true);
      setTimeout( () => {
        setReactionSent(false);
      }, 1500);
    }
  }) 
  const [deleteSqueal, {loadingDelete, errorDelete, data: dataDelete}] = useMutation(DELETE_SQUEAL, {
    onError: () => {
      setDeleteError(true);
      setTimeout( () => {
        setDeleteError(false);
      }, 1500)
    },
    onCompleted: () => {
      setDeleteSent(true);
      setTimeout( () => {
        setDeleteSent(false);
        functionDelete(squealInfo.squeal._id);
      }, 1500);
    }
  })
  const [addVisualized, {loadingViewd, errorViewd, data: dataViewd}] = useMutation(ADD_VISUALIZED, {
    onError: (error) => {
      console.log(error);
    }
  }) 
  const newSquealMapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  }
  const [addComment, {loadingComment, errorComment, data: dataComment}] = useMutation(ADD_COMMENT, {
    onError: () => {
      setCommentError(true);
      setTimeout( () => {
        setCommentError(false);
      }, 1500)
    },
    onCompleted: () => {
      setCommentSent(true);
      setTimeout( () => {
        setCommentSent(false);
      }, 1500);
    }
  })
  const [updateSqueal, {loading: loadingSqueal, error: errorSqueal, data: dataSqueal}] = useLazyQuery(UPDATE_SQUEAL, {
    onError: () => {
      setSquealError(true);
      setTimeout( () => {
        setSquealError(false);
      }, 1500)
    },
    onCompleted: () => {
      setSquealSent(true);
      setTimeout( () => {
        setSquealSent(false);
      }, 1500);
    }
  })
  const [positiveReactions, setPositive] = React.useState(0);
  const [negativeReactions, setNegative] = React.useState(0);
  const [myReaction, setMyReaction] = React.useState({});
  const [myReactionImage, setMyReationImage] = React.useState();
  const [commentSection, setCommentSection] = React.useState(false);

  React.useEffect( () => {
    if(dataSqueal){
      setSquealData({...dataSqueal.getSquealByIdFull});
    }
  }, [dataSqueal])

  React.useEffect( () => {
    if(squealData.squeal.reactions){
      var posCount = 0;
      var negCount = 0;
      for(let i = 0; i < squealData.squeal.reactions.length; i++){
        if(squealData.squeal.reactions[i].type == "like" || squealData.squeal.reactions[i].type == "laugh" || squealData.squeal.reactions[i].type == "agree" || squealData.squeal.reactions[i].type == "emotional"){
          posCount++;
          squealData.squeal.reactions[i].user._id == my_id && setMyReaction({type: squealData.squeal.reactions[i].type, value: "positive"})
        } 
        else{
          negCount++;
          squealData.squeal.reactions[i].user._id == my_id && setMyReaction({type: squealData.squeal.reactions[i].type, value: "negative"})
        }
        
      }
      setTotalPositives(posCount);
      setTotalNegatives(negCount);
    }
  }, [squealData])

  React.useEffect( () => {
    if(myReaction){
      myReaction.type == "like" && setMyReationImage(like_emoji);
      myReaction.type == "laugh" && setMyReationImage(laugh_emoji);
      myReaction.type == "agree" && setMyReationImage(agree_emoji);
      myReaction.type == "disagree" && setMyReationImage(disagree_emoji);
      myReaction.type == "dislike" && setMyReationImage(dislike_emoji);
      myReaction.type == "emotional" && setMyReationImage(emotional_emoji);
      myReaction.type == "angry" && setMyReationImage(angry_emoji);
      myReaction.type == "inappropriate" && setMyReationImage(inappropriate_emoji);
    }
  }, [myReaction])

  function setShowAction(string){
    if(string == "positive"){
      setShowPositive(!showPositive);
      setShowNegative(false);
    } 
    else if (string == "negative"){
      setShowNegative(!showNegative)
      setShowPositive(false);
    }
  }

  
  function sendComment(){
    addComment({
      variables: {
        squealId: squealData.squeal._id,
        commentText: newComment
      }
    })
    setNewComment("");   
  }
  const sendReaction = (reaction) => {
    addReaction({
      variables: {
        squealId: squealData.squeal._id,
        reaction: reaction
      }
    })
  }

  React.useEffect( () => {
    if(dataComment){
      setSquealData(prevSqueal => ({
        ...prevSqueal,
        squeal: {
          ...prevSqueal.squeal,
          comments: [...dataComment.addComment.squeal.comments]
        }
      }))
    }
  }, [dataComment])

  React.useEffect( () => {
    if(dataReaction){
      setSquealData(prevSqueal => ({
        ...prevSqueal,
        squeal: {
          ...prevSqueal.squeal,
          reactions: [...dataReaction.addReaction.squeal.reactions]        }
      }))
    }
  }, [dataReaction])

  const {ref: squealRef, inView: postVisible} = useInView();

  const [squealTimer, setTimer] = React.useState(0);

  const [considerTimer, setConsiderTimer] = React.useState(!ignoreVisualization && !unregisteredViewer);
  const timer = React.useRef(null);

  React.useEffect(() => {
    if (considerTimer && !unregisteredViewer) {
      if (postVisible) {
        startTimer();
        if(lastSqueal){
          fetchOther();
        }
        return () => clearInterval(timer.current);
      }
      if (!postVisible && timer) {
        setTimer(0);
        stopTimer();
      }
    }
  }, [postVisible, squealTimer, considerTimer]);
  
  React.useEffect(() => {
    if (squealTimer === 3) {
      setTimer(0);
      stopTimer();
      sendVisualized();
      setConsiderTimer(false);
    }
  }, [squealTimer]);
  

  function startTimer(){
    timer.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
  }

  function stopTimer(){
    clearInterval(timer.current);
  }

  function sendVisualized(){
    addVisualized({
      variables: {
        squealId: squealData.squeal._id
      }
    })
  }
  const [showReceiversPop, setNoReceiversPop] = React.useState(false);

  function squealDelete(){
    deleteSqueal({
      variables: {
        squealId: squealData.squeal._id
      }
    })
    setNoReceiversPop(false)
  }

  const redirectToProfile = () => {
    if(squealData.user.typeOfUser == "SQUEALER"){
    }
   else {
    navigate(`/profileShower/${squealData.user.username}`)
   } 
  }
  return(
    <div>
    <SingleSquealContainer ref={squealRef}>
          <ProfileRow>
            <ImageContainer src={squealData.user.profileImage || profile_icon} onClick={redirectToProfile}/>
            <SquealDataRow>
              <NameDiv>
                <SpanDiv>
                <span className="name">{squealData.user.username}</span>
                {squealData.squeal.channelName && (squealData.squeal.channelName == squealData.squeal.channelName.toLowerCase()) && <span className="tag themeColor">§{squealData.squeal.channelName} · </span>}
                {squealData.squeal.channelName && (squealData.squeal.channelName == squealData.squeal.channelName.toUpperCase()) && <span className="tag blueColor">§{squealData.squeal.channelName} · </span>}
                {squealData.squeal.keyword && <span className="tag themeColor">#{squealData.squeal.keyword} · </span>}
                {!squealData.squeal.channelName && !squealData.squeal.keyword && <span className="tag">{squealData.user.nome} {squealData.user.cognome} · </span>}

                <span className="date">{formatTimeDifference(new Date(squealData.squeal.publicationDate))}</span>
                {squealData.squeal.classification && squealData.squeal.classification !== 'Normale' && squealData.squeal.classification !== 'normale' && <StyledSpan popular={squealData.squeal.classification == "Popolare"} impopular={squealData.squeal.classification == "Impopolare"} controverse={squealData.squeal.classification == "Controverso"}>{squealData.squeal.classification}</StyledSpan>}
                </SpanDiv>
                {squealData.user._id === my_id && <DotContainer>
                  <img src={dots} alt="menu per cancellare squeal" onClick={() => setNoReceiversPop(true)}/>
                </DotContainer>}
              </NameDiv>
            </SquealDataRow>
          </ProfileRow>
          <ContentContainer>
            {squealData.squeal.text}
            {squealData.squeal.typeOfUpload == "video" && <VideoSqueal> 
              <video controls>
                <source src={squealData.squeal.uploadedFile}/>  
              </video>
              </VideoSqueal>}
              {squealData.squeal.typeOfUpload == "image" && <ImageSqueal><img src={squealData.squeal.uploadedFile} /></ImageSqueal>}
            {squealData.squeal.geolocation && isLoaded &&
              <MapContainer>
                <GoogleMap 
                  mapContainerClassName="mapNewSqueal"
                  center={{lat: squealData.squeal.geolocation.latitude, lng: squealData.squeal.geolocation.longitude}}
                  zoom={15}
                  options={newSquealMapOptions}
                >
                  <MarkerF
                    position={{lat: squealData.squeal.geolocation.latitude, lng: squealData.squeal.geolocation.longitude}}
                    icon={"https://maps.google.com/mapfiles/ms/icons/green-dot.png"}
                  />
                </GoogleMap>
              </MapContainer>
            }
          </ContentContainer> 
          <IconsContainer>
            <IconDiv>
              <img src={comment_icon} alt="commenti"/>
              <span>{squealData.squeal.comments.length}</span>
              <div className="tooltip">Commenti</div>
            </IconDiv>
            <IconDiv>
              <img src={thumbsUp_icon} />
              <span>{totalPositives}</span>
              <div className="tooltip">Reazioni positive</div>
            </IconDiv>
            <IconDiv>
              <img src={thumbsDown_icon} />
              <span>{totalNegatives}</span>
              <div className="tooltip">Reazioni negative</div>
            </IconDiv>
            <IconDiv>
              <img className="viewsIcon" src={views_icon} />
              <span>{squealData.squeal.views}</span>
              <div className="tooltip">Visualizzazioni</div>
            </IconDiv>
          </IconsContainer>
          {!unregisteredViewer && <ActionContainer>
            <SingleAction onClick={() => setShowAction("positive")} positiveactive={myReaction.value == "positive" ? myReaction.value : undefined}>
              <img src={(myReaction.value == "positive" && myReactionImage) || thumbUpGrey} />
              <span className="actionText">Positivo</span>
              {showPositive && 
                <ReactionContainer className="reaction-container">
                  <EmojiContainer>
                    <img src={like_emoji} onClick={() => sendReaction("like")}/>
                    <div className="tooltip">Mi piace</div>
                  </EmojiContainer>
                  <EmojiContainer>
                  <img src={agree_emoji} onClick={() => sendReaction("agree")}/>
                  <div className="tooltip">D'accordo</div>
                  </EmojiContainer>
                  <EmojiContainer>
                  <img src={emotional_emoji} onClick={() => sendReaction("emotional")}/>
                  <div className="tooltip">Emozionato</div>
                  </EmojiContainer>
                  <EmojiContainer>
                  <img src={laugh_emoji} onClick={() => sendReaction("laugh")}/>
                  <div className="tooltip">Fa ridere</div>
                  </EmojiContainer>
                </ReactionContainer>
              }
            </SingleAction>
            <SingleAction onClick={() => setShowAction("negative")} negativeactive={myReaction.value == "negative" ? myReaction.value : undefined}>
              <img src={(myReaction.value == "negative" && myReactionImage) || thumbDownGrey} />
              <span className="actionText">Negativo</span>
              {showNegative &&
                <ReactionContainer className="reaction-container">
                  <EmojiContainer>
                  <img src={dislike_emoji} onClick={() => sendReaction("dislike")}/>
                  <div className="tooltip">Non mi piace</div>
                  </EmojiContainer>
                  <EmojiContainer>
                  <img src={disagree_emoji} onClick={() => sendReaction("disagree")}/>
                  <div className="tooltip">Non d'accordo</div>
                  </EmojiContainer>
                  <EmojiContainer>
                  <img src={angry_emoji} onClick={() => sendReaction("angry")}/>
                  <div className="tooltip">Arrabbiato</div>
                  </EmojiContainer>
                  <EmojiContainer>
                  <img src={inappropriate_emoji} onClick={() => sendReaction("inappropriate")}/>
                  <div className="tooltip">Inappropriato</div>
                  </EmojiContainer>
                </ReactionContainer>
              }
            </SingleAction>
            <SingleAction onClick={() => setCommentSection(!commentSection)}>
              <img src={comment_grey} />
              <span className="actionText">Commenta</span>
              
            </SingleAction>
          </ActionContainer>}
          {reactionSent && <CorrectPopUp text="Reazione aggiunta" />}
          {reactionError && <ErrorPopUp text="Reazione non aggiunta" />}
          {commentSent && <CorrectPopUp text="Commento aggiunto" />}
          {commentError && <ErrorPopUp text="Commento non aggiunto" />}
          {deleteSent && <CorrectPopUp text="Squeal eliminato" />}
          {deleteError && <ErrorPopUp text="Squeal non eliminato" />}
          {commentSection && 
            <CommentsContainer>
              <AddCommentSection>
                <NewComment length={newComment.length} type="text" value={newComment} placeHolder={"Aggiungi un commento"} onChange={ (event) => {setNewComment(event.target.value)}}/>
                <MainButton text={"Pubblica"} fullButton={true} active={newComment.length} mb={"0px;"} onClickFunction={sendComment}/>
              </AddCommentSection>
              {squealData.squeal.comments.slice().reverse().map((obj, index) => (
                <Comment key={index}>
                  <ProfileRow>
                    <ImageContainer src={obj.user.profileImage || profile_icon} />
                    <SquealDataRow>
                      <div>
                        <span className="name">{obj.user.nome}</span>
                        <span className="tag">@{obj.user.username}</span>
                        {obj.date && <span className="date"> · {formatTimeDifference(new Date(obj.date))}</span>}
                      </div>
                    </SquealDataRow>
                  </ProfileRow>
                  <CommentText>{obj.text}</CommentText>
                </Comment>
              ))}
            </CommentsContainer>
          }
        </SingleSquealContainer>
        {showReceiversPop && <Transition.Root show={showReceiversPop}>
      <div className="fixed inset-0 z-40 bg-black/30"></div>

        <Dialog as="div" static className="fixed inset-0 z-50 overflow-y-auto" 
          open={showReceiversPop}
          onClose={() => setNoReceiversPop(false)}
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
                      Attenzione! Vuoi eliminare lo squeal?
                    </p>
                  </div>
                  <div className="mt-4 flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={() => squealDelete()}
                    >
                      Elimina
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => setNoReceiversPop(false)}
                    >
                      Annulla
                    </button>
                  </div>
                </MessageContainer>
              </MessageReceiversContainer>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>}
        </div>
  )
}