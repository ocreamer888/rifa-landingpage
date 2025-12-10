import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    // Validate authentication - accept either:
    // 1. Vercel Cron: x-vercel-cron-auth-token header (for production cron jobs)
    // 2. Custom: Authorization Bearer token (for manual/local testing)
    const vercelCronToken = request.headers.get('x-vercel-cron-auth-token');
    const authHeader = request.headers.get('Authorization');
    
    const cronSecret = process.env['CRON_SECRET'];
    const cleanupSecret = process.env['CLEANUP_API_SECRET'];
    
    const isVercelCronValid = cronSecret && vercelCronToken === cronSecret;
    const isCustomAuthValid = cleanupSecret && authHeader === `Bearer ${cleanupSecret}`;
    
    if (!isVercelCronValid && !isCustomAuthValid) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const supabase = await createSupabaseServerClient();
    
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

export async function GET(request: Request) {
  // Allow GET requests for manual cleanup triggers (with same auth)
  return POST(request);
}
