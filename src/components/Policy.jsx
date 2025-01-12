import React from 'react';
import Accordion from './Accordion';
import parse from 'html-react-parser';
import styled from 'styled-components';

const StyledAttendancePolicy = styled.section`
  h3 {
    font-weight: 900;
    font-size: 1.5rem;
  }

  h4 {
    font-size: 1.375rem;
    font-weight: 600;
    margin-top: 0.75rem;
  }

  p {
    font-size: 1.25rem;
    margin-top: 0.75rem;
  }

  ul {
    list-style-type: disc;
    li {
      font-size: 1.25rem;
    }
  }
`;

const AttendancePolicy = ({ title, children }) => {
  return (
    <StyledAttendancePolicy>
      <Accordion title={title} h3>
        {children}
      </Accordion>
    </StyledAttendancePolicy>
  );
};
export default AttendancePolicy;
