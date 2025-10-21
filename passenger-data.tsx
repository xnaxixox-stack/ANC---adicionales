import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { PassengerDataForm } from './components/PassengerDataForm';
import { Header } from './components/Header';
import { Passenger } from './types';

const PassengerDataPage: React.FC = () => {
    const [passengers, setPassengers] = useState<Passenger[]>([]);
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        // Load state from sessionStorage
        try {
            const savedState = sessionStorage.getItem('bookingState');
            if (savedState) {
                const { passengers, grandTotal } = JSON.parse(savedState);
                setPassengers(passengers || []);
                setGrandTotal(grandTotal || 0);
            }
        } catch (error) {
            console.error("Failed to parse booking state from sessionStorage", error);
        }
        setIsLoaded(true);
    }, []);

    const handleBack = () => {
        // Save current form data before going back
        const currentState = { passengers, grandTotal };
        sessionStorage.setItem('bookingState', JSON.stringify(currentState));
        window.location.href = '/';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = document.getElementById('passenger-form') as HTMLFormElement;
        if (form && !form.checkValidity()) {
          form.reportValidity();
          return;
        }
        console.log('Datos de pasajeros confirmados. Procediendo al pago.', passengers);
        alert('¡Datos confirmados! El siguiente paso sería el pago.');
    };


    if (!isLoaded) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    const formatCurrency = (value: number) => {
        return `CLP ${value.toLocaleString('es-CL')}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
            <Header />
            <main className="w-full max-w-[1312px] mx-auto px-4 md:px-8 py-8 flex-grow">
                {/* Fix: Corrected props passed to PassengerDataForm. Removed invalid 'grandTotal' prop and added required 'onSubmit' prop. */}
                <PassengerDataForm
                    passengers={passengers}
                    setPassengers={setPassengers}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                />
            </main>
            <footer className="sticky bottom-0 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] p-4 z-10">
              <div className="w-full max-w-[1312px] mx-auto flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                  <span className="text-sm text-gray-600">Precio total</span>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(grandTotal)}</p>
                </div>
                <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-3">
                   <button onClick={handleBack} type="button" className="w-full sm:w-auto text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300">
                      Volver
                   </button>
                   <button type="submit" form="passenger-form" className="w-full sm:w-auto bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors text-lg">
                      Confirmar y Pagar
                   </button>
                </div>
              </div>
            </footer>
        </div>
    );
};


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PassengerDataPage />
  </React.StrictMode>
);