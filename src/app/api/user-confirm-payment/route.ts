// src/app/api/user-confirm-payment/route.ts
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { orderId, token } = await request.json();

    // Validate required fields
    if (!orderId || !token) {
      return Response.json({ error: 'Order ID and token are required' }, { status: 400 });
    }

    // Get the order and validate the token in one query
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, status, confirmation_token')
      .eq('id', orderId)
      .eq('confirmation_token', token) // Token must match
      .single();

    if (orderError || !order) {
      // Don't reveal whether order exists or token is wrong
      return Response.json({ error: 'Invalid request' }, { status: 403 });
    }

    // Check if order is still pending
    if (order.status !== 'pending') {
      return Response.json({ 
        error: `Order is already ${order.status}` 
      }, { status: 400 });
    }

    // Update order status to awaiting_verification
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: 'awaiting_verification',
        user_confirmed_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return Response.json({ error: 'Failed to update order status' }, { status: 500 });
    }

    console.log(`User confirmed payment for order ${order.order_number}`);

    return Response.json({ 
      success: true,
      message: 'Payment confirmation received. Admin will verify shortly.',
      orderNumber: order.order_number
    });

  } catch (error) {
    console.error('Error in user confirm payment:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

