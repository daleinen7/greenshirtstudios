exports.handler = async (req) => {
  const class_id = req.queryStringParameters['class_id'];

  try {
    const airtable_res = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}?fields%5B%5D=Student+Name&filterByFormula={Contentful+Entry+ID}="${class_id}"`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const airtable_data = await airtable_res.json();
    const records_num = airtable_data.records.length;

    const contentful_res = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/entries/${class_id}?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`
    );
    const contentful_data = await contentful_res.json();
    const class_size = contentful_data.fields.classSize;

    const spots_left = class_size - records_num;

    return {
      statusCode: 200,
      body: JSON.stringify({ spots_left: spots_left <= 0 ? 0 : spots_left }),
    };
  } catch (err) {
    console.log(err);
  }
};
