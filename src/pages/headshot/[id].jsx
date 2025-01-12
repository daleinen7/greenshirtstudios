import React, { useEffect } from 'react';
import { SEO } from '../../components/seo';
import Layout from '../../components/Layout';
import SessionHeader from '../../components/headshotComponents/SessionHeader';
import Description from '../../components/headshotComponents/Description';
import CancellationPolicy from '../../components/headshotComponents/CancellationPolicy';
import SpecialMessage from '../../components/headshotComponents/SpecialMessage';
import AboutPhotographer from '../../components/headshotComponents/AboutPhotographer';
import SessionDetails from '../../components/headshotComponents/SessionDetails';
import styled from 'styled-components';

const StyledPhotographerPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4.6875rem auto;
  padding: 0 4rem;

  .main-content {
    display: flex;
    max-width: 1440px;
    width: 100%;
  }
  .left-column {
    width: 62%;
  }

  .right-column {
    width: 38%;
  }

  .left-column {
    padding-right: 1rem;
  }

  .right-column {
    padding-left: 1rem;
  }
  @media (max-width: 970px) {
    padding: 0;
    margin: 0 auto;
    .main-content {
      flex-direction: column;
      padding: 0 2rem;
      .left-column,
      .right-column {
        width: 100%;
        padding: 0;
      }
      .left-column {
        margin-bottom: 2rem;
      }
      .right-column {
        margin: 2rem auto;
        h3 {
          margin-bottom: 0.5rem;
        }
        section {
          border: rgba(0, 0, 0, 0.1) solid 2px;
          border-radius: 2px;
          padding: 1rem;
          margin: 1rem auto;
        }
        section:nth-of-type(1) {
          border: #f8bcbe solid 2px;
        }

        dt {
          font-weight: bold;
        }
        ul {
          list-style: none;
          padding: 0;
        }
      }
    }
  }
`;

const Headshot = ({ params }) => {
  const [headshotSession, setHeadshotSession] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          '/.netlify/functions/get-headshot-detail',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: params.id }),
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server');
        }
        const data = await response.json();
        setHeadshotSession(data[0].fields);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <Layout>
      <StyledPhotographerPage>
        <SEO title="Headshot" />
        {!headshotSession.error ? (
          headshotSession['Photographer Name'] ? (
            <>
              <SessionHeader session={headshotSession} />
              <div className="main-content">
                <div className="left-column">
                  <Description
                    description={headshotSession['Page Description']}
                  />
                  <CancellationPolicy
                    cancellationPolicy={headshotSession['Cancellation Policy']}
                  />
                </div>
                <div className="right-column">
                  <SpecialMessage
                    specialMessageHeader={
                      headshotSession['Special Message Header']
                    }
                    specialMessage={headshotSession['Special Message']}
                  />
                  <AboutPhotographer
                    name={headshotSession['Photographer Name']}
                    bio={headshotSession['Photographer Bio']}
                    image={headshotSession['Photographer Image']}
                    link={
                      headshotSession['Link to Photographer page on GSS site']
                    }
                  />
                  <SessionDetails session={headshotSession} />
                </div>
              </div>
            </>
          ) : (
            <>loading ... </>
          )
        ) : (
          <>No Headshot Session Found</>
        )}
      </StyledPhotographerPage>
    </Layout>
  );
};
export default Headshot;
