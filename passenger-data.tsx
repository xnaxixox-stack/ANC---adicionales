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

    if (!isLoaded) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <Header />
            <PassengerDataForm
                passengers={passengers}
                setPassengers={setPassengers}
                onBack={handleBack}
                grandTotal={grandTotal}
            />
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