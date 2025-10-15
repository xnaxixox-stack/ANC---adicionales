import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { BaggageOptionCard } from './components/BaggageOptionCard';
import { PurchaseDetailDrawer } from './components/PurchaseDetailDrawer';
import { BaggageDetailDrawer } from './components/BaggageDetailDrawer';
import { baggageOptions, passengersData } from './constants';
import { Passenger } from './types';
import { ToastContainer, ToastData } from './components/ToastContainer';
import { PassengerDataForm } from './components/PassengerDataForm'; // Importación crucial

// Definimos los posibles pasos de navegación
type AppStep = 'baggageSelection' | 'passengerData';

const App: React.FC = () => {
  
  // Helper para obtener el paso de la URL Hash
  const getStepFromHash = (): AppStep => {
    const hash = window.location.hash.replace('#', '');
    return hash === 'passenger-data' ? 'passengerData' : 'baggageSelection';
  };

  // Estado inicial basado en la URL hash o 'baggageSelection' por defecto
  const [currentStep, setCurrentStep] = useState<AppStep>(getStepFromHash);

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

  const renderContent = () => {
    if (currentStep === 'passengerData') {
      // Renderizar el formulario de datos de pasajeros
      return (
        <PassengerDataForm
          passengers={passengers}
          grandTotal={grandTotal}
          onBack={handleGoBack}
          setPassengers={setPassengers} // <--- Pasamos la función de actualización
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
            Tu tarifa [Light] solo incluye 1 bolso de mano ✈️
          </h1>
          <p className="text-lg text-gray-600 mt-2">Agrega equipaje adicional si lo necesitas.</p>
        </div>

        <div className="space-y-8">
            {/* Included Item */}
            <div className="bg-white p-6 rounded-2xl border border-purple-200 flex flex-col md:flex-row items-center gap-6 shadow-sm">
              <img src="https://i.imgur.com/injLeEc.png" alt="Hand bags" className="w-40 h-40 object-contain"/>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-xl font-bold">Bolso de mano</h2>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">✓ INCLUIDO</span>
                </div>
                <p className="text-gray-600 mb-2">Todas nuestras tarifas incluyen <span className="font-bold">un bolso</span> de mano sin costo <span className="font-bold">por pasajero</span> en cada vuelo.</p>
                <p className="text-gray-700 font-semibold">Tienes en tu reserva: <span className="text-purple-700">1 Ida | 1 Vuelta</span></p>
                <button 
                  onClick={() => setActiveBaggageDetail('hand-bag')}
                  className="mt-4 w-full md:w-auto text-purple-700 font-semibold py-2 px-4 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors">
                  Detalle bolso de mano
                </button>
              </div>
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
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      
      <main className="w-full max-w-[1312px] mx-auto px-4 md:px-8 py-8">
        {renderContent()}
      </main>
      
      {/* El footer solo se muestra en la pantalla de selección de equipaje */}
      {currentStep === 'baggageSelection' && (
        <footer className="sticky bottom-0 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] p-4">
          <div className="w-full max-w-[1312px] mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
              <button onClick={() => setIsPurchaseDrawerOpen(true)} className="text-right md:text-left focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-lg p-2 -m-2 transition-shadow" aria-label="Ver detalle de la compra">
                  <span className="text-sm text-gray-600">Precio total</span>
                  <p className="text-2xl font-bold text-gray-900 flex items-center justify-end md:justify-start">{formatCurrency(grandTotal)}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </p>
              </button>
              <button 
                onClick={handleContinue}
                className="w-full md:w-auto bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors text-lg"
              >
                  Continuar y completar datos
              </button>
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

      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <BaggageDetailDrawer
        isOpen={activeBaggageDetail !== null}
        onClose={() => setActiveBaggageDetail(null)}
        baggageItemId={activeBaggageDetail}
      />
    </div>
  );
};

export default App;
