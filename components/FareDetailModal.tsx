import React, { useEffect } from 'react';

interface FareDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const XIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CloseButtonIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const IncludedItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start gap-3 text-gray-700">
        <CheckIcon />
        <span>{children}</span>
    </li>
);

const ExcludedItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start gap-3 text-gray-500">
        <XIcon />
        <span>{children}</span>
    </li>
);

export const FareDetailModal: React.FC<FareDetailModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fare-modal-title"
    >
        <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md m-auto p-6 animate-scale-in"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex justify-between items-center mb-4">
                 <h2 id="fare-modal-title" className="text-xl font-bold text-gray-900">Detalles de tu Tarifa Light</h2>
                 <button 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-full p-1"
                    aria-label="Cerrar"
                >
                    <CloseButtonIcon />
                 </button>
            </div>

            <div className="space-y-4">
                <p className="text-gray-600">Esto es lo que incluye tu pasaje para cada tramo y pasajero:</p>
                <ul className="space-y-3 text-base sm:text-lg py-2">
                    <IncludedItem>1 Bolso de mano</IncludedItem>
                    <IncludedItem>1 Equipaje de cabina de 12 kg</IncludedItem>
                    <IncludedItem>Selección de asiento estándar</IncludedItem>
                    <IncludedItem>Cambio de vuelo con costo</IncludedItem>
                </ul>

                <div className="pt-4 border-t border-gray-200">
                     <ul className="space-y-3 text-base sm:text-lg">
                     </ul>
                </div>
            </div>

            <div className="mt-6">
                <button 
                    onClick={onClose} 
                    className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors text-base"
                >
                    Entendido
                </button>
            </div>
        </div>
    </div>
  );
};