import React from 'react';
import styled from 'styled-components';
import { concatenateName } from '../../utils/utils';

const StyledClassDetails = styled.section`
  border: 2px solid var(--light-gray);
  border-radius: 2px;
  padding: 1.5rem;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  dl {
    display: grid;
    grid-template-columns: 6.9375rem auto;

    dt {
      margin-top: 0;
    }
  }

  dt {
    font-weight: 900;
    margin-bottom: 1.5rem;
  }

  ul {
    list-style-type: none;
    margin: 0 0 1.5rem;
    padding: 0;
  }

  .location {
    margin-bottom: 1rem;
  }
`;

const ClassDetails = ({ class_info }) => {
  return (
    <StyledClassDetails>
      <h3>Class Details</h3>
      <div className="details">
        <dl>
          <dt>Day</dt>
          <dd>{class_info.day}</dd>
          <dt>Time</dt>
          <dd>
            {class_info.startTime} - {class_info.endTime}
          </dd>
          <dt>Dates</dt>
          <dd>
            <ul>
              {class_info.dates.map((date, idx) => {
                const [year, month, day] = date.split('-');
                const date_obj = new Date(year, month - 1, day);
                return (
                  <li key={idx}>
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }).format(date_obj)}
                  </li>
                );
              })}
            </ul>
          </dd>
          <dt>Location</dt>
          <dd className="location">{class_info.location}</dd>
          <dt>Instructors</dt>
          <dd>
            {class_info.instructors.map((instructor, idx) => (
              <span key={idx}>
                {idx > 0 && ', '}
                {concatenateName(instructor.name, instructor.lastName)}
              </span>
            ))}
          </dd>
          <dt>Class Size</dt>
          <dd>{class_info.classSize}</dd>
          <dt>Age</dt>
          <dd>{class_info.age}</dd>
          <dt>Cost</dt>
          <dd>${class_info.cost}</dd>
        </dl>
      </div>
    </StyledClassDetails>
  );
};
export default ClassDetails;
