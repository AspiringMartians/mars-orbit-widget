// Netlify serverless function (horizons.js)
// Deploy this in Netlify functions directory

export async function handler(event, context) {
  const planetId = event.queryStringParameters.planetId;
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const tomorrow = new Date(now.getTime() + 86400000).toISOString().split('T')[0];


  if (!planetId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing planetId parameter' })
    };
  }

  const horizonsUrl = `https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='${planetId}'&MAKE_EPHEM='YES'&EPHEM_TYPE='VECTORS'&CENTER='500@0'&START_TIME='${today}'&STOP_TIME='${tomorrow}'&STEP_SIZE='1 d'`;

  try {
    const res = await fetch(horizonsUrl);
    const body = await res.text();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain'
      },
      body
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from JPL Horizons', details: error.message })
    };
  }
}
