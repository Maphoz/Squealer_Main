import React from "react";
import styled from "styled-components";
import { mainColor } from "../const";

const Field = styled.div`
  position: relative;
  height: 40px;
  line-height: 80px;
  width: ${(props) => props.width};

  input {
    position: absolute;
    width: 100%;
    outline: none;
    font-size: 18px;
    padding: 0 15px;
    line-height: 40px;
    border-radius: 10px;
    ${props => props.error ? 'border: 2px solid red;' : 'border: 2px solid black;'}
    transition: 0.2s ease;
    z-index: 5;

    &::placeholder {
      color: ${(props) => (props.isfocused ? "transparent" : "initial")};
    }

    &:not(:placeholder-shown) + .label,
    &:focus + .label {
      color: green;
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      transform: translate(-15px, -15px) scale(0.88);
      z-index: 6;
      background: white;
    }

    &:not(:placeholder-shown) {
      &::placeholder {
        color: transparent; // Make sure to set the placeholder color to transparent
      }
      ${props => props.error ? 'border: 2px solid red;' : `border: 2px solid ${mainColor};`}
    }
  }

  .label {
    position: absolute;
    font-size: 20px;
    color: white;
    padding: 0 15px;
    margin: 0 20px;
    transition: 0.2s ease;
  }

  input:focus {
    ${props => props.error ? `border: 2px solid red;` : `border: 2px solid ${mainColor};`}
  }
  margin-bottom: 35px;
`;

const ErrorText = styled.div`
  font-size: 0.9em;
  color: red;
  padding-top: 12px;
`

export default function FormField(props) {
  const { width, name, inputName, value, handler, type, icon, error, errorMessage } = props;
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <Field width={width ? width : "300px"} $isfocused={isFocused ? "true" : ''} $error={error}>
      <input
        type={type ? type : "text"}
        onChange={handler}
        value={value}
        name={inputName}
        placeholder={name}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <div className="label">{name}</div>
      {error && <ErrorText>{errorMessage}</ErrorText>}
    </Field>
  );
}
