// components/RifaNumbers.tsx
'use client';

import { useEffect, useState, useMemo, useCallback, startTransition, useRef } from 'react';
import { createSupabaseBrowserClient } from '../lib/supabase-browser';
import type { RealtimeChannel } from '@supabase/supabase-js';

// SINPE Configuration - Update these values
const SINPE_CONFIG = {
  phoneNumber: '6113-9008', // Replace with actual SINPE phone number
  accountHolder: 'Jean Pierre', // Replace with actual account holder name
  reservationMinutes: 10, // Minutes before reservation expires
};

// Define the type for a single ticket
type Ticket = {
  id: number;
  ticket_number: number;
  status: 'available' | 'pending' | 'sold';
  pending_at?: string;
};

// Order type
type Order = {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name?: string;
  customer_phone?: string;
  total_amount: number;
  status: string;
  created_at?: string;
  confirmation_token?: string;
};

export default function RifaNumbers() {
  // Create Supabase client once
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  
  // Customer info states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Payment flow states
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const expiryTimeRef = useRef<number | null>(null);

  // Normalize to exactly 500 tickets (fill missing numbers as available)
  const displayTickets = useMemo(() => {
    const byNumber = new Map<number, Ticket>(tickets.map((t) => [t.ticket_number, t]));
    return Array.from({ length: 500 }, (_, i) => {
      const n = i + 1;
      const t = byNumber.get(n);
      return t ?? ({ id: -(n), ticket_number: n, status: 'available' } as Ticket);
    });
  }, [tickets]);

  // Stats (memoized) based on normalized list
  const soldCount = useMemo(() => displayTickets.reduce((acc, t) => acc + (t.status === 'sold' ? 1 : 0), 0), [displayTickets]);
  const availableCount = useMemo(() => 500 - soldCount, [soldCount]);
  const pendingCount = useMemo(() => displayTickets.reduce((acc, t) => acc + (t.status === 'pending' ? 1 : 0), 0), [displayTickets]);

  // Fetch initial ticket data
  useEffect(() => {
    const fetchTickets = async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('id,ticket_number,status')
        .order('ticket_number', { ascending: true });

      if (error) {
        console.error('Error fetching tickets:', error);
        setError('No se pudieron cargar los números. Por favor, recarga la página.');
      } else {
        setTickets(data as Ticket[]);
      }
    };

    fetchTickets();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    let ticketsChannel: RealtimeChannel;
    let ordersChannel: RealtimeChannel;

    const setupRealtimeSubscriptions = () => {
      ticketsChannel = supabase
        .channel('tickets-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tickets' },
          (payload) => {
            console.log('Ticket cambió:', payload);
            
            if (payload.eventType === 'UPDATE') {
              const updatedTicket = payload.new as Ticket;
              setTickets(prev => 
                prev.map(t => t.id === updatedTicket.id ? updatedTicket : t)
              );
            } else if (payload.eventType === 'INSERT') {
              const newTicket = payload.new as Ticket;
              setTickets(prev => [...prev, newTicket]);
            }
          }
        )
        .subscribe((status) => {
          console.log('Realtime tickets status:', status);
          if (status === 'SUBSCRIBED') {
            setRealtimeStatus('connected');
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setRealtimeStatus('error');
          }
        });

      ordersChannel = supabase
        .channel('orders-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload) => {
            console.log('Order cambió:', payload);
            // Check if our order was confirmed by admin
            if (payload.eventType === 'UPDATE' && currentOrder && payload.new['id'] === currentOrder.id) {
              const newStatus = payload.new['status'];
              if (newStatus === 'completed') {
                setPaymentConfirmed(true);
                setSuccessMessage('¡Tu pago ha sido confirmado! Los números son tuyos.');
                handleClosePaymentInstructions();
              } else if (newStatus === 'cancelled') {
                setError('Tu reservación ha sido cancelada.');
                handleClosePaymentInstructions();
              }
            }
            // Refresh tickets on any order status change
            if (payload.eventType === 'UPDATE') {
              supabase
                .from('tickets')
                .select('id,ticket_number,status')
                .order('ticket_number', { ascending: true })
                .then(({ data, error }) => {
                  if (!error && data) {
                    setTickets(data as Ticket[]);
                  }
                });
            }
          }
        )
        .subscribe((status) => {
          console.log('Realtime orders status:', status);
        });
    };

    setupRealtimeSubscriptions();

    return () => {
      if (ticketsChannel) supabase.removeChannel(ticketsChannel);
      if (ordersChannel) supabase.removeChannel(ordersChannel);
    };
  }, [currentOrder]);

  // Countdown timer effect
  useEffect(() => {
    if (showPaymentInstructions && expiryTimeRef.current) {
      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((expiryTimeRef.current! - now) / 1000));
        setTimeRemaining(remaining);
        
        if (remaining <= 0) {
          // Time expired - cancel the reservation
          handleTimeExpired();
        }
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [showPaymentInstructions]);

  const handleTicketClick = useCallback((ticketNumber: number, status: string) => {
    if (status !== 'available') return;

    startTransition(() => {
      setSelectedTickets((prev) =>
        prev.includes(ticketNumber)
          ? prev.filter((n) => n !== ticketNumber)
          : [...prev, ticketNumber]
      );
    });
  }, []);

  const validateBeforePay = () => {
    if (selectedTickets.length === 0) {
      setError('Por favor selecciona al menos un número.');
      return false;
    }
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre completo.');
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor ingresa un correo electrónico válido.');
      return false;
    }
    if (!phone || phone.length < 8) {
      setError('Por favor ingresa un número de teléfono válido.');
      return false;
    }
    setError(null);
    return true;
  };

  const TICKET_PRICE = 20;

  const createOrder = async () => {
    if (!validateBeforePay()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const orderData = {
        order_number: `ORD-${Date.now()}`,
        customer_email: email,
        customer_name: name,
        customer_phone: phone,
        total_amount: selectedTickets.length * TICKET_PRICE,
        status: 'pending'
        // confirmation_token is auto-generated by the database
      };
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select('*, confirmation_token')
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = selectedTickets.map(ticketNumber => ({
        order_id: order.id,
        ticket_id: ticketNumber,
        ticket_number: ticketNumber,
        price: TICKET_PRICE
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Update tickets to pending
      await supabase
        .from('tickets')
        .update({ status: 'pending' })
        .in('ticket_number', selectedTickets);
      
      // Set current order and show SINPE instructions
      setCurrentOrder(order as Order);
      
      // Set expiry time (10 minutes from now)
      expiryTimeRef.current = Date.now() + (SINPE_CONFIG.reservationMinutes * 60 * 1000);
      setTimeRemaining(SINPE_CONFIG.reservationMinutes * 60);
      
      setShowPaymentInstructions(true);
      
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Error al crear la reservación. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeExpired = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setError('El tiempo para realizar el pago ha expirado. Los números han sido liberados.');
    
    // The cleanup API will handle releasing the tickets
    // Just close the modal and reset state
    handleClosePaymentInstructions();
  };

  const handleConfirmPayment = async () => {
    if (!currentOrder || !currentOrder.confirmation_token) return;
    
    try {
      setConfirmingPayment(true);
      
      const response = await fetch('/api/user-confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: currentOrder.id,
          token: currentOrder.confirmation_token 
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setPaymentConfirmed(true);
        setSuccessMessage('¡Gracias! Tu confirmación ha sido recibida. El administrador verificará el pago pronto.');
      } else {
        setError(result.error || 'Error al confirmar el pago.');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      setError('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      setConfirmingPayment(false);
    }
  };

  const handleClosePaymentInstructions = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setShowPaymentInstructions(false);
    setCurrentOrder(null);
    setSelectedTickets([]);
    setName('');
    setEmail('');
    setPhone('');
    setPaymentConfirmed(false);
    expiryTimeRef.current = null;
  };

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="ticket-grid" className="min-h-screen w-full justify-center items-center text-white pb-12">
      <div className="w-full mx-auto backdrop-blur p-2 md:p-4 lg:p-8 py-8 rounded-3xl bg-black/80">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">¡Compra Tu Número de La Suerte!</h1>
          <p className="text-xl text-gray-100">500 Números, 1 Gran Premio</p>
          {realtimeStatus === 'connected' && (
            <div className="text-green-400 text-sm flex items-center justify-center gap-2 mt-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Actualizaciones en tiempo real activas
            </div>
          )}
          {realtimeStatus === 'error' && (
            <div className="text-yellow-400 text-sm flex items-center justify-center gap-2 mt-2">
              ⚠ Reconectando actualizaciones en tiempo real...
            </div>
          )}
        </header>
        
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-center">
            <p className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {successMessage}
            </p>
          </div>
        )}
        
        {/* Stats Bar */}
        <div className="flex justify-around bg-gray-800 p-4 rounded-3xl mb-8">
          <div className="text-center">
            <span className="text-3xl font-bold text-green-400">{availableCount}</span>
            <p className="text-gray-400">Disponibles</p>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-red-400">{soldCount}</span>
            <p className="text-gray-400">Vendidos</p>
          </div>
          {pendingCount > 0 && (
            <div className="text-center">
              <span className="text-3xl font-bold text-yellow-400">{pendingCount}</span>
              <p className="text-gray-400">Pendientes</p>
            </div>
          )}
        </div>

        {/* Ticket Grid */}
        <div className="mb-8">
          <VirtualTicketGrid
            tickets={displayTickets}
            selected={selectedTickets}
            onClick={handleTicketClick}
          />
        </div>

        {/* Checkout Section */}
        <div className="bg-gray-800 p-4 rounded-3xl">
          <h2 className="text-2xl font-bold p-4">Números Seleccionados</h2>
          {selectedTickets.length > 0 ? (
            <>
              <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Números:</p>
                <p className="font-mono text-lg">{selectedTickets.sort((a, b) => a - b).join(', ')}</p>
              </div>
              <p className="text-lg mb-2">
                Cantidad: <span className="font-bold">{selectedTickets.length}</span>
              </p>
              <p className="text-2xl mb-6 text-green-400">
                Total: <span className="font-bold">${selectedTickets.length * TICKET_PRICE}</span>
              </p>
              
              {/* Customer Info Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full p-3 rounded-full bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full p-3 rounded-full bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Tu número de SINPE"
                    className="w-full p-3 rounded-full bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={createOrder}
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold rounded-3xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Reservando...
                  </span>
                ) : (
                  'Reservar y Ver Instrucciones de Pago'
                )}
              </button>
            </>
          ) : (
            <p className="text-gray-400">Haz click o tappea sobre cualquier número disponible para seleccionarlo.</p>
          )}
          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
      </div>
      
      {/* SINPE Payment Instructions Modal */}
      {showPaymentInstructions && currentOrder && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Instrucciones de Pago</h2>
                  <p className="text-slate-400 text-sm">Orden: {currentOrder.order_number}</p>
                </div>
                {!paymentConfirmed && (
                  <button
                    onClick={handleClosePaymentInstructions}
                    className="text-slate-400 hover:text-white text-2xl leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
              
              {/* Timer */}
              {!paymentConfirmed && (
                <div className={`mb-6 p-4 rounded-xl text-center ${
                  timeRemaining <= 60 ? 'bg-red-500/20 border border-red-500/50' : 'bg-amber-500/20 border border-amber-500/50'
                }`}>
                  <p className={`text-sm ${timeRemaining <= 60 ? 'text-red-400' : 'text-amber-400'}`}>
                    Tiempo restante para completar el pago
                  </p>
                  <p className={`text-4xl font-mono font-bold ${timeRemaining <= 60 ? 'text-red-400' : 'text-amber-400'}`}>
                    {formatTime(timeRemaining)}
                  </p>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-slate-800/50 p-4 rounded-xl mb-6">
                <h3 className="font-semibold text-white mb-3">Resumen de tu Reservación</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Números:</span>
                    <span className="text-white font-mono">{selectedTickets.sort((a, b) => a - b).join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cantidad:</span>
                    <span className="text-white">{selectedTickets.length}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-700">
                    <span className="text-white">Total a pagar:</span>
                    <span className="text-green-400">${currentOrder.total_amount}</span>
                  </div>
                </div>
              </div>

              {/* SINPE Instructions */}
              {!paymentConfirmed && (
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-bold text-green-400 text-lg">Pago por SINPE Móvil</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-slate-800/80 p-3 rounded-lg">
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Enviar a:</p>
                      <p className="text-white text-xl font-bold font-mono">{SINPE_CONFIG.phoneNumber}</p>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-lg">
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">A nombre de:</p>
                      <p className="text-white font-semibold">{SINPE_CONFIG.accountHolder}</p>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-lg">
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Monto exacto:</p>
                      <p className="text-green-400 text-2xl font-bold">₡{(currentOrder.total_amount * 500).toLocaleString()}</p>
                      <p className="text-slate-500 text-xs">(${currentOrder.total_amount} USD)</p>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-lg">
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Descripción/Detalle:</p>
                      <p className="text-white font-mono text-sm">{currentOrder.order_number}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-200 text-sm mt-4">
                    <strong className="text-amber-400">Importante:</strong> Haz la transacción desde el número SINPE registrado en la app o incluye el número de orden en la descripción del SINPE para facilitar la verificación.
                  </p>
                </div>
              )}

              {/* Payment Confirmed Message */}
              {paymentConfirmed && (
                <div className="bg-green-500/20 border border-green-500/50 p-6 rounded-xl mb-6 text-center">
                  <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-green-400 mb-2">¡Confirmación Recibida!</h3>
                  <p className="text-slate-300">
                    Tu confirmación de pago ha sido enviada. El administrador verificará el pago y confirmarás por correo electrónico.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {!paymentConfirmed ? (
                  <>
                    <button
                      onClick={handleConfirmPayment}
                      disabled={confirmingPayment}
                      className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {confirmingPayment ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Enviando...
                        </span>
                      ) : (
                        '¡Ya Realicé el Pago!'
                      )}
                    </button>
                    <button
                      onClick={handleClosePaymentInstructions}
                      className="w-full px-6 py-3 bg-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-600 transition-all"
                    >
                      Cancelar Reservación
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleClosePaymentInstructions}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all"
                  >
                    Cerrar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Virtualized ticket grid component
function VirtualTicketGrid({
  tickets,
  selected,
  onClick,
}: {
  tickets: Ticket[];
  selected: number[];
  onClick: (ticketNumber: number, status: string) => void;
}) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-4">
      {tickets.map((t) => {
        const isSelected = selected.includes(t.ticket_number);
        const base = 'flex items-center justify-center h-12 w-12 rounded-md font-bold transition-colors select-none';
        const cls =
          t.status === 'sold' ? 'bg-red-500 cursor-not-allowed text-black' :
          t.status === 'pending' ? 'bg-yellow-500 cursor-not-allowed text-black' :
          isSelected ? 'bg-green-500 text-white cursor-pointer' :
          'bg-gray-200 hover:bg-blue-400 text-black cursor-pointer';
        return (
          <div key={t.id} className={`${base} ${cls}`} onClick={() => onClick(t.ticket_number, t.status)}>
            {t.ticket_number}
          </div>
        );
      })}
    </div>
  );
}
