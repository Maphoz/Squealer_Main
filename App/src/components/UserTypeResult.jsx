import React from 'react';
import styled from 'styled-components';
import noImage from '../images/no_image.jpeg';
import { useQuery, gql } from '@apollo/client';
import tw from 'twin.macro';

export const GET_USER_BY_ID = gql`
  query getUserById($_id: String!) {
    getUserById(_id: $_id) {
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

const UserDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; /* Aggiunto per centrare orizzontalmente */
  margin-top: 5px;
  flex-wrap: nowrap;
`;

const UserDetailsText = styled.div`
  text-align: center; /* Aggiunto per centrare il testo */
  margin-left: 10px;
  margin-top: 5px;
  margin-right: 20px;
  max-height: 100%;
  overflow: hidden;

  p:first-child {
    font-weight: bold;
  }

  p:last-child {
    margin-top: 0;
    color: gray;
    ${tw`
    font-medium
  `}
  }
`;
const ProfileImageContainer = styled.div`
  width: 5vh;
  height: 5vh;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid;
  margin-right: 5px;
  margin-left: 5px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }
`;

const UserTypeResult= ({ userId }) => {
  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { _id:  userId},
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const user = data.getUserById;
  return (
    <UserDetailsContainer>
      <ProfileImageContainer>
        <img
          src={user.profileImage ? user.profileImage : noImage}
          alt="Immagine profilo"
        />
      </ProfileImageContainer>
      <UserDetailsText>
        <p>{user.nome} {user.cognome}</p>
        <p>@{user.username}</p>
      </UserDetailsText>
    </UserDetailsContainer>
  );
};

export default UserTypeResult;