import React from 'react';
import { Passenger } from '../types'; // Asume que types.ts existe y está importado
// 1. IMPORTACIÓN: Importamos el cargador de scripts
import MazeScriptLoader from '../MazeScriptLoader'; 

interface PassengerDataFormProps {
  passengers: Passenger[];
  // Debemos definir setPassengers para que el formulario pueda actualizar los datos.
  // La firma de setPassengers debe coincidir con la de useState<Passenger[]>
  setPassengers: React.Dispatch<React.SetStateAction<Passenger[]>>;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
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

export const PassengerDataForm: React.FC<PassengerDataFormProps> = ({ passengers, setPassengers, onBack, onSubmit }) => {
  const handleDataChange = (passengerId: string, field: keyof Passenger, value: string) => {
    setPassengers(prev =>
      prev.map(p => {
        // Asegúrate de que los campos que se actualizan realmente existan en el tipo Passenger.
        // Aquí asumimos que field es una clave válida de Passenger.
        if (p.id === passengerId) {
            return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  return (
    <>
      {/* 2. RENDERING: Colocamos el componente aquí. Se carga al mostrar la página. */}
      <MazeScriptLoader /> 

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

      <form onSubmit={onSubmit} id="passenger-form" className="space-y-8 pb-32">
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
    </>
  );
};

export default PassengerDataForm;