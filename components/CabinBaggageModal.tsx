import React, { useEffect, useMemo } from 'react';
import { baggageDetailsContent } from '../constants';

interface BaggageDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  baggageItemId: string | null;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const WeightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
);

const DimensionsIcon = () => (
    <svg xmlns="http://www.w.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 2v4M9 2v4M3 11h18" />
    </svg>
)

export const BaggageDetailDrawer: React.FC<BaggageDetailDrawerProps> = ({ isOpen, onClose, baggageItemId }) => {
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

  const details = useMemo(() => {
    if (!baggageItemId) return null;
    return baggageDetailsContent[baggageItemId] || baggageDetailsContent['hand-bag'];
  }, [baggageItemId]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} aria-hidden="true"></div>
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <header className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 id="drawer-title" className="text-2xl font-bold text-gray-800">{details?.title || 'Detalles'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-full p-1"
            aria-label="Cerrar"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {details?.description.map((p, i) => (
             <p key={i} className="text-gray-600 leading-relaxed">{p}</p>
          ))}

          {details?.dimensions && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                    <DimensionsIcon />
                </div>
                <div className='flex-1'>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Dimensiones</h3>
                    {details.dimensions.width > 0 ? (
                        <div className="flex items-center gap-4 text-center">
                            <div className="flex-1">
                                <p className="text-2xl font-bold text-purple-700">{details.dimensions.height}</p>
                                <p className="text-sm text-gray-500">cm (alto)</p>
                            </div>
                            <p className="text-2xl text-gray-300 font-light">x</p>
                            <div className="flex-1">
                                <p className="text-2xl font-bold text-purple-700">{details.dimensions.width}</p>
                                <p className="text-sm text-gray-500">cm (ancho)</p>
                            </div>
                            <p className="text-2xl text-gray-300 font-light">x</p>
                            <div className="flex-1">
                                <p className="text-2xl font-bold text-purple-700">{details.dimensions.depth}</p>
                                <p className="text-sm text-gray-500">cm (prof.)</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-2xl font-bold text-purple-700">{details.dimensions.height} cm</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">{details.dimensions.note}</p>
                </div>
            </div>
          )}
          
          {details?.weight && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex items-center gap-6">
                <div className="flex-shrink-0">
                    <WeightIcon />
                </div>
                <div>
                     <h3 className="text-lg font-bold text-gray-800">Peso</h3>
                     <p className="text-gray-600">
                        {details.weight.note.replace(
                            `${details.weight.limit} kg`, 
                            `<span class="font-bold text-purple-700 text-lg">${details.weight.limit} kg</span>`
                        )}
                     </p>
                </div>
           </div>
          )}

          {details?.extraNotes && details.extraNotes.map((note, i) => (
            <div key={i} className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-purple-800">
              <p>{note}</p>
            </div>
          ))}

        </div>

        <footer className="p-6 bg-white border-t border-gray-200 mt-auto">
          <button 
            onClick={onClose} 
            className="w-full bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors text-lg"
          >
            Entendido
          </button>
        </footer>
      </div>
    </div>
  );
};
