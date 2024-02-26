import { gql, useLazyQuery, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import ChannelComponent from "../components/ChannelComponent";
import Navbar from "../components/Navbar";
import Trending from "./Trending";
import SquealsShower from "../components/SquealsShower";
import { GET_MY_ACCOUNT } from "./Profile";
import { useEffect } from "react";
import { useState } from "react";
import { useGlobalState } from "../GlobalStateContext";


const GET_CHANNEL_SQUEALS = gql `
query getSquealsByChannel($channelId: String!){
  getSquealsByChannel(channelId: $channelId){
    squeal
    {
      _id
      text
      uploadedFile
      typeOfUpload
      keyword
      comments{
        text
        user{
          nome
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
      reactions{
        type
        user{
          _id
        }
      }
    }
    user{
      username
      profileImage
      nome
      cognome
      _id
    }
  }
}
`;

const KeywordShower = ({ channel }) => {
  const { loading: loadingCurrentUser, error: errorCurrentUser, data: dataUser } = useQuery(GET_MY_ACCOUNT);
  const [user, setUser] = useState();
  const {data: dataSqueals} = useQuery(GET_CHANNEL_SQUEALS, {
    variables: {
      channelId: channel._id
    }
  });
  const {state, dispatch} = useGlobalState();

  useEffect(() => {
    if (dataUser && dataUser.getMyAccount) {
      setUser({ ...dataUser.getMyAccount });
    }
  }, [dataUser]);

  useEffect(() => {
    if(dataSqueals){
      setSqueals(dataSqueals.getSquealsByChannel)
    }
  }, [dataSqueals]);

  const [squeals, setSqueals] = useState([]);

  return (
    <div>
      {channel && user && squeals && <SquealsShower squeals={ squeals} my_id={user && user._id} ignoreVisualization={state.unregisteredUser ? false : true}/>}
    </div>
  );
};

export default KeywordShower;
