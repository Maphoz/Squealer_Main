import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import ChannelComponent from "../components/ChannelComponent";
import Navbar from "../components/Navbar";
import Trending from "./Trending";
import { PageContainer } from "./HomePage";
import Header from "../components/Header";
import { ResponsiveDisappearDiv } from "./HomePage";

export const GET_CHANNEL_DETAILS = gql`
query getChannelByName($name: String!){
    getChannelByName(name: $name){
      _id
      name,
      description,
      channelImage,
      owners,
      partecipants,
      squeals,
      channelType,
      isBlocked
   }
 }
 `;

const ChannelShower = () => {
  const { channelName } = useParams();
  const { loading, error, data } = useQuery(GET_CHANNEL_DETAILS, {
    variables: { name: channelName },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const channel = data.getChannelByName;

  return (
    <div>
    <Header />
    <PageContainer>
          <Navbar currentPage={"search"} />
        {channel && <ChannelComponent channel={channel} />}
        <ResponsiveDisappearDiv>
        <Trending unregisteredUser={false}/>
       </ResponsiveDisappearDiv>
    </PageContainer> 
    </div>
  );
};

export default ChannelShower;
