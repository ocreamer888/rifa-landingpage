// src/app/api/tilopay-token/route.ts
export async function POST() {
  try {
    console.log('Requesting token from TiloPay...');
    console.log('Using credentials:', {
      apiuser: process.env['TILOPAY_API_USER'] ? 'SET' : 'NOT SET',
      password: process.env['TILOPAY_API_PASSWORD'] ? 'SET' : 'NOT SET',
      key: process.env['TILOPAY_API_KEY'] ? 'SET' : 'NOT SET'
    });

    const response = await fetch("https://app.tilopay.com/api/v1/loginSdk", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiuser: process.env['TILOPAY_API_USER']!,
        password: process.env['TILOPAY_API_PASSWORD']!,
        key: process.env['TILOPAY_API_KEY']!
      })
    });

    console.log('TiloPay response status:', response.status);
    const tokenData = await response.json();
    console.log('TiloPay response data:', tokenData);
    
    // TiloPay might return the token in different field names
    const token = tokenData.token || tokenData.access_token || tokenData.accessToken || tokenData.data?.token;
    
    if (!token) {
      console.error('No token found in response:', tokenData);
      return Response.json({ error: 'No token received from TiloPay', response: tokenData }, { status: 500 });
    }

    return Response.json({ access_token: token });
  } catch (error) {
    console.error('Error getting TiloPay token:', error);
    return Response.json({ error: 'Failed to get token' }, { status: 500 });
  }
}