const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async ({ body, headers }) => {
  try {
    // check the webhook to make sure it’s valid
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // only do stuff if this is a successful Stripe Checkout purchase
    if (stripeEvent.type === 'checkout.session.completed') {
      const eventObject = stripeEvent.data.object;

      // Immediately respond to Stripe
      let responseBody = { received: true };

      // if purchase is a subscription
      if (eventObject.mode === 'subscription') {
        const date = new Date();
        const oneMonthOut = new Date(date.setMonth(date.getMonth() + 1));

        await stripe.subscriptions.retrieve(eventObject.subscription);

        console.log('This should cancel.');

        await stripe.subscriptions.update(eventObject.subscription, {
          cancel_at: oneMonthOut,
        });

        responseBody.subscriptionUpdated = true;
      }

      return {
        statusCode: 200,
        body: JSON.stringify(responseBody),
      };
    }

    return { statusCode: 200, body: 'no purpose' };
  } catch (err) {
    console.log(`Stripe webhook failed with ${err}`);

    return {
      statusCode: 400,
      body: `Webhook Error: ${err}`,
    };
  }
};
