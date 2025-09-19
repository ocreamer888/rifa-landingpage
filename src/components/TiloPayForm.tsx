'use client';

import { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Types for Tilopay SDK
interface TilopayMethod {
  id: string;
  name: string;
}

interface TilopayCard {
  id: string;
  name: string;
}

interface TilopayInitResponse {
  methods: TilopayMethod[];
  cards: TilopayCard[];
  message?: string;
  sinpemovil?: Record<string, unknown>; // Add this line
}

interface TilopayConfig {
  token: string;
  currency: string;
  language: string;
  amount: number;
  billToFirstName: string;
  billToLastName: string;
  billToAddress: string;
  billToAddress2: string;
  billToCity: string;
  billToState: string;
  billToZipPostCode: string;
  billToCountry: string;
  billToTelephone: string;
  billToEmail: string;
  orderNumber: string;
  capture: number;
  redirect: string;
  subscription: number;
  hashVersion: string;
  returnData?: string;
  phoneYappy?: string;
  typeDni?: number;
  dni?: string;
}

// Order types
interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

// SinpeMovil response type
interface SinpeMovilResponse {
  phone?: string;
  reference?: string;
  [key: string]: unknown;
}

// Payment response type
interface PaymentResponse {
  success?: boolean;
  message?: string;
  transactionId?: string;
  [key: string]: unknown;
}

// SDK elements type
interface SDKElements {
  mainContainer?: HTMLDivElement | null;
  paymentMethod?: HTMLSelectElement | null;
  cardPaymentDiv?: HTMLDivElement | null;
  savedCards?: HTMLSelectElement | null;
  cardNumber?: HTMLInputElement | null;
  cardExpiration?: HTMLInputElement | null;
  cvv?: HTMLInputElement | null;
  phoneNumber?: HTMLInputElement | null;
  [key: string]: HTMLElement | null | undefined;
}

// Extend Window interface for Tilopay SDK
declare global {
  interface Window {
    Tilopay: {
      Init: (config: TilopayConfig) => Promise<TilopayInitResponse>;
      updateOptions: (options: Partial<TilopayConfig>) => Promise<void>;
      getCardType: () => Promise<string>;
      getSinpeMovil: () => Promise<SinpeMovilResponse>;
      startPayment: () => Promise<PaymentResponse>;
      getCipherData: () => Promise<Record<string, unknown>>;
    };
  }
}

interface TiloPayFormProps {
  order: Order;
  selectedTickets: number[];
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

export default function TiloPayForm({ order, selectedTickets, onPaymentSuccess, onPaymentError }: TiloPayFormProps) {
  // React UI state (can change)
  const [uiState, setUiState] = useState({
    isLoading: false,
    showPaymentForm: false,
    selectedMethod: '',
    cardNumber: '',
    cardExpiration: '',
    cvv: '',
    phoneNumber: '',
    cardType: '',
    sinpeMovilData: null as SinpeMovilResponse | null,
    response: null as PaymentResponse | null,
  });

  // SDK state (never triggers re-renders)
  const sdkStateRef = useRef({
    isInitialized: false,
    paymentMethods: [] as TilopayMethod[],
    savedCards: [] as TilopayCard[],
    selectedMethod: '',
    selectedCard: '',
  });

  // Stable references for SDK elements
  const sdkContainerRef = useRef<HTMLDivElement | null>(null);
  const sdkElementsRef = useRef<SDKElements>({
    mainContainer: null,
    paymentMethod: null,
    cardPaymentDiv: null,
    savedCards: null,
    cardNumber: null,
    cardExpiration: null,
    cvv: null,
    phoneNumber: null,
  });

  // Create SDK container that React never touches
  const createSDKContainer = useCallback(() => {
    const container = document.createElement('div');
    container.id = 'tilopay-sdk-container';
    container.style.position = 'fixed';
    container.style.width = '100%';
    container.style.display = 'block';
    container.style.pointerEvents = 'none';
    return container;
  }, []);

  // Create element factory with stable references
  const createElement = useCallback((tag: string, id: string, parent: HTMLElement, attributes: Record<string, string> = {}) => {
    const element = document.createElement(tag);
    element.id = id;
    element.style.display = 'block';
    element.style.visibility = 'visible';
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    
    parent.appendChild(element);
    return element;
  }, []);

  // Create all SDK elements with proper structure
  const createAllSDKElements = useCallback((container: HTMLDivElement) => {
    const elements = {
      mainContainer: null as HTMLDivElement | null,
      paymentMethod: null as HTMLSelectElement | null,
      cardPaymentDiv: null as HTMLDivElement | null,
      savedCards: null as HTMLSelectElement | null,
      cardNumber: null as HTMLInputElement | null,
      cardExpiration: null as HTMLInputElement | null,
      cvv: null as HTMLInputElement | null,
      phoneDiv: null as HTMLDivElement | null,
      phoneNumber: null as HTMLInputElement | null,
      responseDiv: null as HTMLDivElement | null,
    };

    // Create main container
    const mainContainer = document.createElement('div');
    mainContainer.className = 'payFormTilopay';
    mainContainer.style.display = 'block';
    mainContainer.style.width = '100%';
    container.appendChild(mainContainer);
    elements.mainContainer = mainContainer;

    // Create payment method select
    const paymentMethod = createElement('select', 'tlpy_payment_method', mainContainer, {
      name: 'tlpy_payment_method'
    }) as HTMLSelectElement;
    paymentMethod.style.width = '100%';
    paymentMethod.style.height = '40px';
    paymentMethod.style.marginBottom = '10px';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select payment method';
    paymentMethod.appendChild(defaultOption);
    elements.paymentMethod = paymentMethod;

    // Create card payment div
    const cardPaymentDiv = createElement('div', 'tlpy_card_payment_div', mainContainer) as HTMLDivElement;
    cardPaymentDiv.style.width = '100%';
    cardPaymentDiv.style.display = 'block';
    elements.cardPaymentDiv = cardPaymentDiv;

    // Create saved cards select
    const savedCards = createElement('select', 'tlpy_saved_cards', cardPaymentDiv, {
      name: 'tlpy_saved_cards'
    }) as HTMLSelectElement;
    savedCards.style.width = '100%';
    savedCards.style.height = '40px';
    savedCards.style.marginBottom = '10px';
    
    const cardDefaultOption = document.createElement('option');
    cardDefaultOption.value = '';
    cardDefaultOption.textContent = 'Select card';
    savedCards.appendChild(cardDefaultOption);
    elements.savedCards = savedCards;

    // Create card number input
    const cardNumber = createElement('input', 'tlpy_cc_number', cardPaymentDiv, {
      type: 'text',
      name: 'tlpy_cc_number'
    }) as HTMLInputElement;
    cardNumber.style.width = '100%';
    cardNumber.style.height = '40px';
    cardNumber.style.marginBottom = '10px';
    cardNumber.style.padding = '8px';
    cardNumber.style.border = '1px solid #ccc';
    cardNumber.style.boxSizing = 'border-box';
    elements.cardNumber = cardNumber;

    // Create card expiration input
    const cardExpiration = createElement('input', 'tlpy_cc_expiration_date', cardPaymentDiv, {
      type: 'text',
      name: 'tlpy_cc_expiration_date'
    }) as HTMLInputElement;
    cardExpiration.style.width = '100%';
    cardExpiration.style.height = '40px';
    cardExpiration.style.marginBottom = '10px';
    cardExpiration.style.padding = '8px';
    cardExpiration.style.border = '1px solid #ccc';
    cardExpiration.style.boxSizing = 'border-box';
    elements.cardExpiration = cardExpiration;

    // Create CVV input
    const cvv = createElement('input', 'tlpy_cvv', cardPaymentDiv, {
      type: 'text',
      name: 'tlpy_cvv'
    }) as HTMLInputElement;
    cvv.style.width = '100%';
    cvv.style.height = '40px';
    cvv.style.marginBottom = '10px';
    cvv.style.padding = '8px';
    cvv.style.border = '1px solid #ccc';
    cvv.style.boxSizing = 'border-box';
    elements.cvv = cvv;

    // Create phone number div
    const phoneDiv = createElement('div', 'tlpy_phone_number_div', mainContainer) as HTMLDivElement;
    phoneDiv.style.display = 'block';
    phoneDiv.style.width = '100%';
    elements.phoneDiv = phoneDiv;

    // Create phone number input
    const phoneNumber = createElement('input', 'tlpy_phone_number', phoneDiv, {
      type: 'text',
      name: 'tlpy_phone_number'
    }) as HTMLInputElement;
    phoneNumber.style.width = '100%';
    phoneNumber.style.height = '40px';
    phoneNumber.style.marginBottom = '10px';
    phoneNumber.style.padding = '8px';
    phoneNumber.style.border = '1px solid #ccc';
    phoneNumber.style.boxSizing = 'border-box';
    elements.phoneNumber = phoneNumber;

    // Create response div
    const responseDiv = createElement('div', 'responseTilopay', mainContainer) as HTMLDivElement;
    responseDiv.style.width = '100%';
    responseDiv.style.minHeight = '50px';
    elements.responseDiv = responseDiv;

    return elements;
  }, [createElement]);

  // Load payment methods
  const loadPaymentMethodsOptions = useCallback(async (methods: TilopayMethod[]) => {
    const select = sdkElementsRef.current.paymentMethod;
    if (select) {
      methods.forEach((method) => {
        const option = document.createElement('option');
        option.value = method.id;
        option.text = method.name;
        select.appendChild(option);
      });
    }
  }, []);

  // Load card options
  const loadCardOptions = useCallback(async (cards: TilopayCard[]) => {
    const select = sdkElementsRef.current.savedCards;
    if (select) {
      cards.forEach((card) => {
        const option = document.createElement('option');
        option.value = card.id;
        option.text = card.name;
        select.appendChild(option);
      });
    }
  }, []);

  // Set up SDK event handlers
  const setupSDKEventHandlers = useCallback((elements: SDKElements) => {
    // Payment method change handler
    if (elements.paymentMethod) {
      elements.paymentMethod.addEventListener('change', async (e) => {
        const target = e.target as HTMLSelectElement;
        const methodId = target.value;
        
        if (methodId) {
          sdkStateRef.current.selectedMethod = methodId;
          setUiState(prev => ({ ...prev, selectedMethod: methodId }));
          
          try {
            // Update SDK options with the selected payment method
            await window.Tilopay.updateOptions({
              // Add any payment method specific options here
            });
          } catch (error) {
            console.error('Error updating payment method:', error);
          }
        }
      });
    }

    // Phone number handler
    if (elements.phoneNumber) {
      elements.phoneNumber.addEventListener('change', async () => {
        const phone = elements.phoneNumber?.value;
        if (phone && window.Tilopay) {
          try {
            await window.Tilopay.updateOptions({ phoneYappy: phone });
          } catch (error) {
            console.error('Error updating phone:', error);
          }
        }
      });
    }
  }, []);

  // Initialize SDK with stable elements
  const initializeSDK = useCallback(async () => {
    if (sdkStateRef.current.isInitialized || !window.Tilopay) {
      return;
    }

    try {
      console.log('Starting SDK initialization...');

      // Get token first
      let token;
      try {
        console.log('Retrieving Tilopay token...');
        const response = await fetch('/api/tilopay-token', {
          method: 'POST'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const tokenData = await response.json();
        console.log('Token response:', tokenData);
        
        if (!tokenData.access_token) {
          throw new Error('No access token received');
        }
        
        token = tokenData.access_token;
        console.log('Token retrieved successfully, length:', token.length);
      } catch (tokenError) {
        console.error('Token retrieval failed:', tokenError);
        setUiState(prev => ({ 
          ...prev, 
          response: { error: 'Failed to authenticate with Tilopay. Please check your credentials.' } 
        }));
        return;
      }

      // Create container and elements
      const container = createSDKContainer();
      document.body.appendChild(container);
      sdkContainerRef.current = container;

      const elements = createAllSDKElements(container);
      sdkElementsRef.current = elements;

      // Wait for elements to be stable
      await new Promise(resolve => setTimeout(resolve, 200));

      // Initialize with the real token
      const config: TilopayConfig = {
        token: token, // Use the real token
        currency: 'CRC', // Change from 'USD' to 'CRC'
        language: 'es',
        amount: order?.total_amount || 1,
        billToFirstName: 'Jose',
        billToLastName: 'Lopez',
        billToAddress: 'San Jose',
        billToAddress2: '',
        billToCity: 'San Jose',
        billToState: 'San Jose',
        billToZipPostCode: '10101',
        billToCountry: 'CR',
        billToTelephone: '+50661038888',
        billToEmail: order?.customer_email || 'ocreamer.dev@gmail.com',
        orderNumber: order?.order_number || 'sdk-' + Date.now(),
        capture: 1,
        redirect: `${window.location.origin}/payment-success`,
        subscription: 0,
        hashVersion: 'V2',
        returnData: 'W2N1c3RvbV9wYXJhbWV0ZXJfYSA9PiAidmFsb3IgZGUgYSIsY3VzdG9tX3BhcmFtZXRlcl9iID0+ICJ2YWxvciBkZSBiIl0=',
        // Add these parameters that might be needed for Sinpe
        phoneYappy: '+50661038888', // Required for Sinpe
        typeDni: 1, // Required for Costa Rica
        dni: '123456789' // Required for Costa Rica
      };

      console.log('Calling Tilopay.Init with config:', {
        ...config,
        token: token ? `${token.substring(0, 10)}...` : 'empty'
      });
      
      const initialize = await window.Tilopay.Init(config);
      console.log('SDK initialized successfully:', initialize);
      console.log('Payment methods received:', initialize.methods);
      console.log('Cards received:', initialize.cards);
      console.log('Sinpe Móvil data:', initialize.sinpemovil);

      // Check if initialization was successful
      if (initialize.message === 'Faltan parametros de inicialización') {
        throw new Error('SDK initialization failed: Missing parameters');
      }

      // Create combined payment methods array including Sinpe Móvil if available
      const allPaymentMethods = [...initialize.methods];

      // Add Sinpe Móvil if it's available in the response
      if (initialize.sinpemovil && Object.keys(initialize.sinpemovil).length > 0) {
        allPaymentMethods.push({
          id: 'sinpe:18:sinpemovil',
          name: 'Sinpe Móvil',
          type: 'sinpe'
        });
      }

      console.log('All payment methods (including Sinpe):', allPaymentMethods);

      // Store results in refs
      sdkStateRef.current.paymentMethods = allPaymentMethods;
      sdkStateRef.current.savedCards = initialize.cards;
      sdkStateRef.current.isInitialized = true;

      // Load payment methods and cards
      await loadPaymentMethodsOptions(allPaymentMethods);
      await loadCardOptions(initialize.cards);

      // Set up event handlers
      setupSDKEventHandlers(elements);

      // Update UI state to trigger re-render
      setUiState(prev => ({ ...prev, showPaymentForm: true }));

    } catch (error) {
      console.error('Error initializing Tilopay SDK:', error);
      setUiState(prev => ({ ...prev, response: { error: 'Failed to initialize Tilopay SDK' } }));
    }
  }, [createSDKContainer, createAllSDKElements, order, loadPaymentMethodsOptions, loadCardOptions, setupSDKEventHandlers]);

  // Initialize SDK once
  useLayoutEffect(() => {
    if (window.Tilopay && !sdkStateRef.current.isInitialized) {
      initializeSDK();
    }
  }, [initializeSDK]);

  // Check for SDK readiness
  useEffect(() => {
    const checkSDKReady = () => {
      if (window.Tilopay && !sdkStateRef.current.isInitialized) {
        initializeSDK();
      } else if (!window.Tilopay) {
        setTimeout(checkSDKReady, 100);
      }
    };

    checkSDKReady();
  }, [initializeSDK]);

  // Cleanup
  useEffect(() => {
    return () => {
      const container = sdkContainerRef.current;
      if (container) {
        container.remove();
      }
    };
  }, []);

  // Get Sinpe Móvil instructions
  const getSinpeMovilInstructions = useCallback(async () => {
    if (!window.Tilopay) return;
    
    try {
      const params = await window.Tilopay.getSinpeMovil();
      console.log('Sinpe Móvil params:', params);
      setUiState(prev => ({ ...prev, sinpeMovilData: params }));
    } catch (error) {
      console.error('Error getting Sinpe Móvil instructions:', error);
    }
  }, []);

  // Get card brand
  const getCardBrand = useCallback(async () => {
    if (!window.Tilopay || !uiState.cardNumber) return;
    
    try {
      const cardType = await window.Tilopay.getCardType();
      console.log('Card type:', cardType);
      // Extract the actual card type from the response object
      const cardTypeString = typeof cardType === 'string' ? cardType : (cardType as { message?: string })?.message || '';
      setUiState(prev => ({ ...prev, cardType: cardTypeString }));
    } catch (error) {
      console.error('Error getting card type:', error);
    }
  }, [uiState.cardNumber]);

  // Handle payment method change
  const handlePaymentMethodChange = useCallback(async (method: string) => {
    sdkStateRef.current.selectedMethod = method;
    setUiState(prev => ({ ...prev, selectedMethod: method }));
    
    // Update SDK element
    const hiddenSelect = sdkElementsRef.current.paymentMethod;
    if (hiddenSelect) {
      hiddenSelect.value = method;
      
      // Force the SDK to recognize the change by updating its internal state
      if (window.Tilopay && method) {
        try {
          // Update SDK options with the selected payment method
          await window.Tilopay.updateOptions({
            // Add any payment method specific options here
          });
        } catch (error) {
          console.error('Error updating SDK options:', error);
        }
      }
      
      // Create a proper event object to trigger the SDK handler
      const event = new Event('change', { bubbles: true });
      Object.defineProperty(event, 'target', {
        value: hiddenSelect,
        enumerable: true
      });
      Object.defineProperty(event.target, 'value', {
        value: method,
        enumerable: true
      });
      
      // Trigger the SDK event handler
      if (hiddenSelect.onchange) {
        hiddenSelect.onchange(event);
      }
    }
    
    if (method) {
      const splitMethods = method.split(':');
      const isSinpeMovil = splitMethods[1] === '18';
      
      if (isSinpeMovil) {
        await getSinpeMovilInstructions();
      } else {
        if (uiState.cardNumber) {
          await getCardBrand();
        }
      }
    }
  }, [uiState.cardNumber, getSinpeMovilInstructions, getCardBrand]);

  // Handle card number change
  const handleCardNumberChange = useCallback((value: string) => {
    setUiState(prev => ({ ...prev, cardNumber: value }));
    
    // Update SDK element
    const hiddenInput = sdkElementsRef.current.cardNumber;
    if (hiddenInput) {
      hiddenInput.value = value;
    }
    
    if (value && uiState.selectedMethod && uiState.selectedMethod.split(':')[1] !== '18') {
      setTimeout(() => {
        getCardBrand();
      }, 500);
    }
  }, [uiState.selectedMethod, getCardBrand]);

  // Handle card expiration change
  const handleCardExpirationChange = useCallback((value: string) => {
    setUiState(prev => ({ ...prev, cardExpiration: value }));
    
    const hiddenInput = sdkElementsRef.current.cardExpiration;
    if (hiddenInput) {
      hiddenInput.value = value;
    }
  }, []);

  // Handle CVV change
  const handleCvvChange = useCallback((value: string) => {
    setUiState(prev => ({ ...prev, cvv: value }));
    
    const hiddenInput = sdkElementsRef.current.cvv;
    if (hiddenInput) {
      hiddenInput.value = value;
    }
  }, []);

  // Handle phone number change
  const handlePhoneNumberChange = useCallback((value: string) => {
    setUiState(prev => ({ ...prev, phoneNumber: value }));
    
    const hiddenInput = sdkElementsRef.current.phoneNumber;
    if (hiddenInput) {
      hiddenInput.value = value;
      if (hiddenInput.onchange) {
        hiddenInput.onchange({} as Event);
      }
    }
  }, []);

  // Process payment
  const processPayment = useCallback(async () => {
    if (!window.Tilopay) return;
    
    try {
      setUiState(prev => ({ ...prev, isLoading: true }));
      
      // Validate required fields
      if (uiState.selectedMethod.includes('18')) { // Sinpe Móvil
        if (!uiState.phoneNumber) {
          onPaymentError('Por favor ingrese su número de teléfono asociado a su cuenta Sinpe Móvil');
          return;
        }
      } else { // Card payment
        if (!uiState.cardNumber || !uiState.cardExpiration || !uiState.cvv) {
          onPaymentError('Por favor rellene todos los campos de tarjeta.');
          return;
        }
      }
      
      const payment = await window.Tilopay.startPayment();
      console.log('Payment result:', payment);
      
      if (payment.success) {
        // Update order status to completed
        const { error: orderError } = await supabase
          .from('orders')
          .update({ status: 'completed' })
          .eq('id', order.id);

        if (orderError) {
          console.error('Error updating order status:', orderError);
        }

        // Update tickets to sold status
        const { error: ticketsError } = await supabase
          .from('tickets')
          .update({ 
            status: 'sold',
            pending_at: null
          })
          .in('ticket_number', selectedTickets);

        if (ticketsError) {
          console.error('Error updating ticket status:', ticketsError);
        }

        onPaymentSuccess();
      } else {
        onPaymentError(payment.message || 'Pago Fallido');
      }
    } catch (error) {
      console.error('Error procesando el pago:', error);
      onPaymentError('Pago fallido. Por favor, inténtalo de nuevo.');
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  }, [uiState, onPaymentSuccess, onPaymentError, order, selectedTickets]);

  // Check if current payment method is Sinpe Móvil
  const isSinpeMovil = uiState.selectedMethod && uiState.selectedMethod.split(':')[1] === '18';
  const isCardPayment = uiState.selectedMethod && !isSinpeMovil;

  if (!sdkStateRef.current.isInitialized) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading Tilopay SDK...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-black">
      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Resumen de la Orden</h3>
        <p className="text-sm text-gray-600">Código: {order?.order_number}</p>
        <p className="text-sm text-gray-600">Números: {selectedTickets.join(', ')}</p>
        <p className="text-lg font-bold text-gray-800">Total: ${order?.total_amount}</p>
      </div>

      {/* Debug Payment Methods */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">Debug - Payment Methods:</h4>
          <p>Count: {sdkStateRef.current.paymentMethods.length}</p>
          <pre className="text-xs text-yellow-700 overflow-auto">
            {JSON.stringify(sdkStateRef.current.paymentMethods, null, 2)}
          </pre>
        </div>
      )}

      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Método de Pago
        </label>
        <select
          value={uiState.selectedMethod}
          onChange={(e) => handlePaymentMethodChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select payment method</option>
          {sdkStateRef.current.paymentMethods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sinpe Móvil Section */}
      {isSinpeMovil && (
        <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-green-800">Pago con Sinpe Móvil</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Teléfono
            </label>
            <input
              type="tel"
              value={uiState.phoneNumber}
              onChange={(e) => handlePhoneNumberChange(e.target.value)}
              placeholder="Ingrese su Número de Teléfono"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {uiState.sinpeMovilData && (
            <div className="bg-white p-4 rounded-lg border border-green-300">
              <h4 className="font-semibold text-gray-800 mb-2">Instrucciones de Pago:</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Cantidad:</strong> ${String(uiState.sinpeMovilData['amount'] || '')}</p>
                <p><strong>Referencia:</strong> {String(uiState.sinpeMovilData['reference'] || '')}</p>
                <p><strong>Número:</strong> {String(uiState.sinpeMovilData['phone'] || '')}</p>
                <p className="text-gray-600">{String(uiState.sinpeMovilData['message'] || '')}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Card Payment Section */}
      {isCardPayment && (
        <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            
            <h3 className="font-semibold text-blue-800">Pago con Tarjeta</h3>
            {uiState.cardType && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {uiState.cardType}
              </span>
            )}
          </div>

          {/* Saved Cards */}
          {sdkStateRef.current.savedCards.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usar Tarjeta Guardada
              </label>
              <select
                value={sdkStateRef.current.selectedCard}
                onChange={(e) => {
                  sdkStateRef.current.selectedCard = e.target.value;
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar tarjeta guardada</option>
                {sdkStateRef.current.savedCards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* New Card Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Tarjeta
            </label>
            <input
              type="text"
              value={uiState.cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Expiración
              </label>
              <input
                type="text"
                value={uiState.cardExpiration}
                onChange={(e) => handleCardExpirationChange(e.target.value)}
                placeholder="MM/YY"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={5}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={uiState.cvv}
                onChange={(e) => handleCvvChange(e.target.value)}
                placeholder="123"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={4}
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Button */}
      <div className="pt-4">
        <button
          onClick={processPayment}
          disabled={uiState.isLoading || !uiState.selectedMethod}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {uiState.isLoading ? 'Procesando...' : `Pagar $${order?.total_amount}`}
        </button>
      </div>

      {/* Debug Response */}
      {uiState.response && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="font-medium text-gray-800 mb-2">Debug Response:</h3>
          <pre className="text-sm text-gray-600 overflow-auto">
            {JSON.stringify(uiState.response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

const getTiloPayToken = async () => {
  try {
    const response = await fetch('/api/tilopay-token', {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const tokenData = await response.json();
    
    if (!tokenData.access_token) {
      throw new Error('No access token received');
    }
    
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting TiloPay token:', error);
    throw error; // Re-throw to handle in calling function
  }
};
