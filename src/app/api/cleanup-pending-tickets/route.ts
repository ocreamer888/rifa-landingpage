import { supabase } from '@/lib/supabaseClient';

export async function POST() {
  try {
    // For now, we'll use a simple approach: find orders that are pending
    // and have been created more than 10 minutes ago using the order_number timestamp
    const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
    
    // Find orders that are pending and older than 10 minutes
    const { data: expiredOrders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        order_items (
          ticket_number
        )
      `)
      .eq('status', 'pending');

    if (ordersError) {
      console.error('Error fetching pending orders:', ordersError);
      return Response.json({ error: 'Failed to fetch pending orders' }, { status: 500 });
    }

    if (!expiredOrders || expiredOrders.length === 0) {
      return Response.json({ message: 'No pending orders found', cleaned: 0 });
    }

    // Filter orders that are older than 10 minutes based on order_number timestamp
    const expiredOrdersFiltered = expiredOrders.filter(order => {
      // Extract timestamp from order_number (format: ORD-{timestamp})
      const timestampStr = order.order_number.replace('ORD-', '');
      const orderTimestamp = parseInt(timestampStr);
      return orderTimestamp < tenMinutesAgo;
    });

    if (expiredOrdersFiltered.length === 0) {
      return Response.json({ message: 'No expired orders found', cleaned: 0 });
    }

    // Extract all ticket numbers from expired orders
    const expiredTicketNumbers = expiredOrdersFiltered.flatMap(order => 
      order.order_items?.map((item: { ticket_number: string }) => item.ticket_number) || []
    );

    if (expiredTicketNumbers.length === 0) {
      return Response.json({ message: 'No expired tickets found', cleaned: 0 });
    }

    // Update tickets back to available status
    const { error: ticketsError } = await supabase
      .from('tickets')
      .update({ 
        status: 'available'
      })
      .in('ticket_number', expiredTicketNumbers);

    if (ticketsError) {
      console.error('Error updating tickets:', ticketsError);
      return Response.json({ error: 'Failed to update tickets' }, { status: 500 });
    }

    // Update orders status to cancelled
    const orderIds = expiredOrdersFiltered.map(order => order.id);
    const { error: ordersUpdateError } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .in('id', orderIds);

    if (ordersUpdateError) {
      console.error('Error updating orders:', ordersUpdateError);
      return Response.json({ error: 'Failed to update orders' }, { status: 500 });
    }

    console.log(`Cleaned up ${expiredTicketNumbers.length} tickets from ${expiredOrdersFiltered.length} expired orders`);
    
    return Response.json({ 
      message: 'Successfully cleaned up expired tickets',
      cleaned: expiredTicketNumbers.length,
      orders: expiredOrdersFiltered.length
    });

  } catch (error) {
    console.error('Error in cleanup process:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  // Allow GET requests for manual cleanup triggers
  return POST();
}
