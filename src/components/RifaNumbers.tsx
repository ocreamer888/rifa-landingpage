// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import TiloPayForm from './TiloPayForm';

// Define the type for a single ticket
type Ticket = {
  id: number;
  ticket_number: number;
  status: 'available' | 'pending' | 'sold';
  pending_at?: string;
};

export default function RifaNumbers() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add these new states
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Stats
  const soldCount = tickets.filter((t) => t.status === 'sold').length;
  const availableCount = 500 - soldCount;

  // Cleanup expired pending tickets
  const cleanupExpiredTickets = async () => {
    try {
      const response = await fetch('/api/cleanup-pending-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Cleanup result:', result);
        
        // Refresh tickets after cleanup
        if (result.cleaned > 0) {
          const { data, error } = await supabase
            .from('tickets')
            .select('*')
            .order('ticket_number', { ascending: true });

          if (!error && data) {
            setTickets(data as Ticket[]);
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up expired tickets:', error);
    }
  };

  // Fetch initial ticket data
  useEffect(() => {
    const fetchTickets = async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('ticket_number', { ascending: true });

      if (error) {
        console.error('Error fetching tickets:', error);
        setError('Could not fetch tickets. Please refresh the page.');
      } else {
        setTickets(data as Ticket[]);
      }
    };

    fetchTickets();
    
    // Cleanup expired tickets on component mount
    cleanupExpiredTickets();
  }, []);

  // Set up periodic cleanup every 2 minutes
  useEffect(() => {
    const cleanupInterval = setInterval(cleanupExpiredTickets, 2 * 60 * 1000);
    return () => clearInterval(cleanupInterval);
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('realtime tickets')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tickets' },
        (payload) => {
          setTickets((currentTickets) =>
            currentTickets.map((ticket) =>
              ticket.id === payload.new['id'] ? (payload.new as Ticket) : ticket
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleTicketClick = (ticketNumber: number, status: string) => {
    if (status !== 'available') return; // Can't select sold/pending tickets

    setSelectedTickets((prev) =>
      prev.includes(ticketNumber)
        ? prev.filter((n) => n !== ticketNumber)
        : [...prev, ticketNumber]
    );
  };

  const validateBeforePay = () => {
    if (selectedTickets.length === 0) {
      setError('Please select at least one ticket.');
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError(null);
    return true;
  };

  const getTicketClass = (status: string, ticketNumber: number) => {
    if (status === 'sold') return 'bg-red-500 cursor-not-allowed';
    if (status === 'pending') return 'bg-yellow-500 cursor-not-allowed';
    if (selectedTickets.includes(ticketNumber)) return 'bg-green-500 text-white';
    return 'bg-gray-200 hover:bg-blue-400';
  };

  const TICKET_PRICE = 20; // Set your ticket price here

  // Add the createOrder function here
  const createOrder = async () => {
    if (!validateBeforePay()) return;
    
    try {
      setIsLoading(true);
      
      // Create order in database (without timestamp columns for now)
      const orderData = {
        order_number: `ORD-${Date.now()}`,
        customer_email: email,
        total_amount: selectedTickets.length * TICKET_PRICE,
        status: 'pending'
      };
      
      const { data: order, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();
      
      if (error) throw error;
      
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
      
      // Update tickets to pending (without timestamp for now)
      const ticketUpdateData = {
        status: 'pending'
      };
      
      await supabase
        .from('tickets')
        .update(ticketUpdateData)
        .in('ticket_number', selectedTickets);
      
      // Set current order and show payment form
      setCurrentOrder(order);
      setShowPaymentForm(true);
      
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get pending tickets count for display
  const pendingCount = tickets.filter(t => t.status === 'pending').length;

  return (
    <div id="ticket-grid" className="min-h-screen w-full justify-center items-center text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">¡Compra Tu Número de La Suerte!</h1>
          <p className="text-xl text-gray-400">500 Números, 1 Gran Premio</p>
        </header>
        
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
        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-4 mb-8">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => handleTicketClick(ticket.ticket_number, ticket.status)}
              className={`flex items-center justify-center h-12 w-12 rounded-md font-bold text-black transition-colors ${getTicketClass(ticket.status, ticket.ticket_number)}`}
            >
              {ticket.ticket_number}
            </div>
          ))}
        </div>

        {/* Checkout Section */}
        <div className="bg-gray-800 p-6 rounded-3xl">
            <h2 className="text-2xl font-bold mb-4">Números Seleccionados</h2>
            {selectedTickets.length > 0 ? (
                <>
                    <p className="text-lg mb-2">
                        Cantidad de Números Seleccionados: <span className="font-bold">{selectedTickets.length}</span>
                    </p>
                    <p className="text-lg mb-4">
                        Total: <span className="font-bold">${selectedTickets.length * TICKET_PRICE}</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Ingrese su Correo Electrónico"
                          className="flex-grow p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* TiloPay SDK button */}
                        <button
                          onClick={createOrder}
                          disabled={loading}
                          className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
                        >
                          {loading ? 'Creando Orden...' : 'Pagar'}
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-gray-400">Haz click o tappea sobre cualquier número disponible para seleccionarlo.</p>
            )}
            {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
      </div>
      
      {/* Payment Modal */}
      {showPaymentForm && currentOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Completar Pago</h2>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <TiloPayForm 
                order={currentOrder}
                selectedTickets={selectedTickets}
                onPaymentSuccess={() => {
                  setShowPaymentForm(false);
                  setCurrentOrder(null);
                  setSelectedTickets([]);
                  setEmail('');
                }}
                onPaymentError={(error: string) => {
                  setError(error);
                  setShowPaymentForm(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}