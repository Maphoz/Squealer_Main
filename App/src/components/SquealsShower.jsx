import React from "react"
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
import thumbDownGrey from "../images/thumbsDown_grey.png"
import comment_grey from "../images/comment_grey.png"
import { greyColor } from "../const";
import SquealPost from "./SquealPost";
import { useLoadScript } from "@react-google-maps/api";




const SquealsContainer = styled.div`
  ${tw`
      w-full
      mt-8
  `}

  @media (max-width: 576px) {
    margin-top: 0;
    padding-bottom: 80px;
  }
`;



export default function SquealsShower(props){
  const {squeals, my_id, ignoreVisualization, unregisteredUser, fetchOther} = props;
  const [squealData, setSquealData] = React.useState([...squeals]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
    libraries: ['places']
  });
  
  React.useEffect(() => {
    setSquealData([...squeals]);
  }, [squeals]);

  function deleteSqueal(squealId){
    setSquealData([...squealData.filter(obj => obj.squeal._id !== squealId)]);
  }

  return(
    squealData.length > 0 && <SquealsContainer>
      {squealData.map( (obj, index) => (
        <SquealPost key={obj.squeal._id} id={obj.squeal._id} functionDelete={deleteSqueal} ignoreVisualization={ignoreVisualization} squealInfo={obj} my_id={my_id} unregisteredViewer={unregisteredUser} fetchOther={fetchOther || null} lastSqueal={(index == squealData.length - 1 && fetchOther) ? true : false} isLoaded={isLoaded}/>
      ))}
    </SquealsContainer>
  )
}