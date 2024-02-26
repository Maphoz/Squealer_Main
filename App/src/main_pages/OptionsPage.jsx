import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"

const ButtonStyled = styled.button`
  ${props => props.width ? `width: ${props.width}` : 'width: 250px;' }
  height: 100px;
  border-radius: 25px;
`

const GET_FRIENDS = gql`
  query{
    getFriends(userId: "64d543dace0130856d97af0e"){
      name
    }
  }
`

export default function OptionsPage(){
  const navigate = useNavigate();

  const {loading, error, data} = useQuery(GET_FRIENDS);
  const [friends, setFriends] = React.useState([]);

  React.useEffect( () => {
    if(data){
      setFriends([...data.getFriends]);
    }
  }, [data])

  function goToLogin(){
    navigate('/');
  }


  return(
    <div>
      {friends && friends.map( (obj, index) => (
        <div key={index} id={index}>
          <p>{obj}</p>
        </div>
      ))}
      <ButtonStyled width={"500px;"} onClick={goToLogin}>Vai al login</ButtonStyled>
    </div>
  )
}