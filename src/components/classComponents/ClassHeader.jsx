import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';
import { GatsbyImage } from 'gatsby-plugin-image';

export const StyledClassHeader = styled.div`
  background: var(--white);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 3rem;
  width: 100%;

  align-items: center;

  h2 {
    font-size: 2rem;
    line-height: 2.625rem;
    margin-bottom: 1rem;
  }

  .gatsby-image-wrapper {
    width: 62%;
    margin-right: 1rem;
  }

  .info {
    padding-left: 1rem;
    padding-right: 2.25rem;
    width: 38%;

    p {
      line-height: 1.875rem;
      font-size: 1.25rem;
      max-width: 33rem;
      color: var(--dark-gray);
    }

    .spots-left {
      margin: 1.25rem 0 3.25rem;

      span {
        background: var(--salmon);
        padding: 0.25rem 0.75rem;
        border-radius: 28px;
        font-size: 0.875rem;
      }
    }

    .price {
      margin-top: 2rem;
      margin-bottom: 1rem;
      font-size: 3rem;
      line-height: 2rem;

      small {
        font-size: 1rem;
        color: var(--dark-gray);
      }

      p {
        margin-top: 1rem;
        color: var(--dark-gray);
      }
    }
  }

  .pricing-buttons {
    list-style-type: none;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0;

    button {
      padding: 1rem 1.5rem;
      border-radius: 2px;
      font-size: 1.25rem;
      font-weight: 900;
      text-decoration: none;
      display: inline;
      color: var(--black);
      cursor: pointer;

      :active {
        transform: translateY(2px) translateX(2px);
      }
    }

    .register {
      border: none;
      background: var(--neon-green);
      border: 2px solid var(--neon-green);

      :hover {
        opacity: 0.6;
      }

      :active {
        transform: translateY(2px) translateX(2px);
      }
    }

    .installment {
      border: 2px solid var(--black);
      background: var(--white);
      border-radius: 2px;

      :hover {
        opacity: 0.6;
      }

      :active {
        transform: translateY(2px) translateX(2px);
      }
    }
  }

  @media (max-width: 1333px) {
    .pricing-buttons {
      flex-direction: column;

      li,
      button {
        width: 100%;
        margin: 0;
      }
    }
  }

  @media (max-width: 970px) {
    flex-direction: column;

    .gatsby-image-wrapper,
    .info {
      width: 100%;
      padding: 0;
    }

    .info {
      padding: 0 1rem;
    }
    .gatsby-image-wrapper {
      margin-bottom: 2rem;
    }
    button {
      width: 100%;
      margin: 1rem auto;
    }
  }
`;

let stripePromise;
const getStripe = (test) => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      test
        ? process.env.GATSBY_STRIPE_PUBLISHABLE_TEST_KEY
        : process.env.GATSBY_STRIPE_PUBLISHABLE_KEY
    );
  }
  return stripePromise;
};

const ClassHeader = ({ class_info }) => {
  const [loading, setLoading] = useState(false);
  const [spotsLeft, setSpotsLeft] = useState(null);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const getSpotsLeft = async (event, class_id) => {
      try {
        const response = await fetch(
          `/.netlify/functions/handle-spotsleft?class_id=${class_info.contentful_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        setSpotsLeft(data.spots_left);
      } catch (err) {
        setError(err.message);
        setSpotsLeft(null);
      } finally {
        setLoading(false);
      }
    };
    getSpotsLeft();
  }, []);

  const handlePurchase = async (e, paymentType) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      test: true,
      paymentType: paymentType,
      promotion: class_info.cost > 0,
      lineItems: [
        {
          price:
            paymentType === 'payment'
              ? class_info.stripeProductId
              : class_info.stripeInstallmentId,
          quantity: 1,
        },
      ],
      dayOfWeek: class_info.day,
      className: class_info.name,
      time: class_info.startTime,
      instructor: class_info.instructors[0].name,
      location: class_info.location,
      slug: class_info.slug,
      classDates: class_info.dates.join(', '),
      session: class_info.session,
    };

    const response = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((res) => res.json());

    const stripe = await getStripe(true);
    const { error } = await stripe.redirectToCheckout({
      sessionId: response.sessionId,
    });
    if (error) {
      console.warn('Error:', error);
      setLoading(false);
    }
  };

  return (
    <StyledClassHeader>
      {class_info.coverImage && (
        <GatsbyImage
          image={class_info.coverImage.gatsbyImageData}
          alt={class_info.name}
        />
      )}
      <div className="info">
        <h2>{class_info.name}</h2>
        <p>{`${class_info.day}, ${class_info.dates[0]} - ${
          class_info.dates[class_info.dates.length - 1]
        }, ${class_info.startTime} - ${class_info.endTime} with ${
          class_info.instructors[0].name
        }`}</p>

        <div className="spots-left">
          <span>
            {spotsLeft == null ? 'Loading' : `${spotsLeft} spots left`}
          </span>
        </div>

        <div className="price">
          {spotsLeft > 0 &&
            (class_info.cost > 0 ? (
              <>
                ${class_info.cost} <br />
                {class_info.stripeInstallmentId && (
                  <small>or pay in three installments (payment plan)</small>
                )}
              </>
            ) : (
              <>Free/Donation</>
            ))}
        </div>

        <ul className="pricing-buttons">
          <li>
            {spotsLeft != null ? (
              spotsLeft > 0 ? (
                <button
                  className={'register'}
                  disabled={loading}
                  onClick={(e) => handlePurchase(e, 'payment')}
                >
                  Register
                </button>
              ) : (
                <button disabled>SOLD OUT</button>
              )
            ) : (
              <button disabled className={'register'}>
                Register
              </button>
            )}
          </li>
          {class_info.stripeInstallmentId && (
            <li>
              <button
                className={'installment'}
                disabled={loading}
                onClick={(e) => handlePurchase(e, 'subscription')}
              >
                Payment Plan
              </button>
            </li>
          )}
        </ul>
      </div>
    </StyledClassHeader>
  );
};
export default ClassHeader;
