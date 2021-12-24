import React from "react";
import styled from "styled-components";

const Input = (props) => {
  const { text, children, boxSizing, border, display, color, margin } = props;
  const labelStyle = { display, color };
  const styles = { boxSizing, border, display, margin };
  return (
    <ElLabel {...labelStyle}>
      {text}
      <ElInput {...styles} />
    </ElLabel>
  );
};

const ElLabel = styled.label`
  font-size: 20px;
  font-weight: normal;
  ${(props) => (props.color ? `color: ${props.color};` : "")}
`;

const ElInput = styled.input`
  width: 498px;
  height: 62px;
  border-radius: 11px;
  font-size: 24px;
  padding-left: 21px;
  background-color: #f4f4f4;
  ${(props) => (props.boxSizing ? `box-sizing: border-box;` : "")}
  ${(props) => (props.border ? `border: ${props.border};` : "")}
  ${(props) => (props.display ? `display: ${props.display};` : "")}
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
`;

export default Input;
