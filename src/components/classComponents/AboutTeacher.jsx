import React from 'react';
import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { concatenateName } from '../../utils/utils';

const StyledAboutTeacher = styled.section`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border: 2px solid var(--light-gray);
  border-radius: 2px;
  margin-bottom: 2rem;

  h3 {
    font-size: 1.5rem;
    margin-top: 1rem;
    font-family: 'Lato', sans-serif;
  }

  img {
    margin-bottom: 1rem;
  }

  .bio {
    margin-bottom: 1rem;

    p {
      line-height: 1.5rem;
      margin-top: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
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
  }

  .learn-more {
    margin-top: 1.5rem;
    margin-bottom: 1.25rem;
  }
`;

const AboutTeacher = ({ instructors }) => {
  return (
    <>
      {instructors.map((instructor, idx) => {
        const concatenated_name = concatenateName(
          instructor.name,
          instructor.lastName
        );

        return (
          <StyledAboutTeacher key={idx}>
            <GatsbyImage
              image={instructor.profilePicture.gatsbyImageData}
              alt={concatenated_name}
            />
            <h3>About the Teacher</h3>
            <div className="bio">
              {documentToReactComponents(JSON.parse(instructor.bio.raw))}
            </div>
            <div className="learn-more">
              <Link to={`/${instructor.slug}`} className="button empty">
                {`About ${concatenated_name}`}
              </Link>
            </div>
          </StyledAboutTeacher>
        );
      })}
    </>
  );
};
export default AboutTeacher;
