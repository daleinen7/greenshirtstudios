const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async ({ body, headers }) => {
  console.log('BODY: ', body);

  try {
    // check the webhook to make sure it’s valid
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_AIRTABLE_TEST_SECRET
    );

    console.log('STRIPE EVENT: ', stripeEvent);
    console.log(
      "CHECKING IF STRIPE EVENT TYPE IS 'checkout.session.completed': ",
      stripeEvent.type === 'checkout.session.completed'
    );

    // only do stuff if this is a successful Stripe Checkout purchase
    if (stripeEvent.type === 'checkout.session.completed') {
      const eventObject = stripeEvent.data.object;
      const metadata = stripeEvent.data.object.metadata;
      // console.log('Metadata: ', metadata);

      // return if a headshot webhook
      if (metadata['Record ID']) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            received: true,
            message: 'Headshot webhook; no need to do anything',
          }),
        };
      } else {
        const airtableEndpoint = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/`;

        // const event = body.data.object;

        // Update the Airtable record using the fetch API
        const airtableUpdateResponse = await fetch(airtableEndpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            records: [
              {
                fields: {
                  'Stripe Transaction ID': eventObject.id,
                  'Student Name': eventObject.customer_details.name,
                  'Email Address': eventObject.customer_details.email,
                  'Phone Number': eventObject.customer_details.phone,
                  'Payment Amount': eventObject.amount_total,
                  Session: eventObject.metadata.session,
                  'Class Title': eventObject.metadata.className,
                  'Class Time': eventObject.metadata.time,
                  'Day of Week': eventObject.metadata.dayOfWeek,
                  Instructor: eventObject.metadata.instructor,
                  'Class Dates': eventObject.metadata.classDates,
                  Location: eventObject.metadata.location,
                  'Contentful Entry ID': eventObject.metadata.contentfulEntryId,
                },
              },
            ],
          }),
        });

        // Get the response from Airtable
        const airtableUpdateData = await airtableUpdateResponse.json();
        console.log('Airtable Update Response: ', airtableUpdateData);

        console.log('Webhook successful!');

        return {
          statusCode: 200,
          body: JSON.stringify({ received: true, message: airtableUpdateData }),
        };
      }
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
