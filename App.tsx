import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { BaggageOptionCard } from './components/BaggageOptionCard';
import { PurchaseDetailDrawer } from './components/PurchaseDetailDrawer';
import { BaggageDetailDrawer } from './components/BaggageDetailDrawer';
import { baggageOptions, passengersData } from './constants';
import { Passenger } from './types';
import { ToastContainer, ToastData } from './components/ToastContainer';
import { PassengerDataForm } from './components/PassengerDataForm';
import { FareDetailModal } from './components/FareDetailModal';
import { Footer } from './components/Footer';

// Definimos los posibles pasos de navegación
type AppStep = 'baggageSelection' | 'passengerData';

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const App: React.FC = () => {
  
  // Helper para obtener el paso de la URL Hash
  const getStepFromHash = (): AppStep => {
    const hash = window.location.hash.replace('#', '');
    return hash === 'passenger-data' ? 'passengerData' : 'baggageSelection';
  };

  // Estado inicial basado en la URL hash o 'baggageSelection' por defecto
  const [currentStep, setCurrentStep] = useState<AppStep>(getStepFromHash);
  const [isFareModalOpen, setIsFareModalOpen] = useState(false);

  // useEffect para manejar la sincronización con la URL hash y el estado
  useEffect(() => {
    // 1. Inicializa la URL si está vacía, asegurando un punto de inicio trackeable
    if (!window.location.hash || window.location.hash.replace('#', '') === '') {
        window.location.hash = '#baggage-selection';
    }

    // 2. Escucha los cambios de hash (ej. al usar los botones de adelante/atrás del navegador)
    const handleHashChange = () => {
        setCurrentStep(getStepFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []); // Se ejecuta solo una vez al montar

  const [passengers, setPassengers] = useState<Passenger[]>(() => {
    try {
      const savedState = sessionStorage.getItem('bookingState');
      if (savedState) {
          const { passengers: savedPassengers } = JSON.parse(savedState);
          // Ensure saved passengers have a baggage object if it's missing
          const validPassengers = savedPassengers.map((p: Passenger) => ({...p, baggage: p.baggage || {}}));
          return validPassengers.length > 0 ? validPassengers : passengersData;
      }
    } catch (error) {
      console.error("Failed to parse booking state from sessionStorage", error);
    }
    return passengersData;
  });

  const [sameItemsForAll, setSameItemsForAll] = useState<{ [key: string]: boolean }>({});
  // Corregido: Se cambió '{ [keyof string]: boolean }' a '{ [key: string]: boolean }'
  const [separateTrips, setSeparateTrips] = useState<{ [key: string]: boolean }>({}); 
  const [isPurchaseDrawerOpen, setIsPurchaseDrawerOpen] = useState(false);
  const [activeBaggageDetail, setActiveBaggageDetail] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (message: string, type: 'success' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const handleSeparateTripsToggle = (itemId: string, checked: boolean) => {
    setSeparateTrips(prev => ({ ...prev, [itemId]: checked }));
  };
  
  const handleSameItemsForAllToggle = (itemId: string, checked: boolean) => {
    setSameItemsForAll(prev => ({ ...prev, [itemId]: checked }));
  };

  const handleQuantityChange = (itemId: string, passengerId: string, direction: 'ida' | 'vuelta', delta: number) => {
    setPassengers(prevPassengers => {
      const newPassengers = prevPassengers.map(p => ({ ...p, baggage: { ...p.baggage } }));
      const itemIsSeparate = separateTrips[itemId] || false;
      const item = baggageOptions.find(opt => opt.id === itemId);
      if (!item) return prevPassengers;

      const applyToAll = item.category !== 'pet' && (sameItemsForAll[itemId] !== false);

      const applyChange = (passenger: Passenger) => {
        const newBaggage = { ...passenger.baggage };
        const currentBaggage = newBaggage[itemId] || { ida: 0, vuelta: 0 };

        if (itemIsSeparate) {
          newBaggage[itemId] = { ...currentBaggage, [direction]: Math.max(0, (currentBaggage[direction] || 0) + delta) };
        } else {
          const newCount = Math.max(0, (currentBaggage.ida || 0) + delta);
          newBaggage[itemId] = { ida: newCount, vuelta: newCount };
        }
        
        if (newBaggage[itemId].ida === 0 && newBaggage[itemId].vuelta === 0) {
          delete newBaggage[itemId];
        }
        return { ...passenger, baggage: newBaggage };
      };

      if (applyToAll) {
        return newPassengers.map(applyChange);
      } else {
        const passengerIndex = newPassengers.findIndex(p => p.id === passengerId);
        if (passengerIndex === -1) return prevPassengers;
        
        newPassengers[passengerIndex] = applyChange(newPassengers[passengerIndex]);
        return newPassengers;
      }
    });
  };

  const handleResetItem = (itemId: string) => {
    setPassengers(prevPassengers => 
      prevPassengers.map(passenger => {
        const newBaggage = { ...passenger.baggage };
        delete newBaggage[itemId];
        return { ...passenger, baggage: newBaggage };
      })
    );
  };

  const formatCurrency = (value: number) => {
    return `CLP ${value.toLocaleString('es-CL')}`;
  };

  const baggageTotal = useMemo(() => {
    return passengers.reduce((acc, passenger) => {
      let passengerTotal = 0;
      if (!passenger.baggage) return acc;
      for (const itemId in passenger.baggage) {
        const item = baggageOptions.find(opt => opt.id === itemId);
        if (item) {
          const counts = passenger.baggage[itemId];
          passengerTotal += (counts.ida + counts.vuelta) * item.price;
        }
      }
      return acc + passengerTotal;
    }, 0);
  }, [passengers]);

  const baseFlightCost = 243334;
  const grandTotal = baseFlightCost + baggageTotal;

  // Función de navegación: Cambia la vista a los datos de pasajeros
  const handleContinue = () => {
    const bookingState = {
      passengers,
      grandTotal,
    };
    // Guardamos el estado en sessionStorage antes de navegar
    sessionStorage.setItem('bookingState', JSON.stringify(bookingState));
    // Actualizamos el hash de la URL para que sea trackeable
    window.location.hash = '#passenger-data';
  };
  
  // Función para volver a la pantalla anterior
  const handleGoBack = () => {
    // Actualizamos el hash de la URL para que sea trackeable
    window.location.hash = '#baggage-selection';
  };

  const handleSubmitPassengerData = (e: React.FormEvent) => {
    e.preventDefault();
    const form = document.getElementById('passenger-form') as HTMLFormElement;
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }
    console.log('Datos de pasajeros confirmados. Procediendo al pago.', passengers);
    alert('¡Datos confirmados! El siguiente paso sería el pago.');
  };

  const renderContent = () => {
    if (currentStep === 'passengerData') {
      // Renderizar el formulario de datos de pasajeros
      return (
        <PassengerDataForm
          passengers={passengers}
          setPassengers={setPassengers}
          onBack={handleGoBack}
          onSubmit={handleSubmitPassengerData}
        />
      );
    }

    // Renderizar la selección de equipaje por defecto
    return (
      <>
        <a href="#" className="flex items-center text-purple-700 font-semibold mb-6 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver a selección de asientos
        </a>

        <div className="text-left mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Tu tarifa Light solo incluye 1 bolso de mano ✈️
          </h1>
          <p className="text-lg text-gray-600 mt-2">Agrega equipaje adicional si lo necesitas.</p>
          <button 
            onClick={() => setIsFareModalOpen(true)}
            className="flex items-center gap-2 text-purple-700 font-semibold hover:underline mt-3 focus:outline-none focus:ring-2 focus:ring-purple-200 rounded-lg p-1 -m-1"
            aria-label="Ver detalles de la tarifa"
          >
            <InfoIcon />
            ¿Qué incluye mi tarifa?
          </button>
        </div>

        <div className="space-y-8">
            {/* Included Item */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3 shadow-sm">
              <img src="https://i.imgur.com/injLeEc.png" alt="Hand bags" className="w-16 h-16 md:w-24 md:h-24 object-contain flex-shrink-0"/>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                  <h2 className="text-base font-bold text-gray-900">Bolso de mano</h2>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">✓ INCLUIDO</span>
                </div>
                <p className="text-sm text-gray-600">
                  Total: <span className="font-semibold text-purple-700">{passengers.length} Ida | {passengers.length} Vuelta</span> (1 por pasajero).
                </p>
              </div>
              <button 
                onClick={() => setActiveBaggageDetail('hand-bag')}
                className="ml-auto flex-shrink-0 text-sm text-purple-700 font-semibold py-2 px-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap">
                Ver detalle
              </button>
            </div>
            
            {/* All baggage options */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {baggageOptions.map(item => (
                 <BaggageOptionCard 
                   key={item.id} 
                   item={item} 
                   passengers={passengers} 
                   onQuantityChange={handleQuantityChange}
                   isSameForAll={sameItemsForAll[item.id] !== false}
                   onSameForAllChange={(checked) => handleSameItemsForAllToggle(item.id, checked)}
                   separateTrips={separateTrips[item.id] || false}
                   onSeparateTripsChange={(checked) => handleSeparateTripsToggle(item.id, checked)}
                   onCancel={() => handleResetItem(item.id)}
                   onDetailClick={() => setActiveBaggageDetail(item.id)}
                   addToast={addToast}
                 />
              ))}
            </div>

            <div className="text-center text-gray-600 pt-8">
                <p>Medidas y restricciones para cada tipo de equipaje</p>
                <p>Conoce más sobre lo que puedes llevar y <a href="#" className="text-purple-700 font-semibold underline">encuentra la información del equipaje que necesitas.</a></p>
            </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      <Header />
      
      <main className="w-full max-w-[1312px] mx-auto px-4 md:px-8 py-8 flex-grow">
        {renderContent()}
      </main>
      
      {currentStep === 'baggageSelection' && (
        <footer className="sticky bottom-0 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] p-4 z-10">
          <div className="w-full max-w-[1312px] mx-auto flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 lg:gap-0">
              <button onClick={() => setIsPurchaseDrawerOpen(true)} className="text-right lg:text-left focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-lg p-2 -m-2 transition-shadow" aria-label="Ver detalle de la compra">
                  <span className="text-sm text-gray-600">Precio total</span>
                  <p className="text-2xl font-bold text-gray-900 flex items-center justify-end lg:justify-start">{formatCurrency(grandTotal)}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </p>
              </button>
              <button 
                onClick={handleContinue}
                className="w-full lg:w-auto bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors text-lg"
              >
                  {baggageTotal > 0 ? 'Continuar y completar datos' : 'Continuar sin agregar equipaje'}
              </button>
          </div>
        </footer>
      )}
      
      {currentStep === 'passengerData' && (
        <footer className="sticky bottom-0 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] p-4 z-10">
          <div className="w-full max-w-[1312px] mx-auto flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <span className="text-sm text-gray-600">Precio total</span>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(grandTotal)}</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-3">
               <button onClick={handleGoBack} type="button" className="w-full sm:w-auto text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300">
                  Volver
               </button>
               <button type="submit" form="passenger-form" className="w-full sm:w-auto bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors text-lg">
                  Confirmar y Pagar
               </button>
            </div>
          </div>
        </footer>
      )}

      <PurchaseDetailDrawer 
        isOpen={isPurchaseDrawerOpen} 
        onClose={() => setIsPurchaseDrawerOpen(false)}
        passengers={passengers}
        baggageOptions={baggageOptions}
        grandTotal={grandTotal}
      />

      <FareDetailModal isOpen={isFareModalOpen} onClose={() => setIsFareModalOpen(false)} />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <BaggageDetailDrawer
        isOpen={activeBaggageDetail !== null}
        onClose={() => setActiveBaggageDetail(null)}
        baggageItemId={activeBaggageDetail}
      />
      <Footer />
    </div>
  );
};

export default App;