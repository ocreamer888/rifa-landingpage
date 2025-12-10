// src/app/admin/page.tsx
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

type Order = {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name?: string;
  customer_phone?: string;
  total_amount: number;
  status: 'pending' | 'awaiting_verification' | 'completed' | 'cancelled';
  payment_status?: string;
  created_at?: string;
  user_confirmed_at?: string;
  order_items?: { ticket_number: number }[];
};

type TicketStats = {
  available: number;
  pending: number;
  sold: number;
  total: number;
};

type Tab = 'pending' | 'orders' | 'tickets';

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ticketStats, setTicketStats] = useState<TicketStats>({ available: 0, pending: 0, sold: 0, total: 500 });
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  // Track orders that have been processed (confirmed/cancelled) for visual transition
  const [processedOrders, setProcessedOrders] = useState<Map<string, 'completed' | 'cancelled'>>(new Map());
  // Track orders that are fading out
  const [fadingOut, setFadingOut] = useState<Set<string>>(new Set());

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
        return;
      }
      setUser(user);
      setLoading(false);
    };
    checkAuth();
  }, [router, supabase]);

  // Fetch orders (returns the fetched list for callers that need to inspect it)
  const fetchOrders = useCallback(async (): Promise<Order[] | undefined> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          customer_email,
          customer_name,
          customer_phone,
          total_amount,
          status,
          payment_status,
          created_at,
          user_confirmed_at,
          order_items (
            ticket_number
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }
      if (data) {
        const casted = data as Order[];
        setOrders(casted);
        return casted;
      }
    } catch (err) {
      console.error('Error in fetchOrders:', err);
    }
  }, [supabase]);

  // Fetch ticket stats
  const fetchTicketStats = useCallback(async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('status');

      if (error) {
        console.error('Error fetching ticket stats:', error);
        return;
      }
      if (data) {
        const stats = data.reduce(
          (acc, ticket) => {
            acc[ticket.status as keyof Omit<TicketStats, 'total'>]++;
            return acc;
          },
          { available: 0, pending: 0, sold: 0 }
        );
        const existing = stats.available + stats.pending + stats.sold;
        setTicketStats({
          ...stats,
          available: stats.available + (500 - existing),
          total: 500,
        });
      }
    } catch (err) {
      console.error('Error in fetchTicketStats:', err);
    }
  }, [supabase]);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchTicketStats();
    }
  }, [user, fetchOrders, fetchTicketStats]);

  // Handle SINPE payment confirmation
  const handleConfirmPayment = async (orderId: string) => {
    setConfirming(orderId);
    setMessage(null);

    try {
      const response = await fetch('/api/confirmar-pago-sinpe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Pago confirmado: ${result.orderNumber}` });
        
        // Optimistic UI update: immediately update local state
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: 'completed' as const } : order
        ));
        
        // Track as processed for visual transition
        setProcessedOrders(prev => new Map(prev).set(orderId, 'completed'));
        
        // After 1.5s, start fade out animation
        setTimeout(() => {
          setFadingOut(prev => new Set(prev).add(orderId));
        }, 1500);
        
        // After fade animation (500ms), refresh and only clear tracking once status is updated server-side
        setTimeout(async () => {
          const attemptClear = async (attempt = 0) => {
            const fetched = await fetchOrders();
            await fetchTicketStats();
            const target = fetched?.find(o => o.id === orderId);
            const stillPending = target && (target.status === 'pending' || target.status === 'awaiting_verification');
            
            if (!stillPending || attempt >= 3) {
              setProcessedOrders(prev => {
                const newMap = new Map(prev);
                newMap.delete(orderId);
                return newMap;
              });
              setFadingOut(prev => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
              });
            } else {
              // Keep it hidden and retry shortly to avoid flicker
              setFadingOut(prev => new Set(prev).add(orderId));
              setTimeout(() => attemptClear(attempt + 1), 700);
            }
          };
          await attemptClear(0);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Error al confirmar pago' });
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      setMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setConfirming(null);
    }
  };

  // Handle order cancellation/rejection
  const handleCancelOrder = async (orderId: string) => {
    setCancelling(orderId);
    setMessage(null);

    try {
      const response = await fetch('/api/cancel-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Orden cancelada: ${result.orderNumber}. ${result.ticketsReleased} números liberados.` });
        
        // Optimistic UI update: immediately update local state
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' as const } : order
        ));
        
        // Track as processed for visual transition
        setProcessedOrders(prev => new Map(prev).set(orderId, 'cancelled'));
        
        // After 1.5s, start fade out animation
        setTimeout(() => {
          setFadingOut(prev => new Set(prev).add(orderId));
        }, 1500);
        
        // After fade animation (500ms), refresh and only clear tracking once status is updated server-side
        setTimeout(async () => {
          const attemptClear = async (attempt = 0) => {
            const fetched = await fetchOrders();
            await fetchTicketStats();
            const target = fetched?.find(o => o.id === orderId);
            const stillPending = target && (target.status === 'pending' || target.status === 'awaiting_verification');
            
            if (!stillPending || attempt >= 3) {
              setProcessedOrders(prev => {
                const newMap = new Map(prev);
                newMap.delete(orderId);
                return newMap;
              });
              setFadingOut(prev => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
              });
            } else {
              // Keep it hidden and retry shortly to avoid flicker
              setFadingOut(prev => new Set(prev).add(orderId));
              setTimeout(() => attemptClear(attempt + 1), 700);
            }
          };
          await attemptClear(0);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Error al cancelar orden' });
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setCancelling(null);
    }
  };

  // Handle logout
  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }, [supabase, router]);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  // Get pending orders (for SINPE confirmation) - prioritize awaiting_verification
  // Include processed orders during their transition period so they show the status update
  const pendingOrders = orders
    .filter((order) => 
      order.status === 'pending' || 
      order.status === 'awaiting_verification' ||
      processedOrders.has(order.id) // Keep processed orders visible during transition
    )
    .sort((a, b) => {
      // Put processed orders at the end during their transition
      const aProcessed = processedOrders.has(a.id);
      const bProcessed = processedOrders.has(b.id);
      if (aProcessed && !bProcessed) return 1;
      if (!aProcessed && bProcessed) return -1;
      // Prioritize awaiting_verification
      if (a.status === 'awaiting_verification' && b.status !== 'awaiting_verification') return -1;
      if (a.status !== 'awaiting_verification' && b.status === 'awaiting_verification') return 1;
      return 0;
    });

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { class: 'bg-emerald-500/20 text-emerald-400', label: 'Completado' };
      case 'awaiting_verification':
        return { class: 'bg-blue-500/20 text-blue-400', label: 'Usuario Confirmó' };
      case 'pending':
        return { class: 'bg-amber-500/20 text-amber-400', label: 'Pendiente' };
      case 'cancelled':
        return { class: 'bg-slate-500/20 text-slate-400', label: 'Cancelado' };
      default:
        return { class: 'bg-slate-500/20 text-slate-400', label: status };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white">Panel Administrativo</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-sm hidden sm:block">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Banner */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            <p className="flex items-center gap-2">
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {message.text}
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Disponibles</p>
                <p className="text-2xl font-bold text-emerald-400">{ticketStats.available}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Pendientes</p>
                <p className="text-2xl font-bold text-amber-400">{ticketStats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Vendidos</p>
                <p className="text-2xl font-bold text-rose-400">{ticketStats.sold}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Órdenes</p>
                <p className="text-2xl font-bold text-blue-400">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-800/30 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Pagos Pendientes
            {pendingOrders.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-amber-600 rounded-full">
                {pendingOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Todas las Órdenes
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'tickets'
                ? 'bg-amber-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Resumen Tickets
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden">
          {/* Pending SINPE Payments */}
          {activeTab === 'pending' && (
            <div>
              <div className="p-6 border-b border-slate-700/50">
                <h2 className="text-xl font-bold text-white">Pagos SINPE Pendientes de Verificación</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Las órdenes marcadas como &quot;Usuario Confirmó&quot; requieren verificación prioritaria
                </p>
              </div>
              {pendingOrders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-slate-400">No hay pagos pendientes</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/50">
                  {pendingOrders.map((order) => {
                    const processedStatus = processedOrders.get(order.id);
                    const isFading = fadingOut.has(order.id);
                    const isProcessed = !!processedStatus;
                    // Use processed status for badge if available, otherwise use actual status
                    const displayStatus = processedStatus || order.status;
                    const statusBadge = getStatusBadge(displayStatus);
                    const isAwaitingVerification = order.status === 'awaiting_verification' && !isProcessed;
                    
                    return (
                      <div 
                        key={order.id} 
                        className={`p-6 transition-all duration-500 ${
                          isFading 
                            ? 'opacity-0 scale-95 max-h-0 py-0 overflow-hidden' 
                            : isProcessed
                              ? processedStatus === 'completed'
                                ? 'bg-emerald-500/10 border-l-4 border-emerald-500'
                                : 'bg-rose-500/10 border-l-4 border-rose-500'
                              : isAwaitingVerification 
                                ? 'bg-blue-500/5 hover:bg-blue-500/10 border-l-4 border-blue-500' 
                                : 'hover:bg-slate-700/20'
                        }`}
                      >
                        <div className="flex flex-col gap-4">
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-mono text-amber-400 font-bold">{order.order_number}</span>
                                <span className={`px-2 py-1 text-xs rounded-full transition-all duration-300 ${statusBadge.class}`}>
                                  {statusBadge.label}
                                </span>
                                {isAwaitingVerification && (
                                  <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full animate-pulse">
                                    Verificar
                                  </span>
                                )}
                                {isProcessed && (
                                  <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                                    processedStatus === 'completed' 
                                      ? 'bg-emerald-500 text-white' 
                                      : 'bg-rose-500 text-white'
                                  }`}>
                                    {processedStatus === 'completed' ? (
                                      <>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Confirmado
                                      </>
                                    ) : (
                                      <>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Rechazado
                                      </>
                                    )}
                                  </span>
                                )}
                              </div>
                              
                              {/* Customer Info */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                {order.customer_name && (
                                  <p className="text-white">
                                    <span className="text-slate-500">Nombre:</span> {order.customer_name}
                                  </p>
                                )}
                                <p className="text-slate-300">
                                  <span className="text-slate-500">Email:</span> {order.customer_email}
                                </p>
                                {order.customer_phone && (
                                  <p className="text-slate-300">
                                    <span className="text-slate-500">Tel:</span> {order.customer_phone}
                                  </p>
                                )}
                              </div>
                              
                              <p className="text-slate-500 text-sm mt-2">
                                <span className="text-slate-600">Números:</span>{' '}
                                <span className="font-mono">{order.order_items?.map((i) => i.ticket_number).join(', ') || 'N/A'}</span>
                              </p>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-2xl font-bold text-white">${order.total_amount}</p>
                              <p className="text-slate-500 text-sm">
                                {order.created_at
                                  ? new Date(order.created_at).toLocaleDateString('es-CR', {
                                      day: '2-digit',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : 'N/A'}
                              </p>
                              {order.user_confirmed_at && (
                                <p className="text-blue-400 text-xs mt-1">
                                  Confirmó: {new Date(order.user_confirmed_at).toLocaleTimeString('es-CR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Action Buttons - Hide when processed */}
                          {!isProcessed && (
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                              <button
                                onClick={() => handleConfirmPayment(order.id)}
                                disabled={confirming === order.id || cancelling === order.id}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                              >
                                {confirming === order.id ? (
                                  <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Confirmando...
                                  </span>
                                ) : (
                                  <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Confirmar Pago
                                  </span>
                                )}
                              </button>
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={confirming === order.id || cancelling === order.id}
                                className="flex-1 px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-xl hover:bg-rose-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                              >
                                {cancelling === order.id ? (
                                  <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Cancelando...
                                  </span>
                                ) : (
                                  <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Rechazar / Cancelar
                                  </span>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* All Orders */}
          {activeTab === 'orders' && (
            <div>
              <div className="p-6 border-b border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Todas las Órdenes</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Historial completo de órdenes
                  </p>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="awaiting_verification">Usuario Confirmó</option>
                  <option value="completed">Completados</option>
                  <option value="cancelled">Cancelados</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Orden
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Números
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredOrders.map((order) => {
                      const statusBadge = getStatusBadge(order.status);
                      return (
                        <tr key={order.id} className="hover:bg-slate-700/20 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-amber-400">{order.order_number}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              {order.customer_name && (
                                <p className="text-white font-medium">{order.customer_name}</p>
                              )}
                              <p className="text-slate-400 text-sm">{order.customer_email}</p>
                              {order.customer_phone && (
                                <p className="text-slate-500 text-xs">{order.customer_phone}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-300 text-sm font-mono">
                              {order.order_items?.map((i) => i.ticket_number).join(', ') || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-white font-semibold">${order.total_amount}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusBadge.class}`}>
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-slate-400 text-sm">
                              {order.created_at
                                ? new Date(order.created_at).toLocaleDateString('es-CR', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : 'N/A'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-slate-400">No hay órdenes para mostrar</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tickets Overview */}
          {activeTab === 'tickets' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Resumen de Tickets</h2>
              
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progreso de Ventas</span>
                  <span className="text-white font-semibold">
                    {ticketStats.sold} / {ticketStats.total} vendidos
                  </span>
                </div>
                <div className="h-4 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-500"
                      style={{ width: `${(ticketStats.sold / ticketStats.total) * 100}%` }}
                    />
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                      style={{ width: `${(ticketStats.pending / ticketStats.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="text-slate-400">Vendidos ({ticketStats.sold})</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-slate-400">Pendientes ({ticketStats.pending})</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-400">Disponibles ({ticketStats.available})</span>
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
                  <div className="text-5xl font-bold text-emerald-400 mb-2">{ticketStats.available}</div>
                  <p className="text-emerald-300">Tickets Disponibles</p>
                  <p className="text-emerald-400/60 text-sm mt-1">
                    {((ticketStats.available / ticketStats.total) * 100).toFixed(1)}% del total
                  </p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center">
                  <div className="text-5xl font-bold text-amber-400 mb-2">{ticketStats.pending}</div>
                  <p className="text-amber-300">Tickets Pendientes</p>
                  <p className="text-amber-400/60 text-sm mt-1">
                    Esperando confirmación de pago
                  </p>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-center">
                  <div className="text-5xl font-bold text-rose-400 mb-2">{ticketStats.sold}</div>
                  <p className="text-rose-300">Tickets Vendidos</p>
                  <p className="text-rose-400/60 text-sm mt-1">
                    ${ticketStats.sold * 20} recaudados
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
