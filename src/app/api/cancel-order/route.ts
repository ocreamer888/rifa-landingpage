// src/app/api/cancel-order/route.ts
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

    // Only cancel orders that are pending or awaiting_verification
    if (order.status !== 'pending' && order.status !== 'awaiting_verification') {
      return Response.json({ 
        error: `Cannot cancel order with status: ${order.status}` 
      }, { status: 400 });
    }

    // Get ticket numbers from order items
    const ticketNumbers = order.order_items?.map(
      (item: { ticket_number: number }) => item.ticket_number
    ) || [];

    // Update order status to cancelled
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId);

    if (updateOrderError) {
      console.error('Error updating order:', updateOrderError);
      return Response.json({ error: 'Failed to update order' }, { status: 500 });
    }

    // Release tickets back to available
    if (ticketNumbers.length > 0) {
      const { error: updateTicketsError } = await supabase
        .from('tickets')
        .update({ 
          status: 'available',
          pending_at: null
        })
        .in('ticket_number', ticketNumbers);

      if (updateTicketsError) {
        console.error('Error updating tickets:', updateTicketsError);
        // Rollback order status
        await supabase
          .from('orders')
          .update({ status: order.status })
          .eq('id', orderId);
        return Response.json({ error: 'Failed to release tickets' }, { status: 500 });
      }
    }

    console.log(`Order ${order.order_number} cancelled, ${ticketNumbers.length} tickets released`);

    return Response.json({ 
      success: true,
      message: 'Order cancelled successfully',
      orderNumber: order.order_number,
      ticketsReleased: ticketNumbers.length
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

