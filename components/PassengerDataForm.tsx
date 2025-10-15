import React from 'react';
import { Passenger } from '../types';

interface PassengerDataFormProps {
  passengers: Passenger[];
  setPassengers: React.Dispatch<React.SetStateAction<Passenger[]>>;
  onBack: () => void;
  grandTotal: number;
}

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input 
      id={id} 
      {...props} 
      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 sm:text-sm" 
    />
  </div>
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, id, children, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select 
      id={id} 
      {...props} 
      className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 sm:text-sm"
    >
      {children}
    </select>
  </div>
);

export const PassengerDataForm: React.FC<PassengerDataFormProps> = ({ passengers, setPassengers, onBack, grandTotal }) => {
  const handleDataChange = (passengerId: string, field: keyof Passenger, value: string) => {
    setPassengers(prev =>
      prev.map(p =>
        p.id === passengerId ? { ...p, [field]: value } : p
      )
    );
  };

  const formatCurrency = (value: number) => `CLP ${value.toLocaleString('es-CL')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Datos de pasajeros confirmados. Procediendo al pago.');
  };

  return (
    <>
      <main className="w-full max-w-[1312px] mx-auto px-4 md:px-8 py-8 mb-32">
        <button onClick={onBack} className="flex items-center text-purple-700 font-semibold mb-6 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver a selección de equipaje
        </button>
        <div className="text-left mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Datos de los pasajeros
          </h1>
          <p className="text-lg text-gray-600 mt-2">Por favor, completa la información de cada pasajero. Debe coincidir con su documento de viaje.</p>
        </div>

        <form onSubmit={handleSubmit} id="passenger-form" className="space-y-8">
          {passengers.map((passenger, index) => (
            <div key={passenger.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">
                Pasajero {index + 1}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <FormInput label="Nombres" id={`firstName-${passenger.id}`} type="text" value={passenger.firstName || ''} onChange={e => handleDataChange(passenger.id, 'firstName', e.target.value)} required />
                <FormInput label="Apellidos" id={`lastName-${passenger.id}`} type="text" value={passenger.lastName || ''} onChange={e => handleDataChange(passenger.id, 'lastName', e.target.value)} required />
                <FormInput label="Fecha de Nacimiento" id={`dob-${passenger.id}`} type="date" value={passenger.dob || ''} onChange={e => handleDataChange(passenger.id, 'dob', e.target.value)} required />
                <FormSelect label="Nacionalidad" id={`nationality-${passenger.id}`} value={passenger.nationality || ''} onChange={e => handleDataChange(passenger.id, 'nationality', e.target.value)} required>
                  <option value="" disabled>Seleccionar...</option>
                  <option value="Chile">Chile</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Perú">Perú</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Otro">Otro</option>
                </FormSelect>
                <FormSelect label="Tipo de Documento" id={`docType-${passenger.id}`} value={passenger.documentType || ''} onChange={e => handleDataChange(passenger.id, 'documentType', e.target.value)} required>
                  <option value="" disabled>Seleccionar...</option>
                  <option value="DNI">DNI / Cédula</option>
                  <option value="Passport">Pasaporte</option>
                </FormSelect>
                <FormInput label="Número de Documento" id={`docNumber-${passenger.id}`} type="text" placeholder="Sin puntos ni guiones" value={passenger.documentNumber || ''} onChange={e => handleDataChange(passenger.id, 'documentNumber', e.target.value)} required />
              </div>
            </div>
          ))}
        </form>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] p-4">
        <div className="w-full max-w-[1312px] mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <span className="text-sm text-gray-600">Precio total</span>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(grandTotal)}</p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-3">
             <button onClick={onBack} className="w-full md:w-auto text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300">
                Volver
             </button>
             <button type="submit" form="passenger-form" className="w-full md:w-auto bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors text-lg">
                Confirmar y Pagar
             </button>
          </div>
        </div>
      </footer>
    </>
  );
};