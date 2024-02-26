import { gql, useQuery } from "@apollo/client";
import React from "react";
import ProfileContainer from "../components/ProfileContainer";
import Navbar from "../components/Navbar";
import Trending from "./Trending";
import { useParams } from "react-router-dom";
import { PageContainer } from "./HomePage";
import Header from "../components/Header";
import { ResponsiveDisappearDiv } from "./HomePage";

export const GET_USER_BY_USERNAME = gql`
  query getByUsername($username: String!) {
    getByUsername(username: $username) {
      __typename
      ... on BasicUser {
      _id 
        nome
        cognome
        username
        friends 
        channels
        profileImage
        bio
        userType
      }
      ... on SMMUser {
        nome
        cognome
        username
      }
      ... on SquealerUser {
        nome
        cognome
        username
      }
    }
  }
`;

const ProfileShower = ({ match }) => {
  const { username } = useParams();
  const { loading, error, data } = useQuery(GET_USER_BY_USERNAME, {
    variables: { username: username},
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const user = data.getByUsername;

  return (
    <div>
      <Header />
      <PageContainer>
          <Navbar currentPage={"search"} />
          {user && <ProfileContainer user={user} isUserProfile={false} />}
          <ResponsiveDisappearDiv>
        <Trending unregisteredUser={false}/>
       </ResponsiveDisappearDiv>
    </PageContainer> 
    </div>
  );
};

export default ProfileShower;
