// src/app/api/confirmar-pago-sinpe/route.ts
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createSupabaseServiceClient } from '@/lib/supabase-service';

export async function POST(request: Request) {
  try {
    // Use server client to verify admin authentication
    const authSupabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await authSupabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use service role client for database operations to bypass RLS
    const supabase = createSupabaseServiceClient();

    // Parse request body
    const { orderId } = await request.json();

    if (!orderId) {
      return Response.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Get order with its items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        order_items (
          ticket_number
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    // Allow confirmation for both pending and awaiting_verification orders
    if (order.status !== 'pending' && order.status !== 'awaiting_verification') {
      return Response.json({ 
        error: `Order is already ${order.status}` 
      }, { status: 400 });
    }

    // Get ticket numbers from order items
    const ticketNumbers = order.order_items?.map(
      (item: { ticket_number: number }) => item.ticket_number
    ) || [];

    // Update order status to completed
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', orderId);

    if (updateOrderError) {
      console.error('Error updating order:', updateOrderError);
      return Response.json({ error: 'Failed to update order' }, { status: 500 });
    }

    // Update tickets to sold status
    if (ticketNumbers.length > 0) {
      const { error: updateTicketsError } = await supabase
        .from('tickets')
        .update({ 
          status: 'sold',
          pending_at: null
        })
        .in('ticket_number', ticketNumbers);

      if (updateTicketsError) {
        console.error('Error updating tickets:', updateTicketsError);
        // Rollback order status
        await supabase
          .from('orders')
          .update({ status: 'pending' })
          .eq('id', orderId);
        return Response.json({ error: 'Failed to update tickets' }, { status: 500 });
      }
    }

    console.log(`SINPE payment confirmed for order ${order.order_number}`);

    return Response.json({ 
      success: true,
      message: 'Payment confirmed successfully',
      orderNumber: order.order_number,
      ticketsConfirmed: ticketNumbers.length
    });

  } catch (error) {
    console.error('Error confirming SINPE payment:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

