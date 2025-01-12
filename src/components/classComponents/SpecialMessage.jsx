import React from 'react';
import parse from 'html-react-parser';
import styled from 'styled-components';

const StyledSpecialMessage = styled.section`
  border: 2px solid var(--salmon);
  border-radius: 2px;
  padding: 1.5rem;
  margin-bottom: 2rem;

  h3 {
    margin-bottom: 1rem;
    font-family: 'Lato', sans-serif;
    font-weight: 900;
    font-size: 1.5rem;
  }

  p {
    line-height: 1.5rem;
  }

  a {
    padding: 0 !important;
    margin-top: 0 !important;
    border: none !important;
    color: var(--black);

    :hover {
      color: var(--neon-green);
    }
  }
`;

const SpecialMessage = ({ title, content }) => {
  return (
    <StyledSpecialMessage>
      {title && <h3>{title}</h3>}
      {content}
    </StyledSpecialMessage>
  );
};
export default SpecialMessage;
