// pages/api/tilopay-token.ts or app/api/tilopay-token/route.ts
export async function POST() {
    try {
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
  
      const tokenData = await response.json();
      return Response.json(tokenData);
    } catch (error) {
      console.error('Error getting TiloPay token:', error);
      return Response.json({ error: 'Failed to get token' }, { status: 500 });
    }
  }