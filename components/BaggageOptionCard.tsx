import React, { useState, useEffect, useRef } from 'react';
import { BaggageItem, Passenger } from '../types';
import { BAGGAGE_ITEM_LIMITS } from '../constants';
import { Switch } from './Switch';
// 1. IMPORTACIÓN: Importa el componente cargador de Maze
import MazeScriptLoader from '../MazeScriptLoader'; 

interface BaggageOptionCardProps {
  item: BaggageItem;
  passengers: Passenger[];
  onQuantityChange: (itemId: string, passengerId: string, direction: 'ida' | 'vuelta', delta: number) => void;
  isSameForAll: boolean;
  onSameForAllChange: (checked: boolean) => void;
  separateTrips: boolean;
  onSeparateTripsChange: (checked: boolean) => void;
  onCancel: () => void;
  onDetailClick: () => void;
  addToast: (message: string, type: 'success' | 'info') => void;
}

const QuantityControlButton: React.FC<{ onClick: () => void; children: React.ReactNode; disabled?: boolean }> = ({ onClick, children, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-8 h-8 rounded-full bg-white border border-gray-300 text-purple-700 text-xl font-bold flex items-center justify-center hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    aria-label={children === '-' ? 'Disminuir cantidad' : 'Aumentar cantidad'}
  >
    {children}
  </button>
);


export const BaggageOptionCard: React.FC<BaggageOptionCardProps> = ({ item, passengers, onQuantityChange, isSameForAll, onSameForAllChange, separateTrips, onSeparateTripsChange, onCancel, onDetailClick, addToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [countBeforeEditing, setCountBeforeEditing] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const totalIda = passengers.reduce((sum, p) => sum + (p.baggage[item.id]?.ida || 0), 0);
  const totalVuelta = passengers.reduce((sum, p) => sum + (p.baggage[item.id]?.vuelta || 0), 0);
  const totalCount = totalIda + totalVuelta;
  const hasItems = totalCount > 0;

  useEffect(() => {
    if (!hasItems && isEditing) {
      setIsEditing(false);
    }
  }, [hasItems, isEditing]);
  
  useEffect(() => {
    if (isEditing && cardRef.current) {
      // Use a timeout to ensure the scroll happens after the element has expanded
      const timer = setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);

  const prevIsEditingRef = useRef(isEditing);
  useEffect(() => {
    if (prevIsEditingRef.current && !isEditing) {
      // Animate when transitioning from editing to not-editing
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500); // Corresponds to animation duration
      return () => clearTimeout(timer);
    }
    prevIsEditingRef.current = isEditing;
  }, [isEditing]);

  const handleInitialAdd = () => {
    setCountBeforeEditing(0);
    onQuantityChange(item.id, passengers[0].id, 'ida', 1);
    setIsEditing(true);
  };

  const handleModify = () => {
    setCountBeforeEditing(totalCount);
    setIsEditing(true);
  };

  const handleConfirm = () => {
    const diff = totalCount - countBeforeEditing;
    if (diff !== 0) {
      if (totalCount > 0) {
        addToast(`Tienes ${totalCount} x ${item.name}`, 'success');
      } else {
        addToast(`Se eliminó ${item.name} de tu reserva`, 'info');
      }
    }
    setIsEditing(false);
  };
  
  const handleCancelAndCollapse = () => {
    onCancel();
    setIsEditing(false);
  }
  
  const handleCardClick = () => {
    if (!isEditing) {
      hasItems ? handleModify() : handleInitialAdd();
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleDetailClick = (e: React.MouseEvent) => {
    stopPropagation(e);
    onDetailClick();
  };

  const formatCurrency = (value: number) => `CLP ${value.toLocaleString('es-CL')}`;

  return (
    // Es importante envolver todo el contenido con un fragmento (<>)
    <>
      {/* 2. RENDERING: Colocamos el componente aquí para que Maze inicie el tracking en esta página. */}
      <MazeScriptLoader /> 
      
      <div 
        ref={cardRef}
        className={`bg-white p-5 rounded-2xl shadow-sm border ${isEditing ? 'border-purple-300 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300 hover:shadow-lg cursor-pointer'} flex flex-col gap-4 transition-all min-h-[250px] ${isAnimating ? 'animate-subtle-glow' : ''}`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
        aria-expanded={isEditing}
      >
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
          <div className="flex-shrink-0">
            <img src={item.image} alt={item.name} className="w-32 h-32 object-contain" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
            <button onClick={handleDetailClick} className="text-sm text-purple-700 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-purple-200 rounded">
              {item.details}
            </button>
            
            {hasItems && !isEditing && (
              <p className="text-gray-700 font-semibold my-2">
                Tienes en tu reserva: <span className="text-purple-700 font-bold">{totalIda} Ida | {totalVuelta} Vuelta</span>
              </p>
            )}

            <div className="my-2">
                <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(item.price)}</p>
                    {item.discount && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{item.discount}</span>}
                </div>
                {item.oldPrice && <p className="text-sm text-gray-500 line-through">Antes {formatCurrency(item.oldPrice)}</p>}
            </div>
          </div>
        </div>
        
        {isEditing && (
          <div className="w-full space-y-4 pt-4 border-t border-gray-200" onClick={stopPropagation}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-3 border-b border-gray-100 mb-3">
              {item.category !== 'pet' && (
                <label htmlFor={`same-for-all-${item.id}`} className="flex items-center gap-3 cursor-pointer text-gray-700 font-medium text-sm">
                  <input 
                    type="checkbox" 
                    id={`same-for-all-${item.id}`} 
                    checked={isSameForAll} 
                    onChange={(e) => onSameForAllChange(e.target.checked)} 
                    className="h-5 w-5 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  Mismo equipaje para todos los pasajeros
                </label>
              )}
              <div className={`flex items-center gap-3 ${item.category !== 'pet' ? 'sm:ml-auto' : 'w-full justify-end'}`}>
                <label htmlFor={`separate-trips-${item.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                  Elegir ida y vuelta por separado
                </label>
                <Switch id={`separate-trips-${item.id}`} checked={separateTrips} onChange={onSeparateTripsChange} />
              </div>
            </div>
            
            <div className="space-y-3">
              {isSameForAll && item.category !== 'pet' ? (
                (() => {
                  const firstPassenger = passengers[0];
                  if (!firstPassenger) return null;
                  const idaCount = firstPassenger.baggage[item.id]?.ida || 0;
                  const vueltaCount = firstPassenger.baggage[item.id]?.vuelta || 0;
                  const limit = BAGGAGE_ITEM_LIMITS[item.id] ?? Infinity;

                  return (
                    <div className="flex flex-wrap justify-between items-center text-sm gap-2">
                      <p className="font-medium text-gray-700">Todos los pasajeros</p>
                      {separateTrips ? (
                        <div className="flex items-center gap-x-3 sm:gap-x-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 w-8 text-right">Ida</span>
                            <QuantityControlButton onClick={() => onQuantityChange(item.id, firstPassenger.id, 'ida', -1)} disabled={idaCount === 0}>-</QuantityControlButton>
                            <span className="font-bold w-4 text-center" aria-live="polite">{idaCount}</span>
                            <QuantityControlButton onClick={() => onQuantityChange(item.id, firstPassenger.id, 'ida', 1)} disabled={idaCount >= limit}>+</QuantityControlButton>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 w-8 text-right">Vuelta</span>
                            <QuantityControlButton onClick={() => onQuantityChange(item.id, firstPassenger.id, 'vuelta', -1)} disabled={vueltaCount === 0}>-</QuantityControlButton>
                            <span className="font-bold w-4 text-center" aria-live="polite">{vueltaCount}</span>
                            <QuantityControlButton onClick={() => onQuantityChange(item.id, firstPassenger.id, 'vuelta', 1)} disabled={vueltaCount >= limit}>+</QuantityControlButton>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Ida y Vuelta</span>
                          <QuantityControlButton onClick={() => onQuantityChange(item.id, firstPassenger.id, 'ida', -1)} disabled={idaCount === 0}>-</QuantityControlButton>
                          <span className="text-xl font-bold w-6 text-center" aria-live="polite">{idaCount}</span>
                          <QuantityControlButton onClick={() => onQuantityChange(item.id, firstPassenger.id, 'ida', 1)} disabled={idaCount >= limit}>+</QuantityControlButton>
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                passengers.map((passenger) => {
                  const idaCount = passenger.baggage[item.id]?.ida || 0;
                  const vueltaCount = passenger.baggage[item.id]?.vuelta || 0;
                  const limit = BAGGAGE_ITEM_LIMITS[item.id] ?? Infinity;
                  
                  return (
                    <div key={passenger.id} className="flex flex-wrap justify-between items-center text-sm gap-2">
                      <p className="font-medium text-gray-700">{passenger.name}</p>
                      {separateTrips ? (
                        <div className="flex items-center gap-x-3 sm:gap-x-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 w-8 text-right">Ida</span>
                            <QuantityControlButton onClick={() => onQuantityChange(item.id, passenger.id, 'ida', -1)} disabled={idaCount === 0}>-</QuantityControlButton>
                            <span className="font-bold w-4 text-center" aria-live="polite">{idaCount}</span>
                            <QuantityControlButton onClick={() => onQuantityChange(item.id, passenger.id, 'ida', 1)} disabled={idaCount >= limit}>+</QuantityControlButton>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 w-8 text-right">Vuelta</span>
                            <QuantityControlButton onClick={() => onQuantityChange(item.id, passenger.id, 'vuelta', -1)} disabled={vueltaCount === 0}>-</QuantityControlButton>
                            <span className="font-bold w-4 text-center" aria-live="polite">{vueltaCount}</span>
                            <QuantityControlButton onClick={() => onQuantityChange(item.id, passenger.id, 'vuelta', 1)} disabled={vueltaCount >= limit}>+</QuantityControlButton>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Ida y Vuelta</span>
                          <QuantityControlButton onClick={() => onQuantityChange(item.id, passenger.id, 'ida', -1)} disabled={idaCount === 0}>-</QuantityControlButton>
                          <span className="text-xl font-bold w-6 text-center" aria-live="polite">{idaCount}</span>
                          <QuantityControlButton onClick={() => onQuantityChange(item.id, passenger.id, 'ida', 1)} disabled={idaCount >= limit}>+</QuantityControlButton>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200 mt-2">
              <div>
                {hasItems && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Subtotal del ítem</span>
                    <p className="font-bold text-lg text-purple-700">{formatCurrency(totalCount * item.price)}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleCancelAndCollapse} className="text-gray-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                    Cancelar
                </button>
                <button onClick={handleConfirm} className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                    Confirmar ({totalCount})
                </button>
              </div>
            </div>
          </div>
        )}
        
        {!isEditing && (
          <div className="w-full pt-4 mt-auto border-t border-gray-100" onClick={stopPropagation}>
            {hasItems ? (
                <button 
                  onClick={handleModify} 
                  className="w-full bg-white text-purple-700 font-bold py-3 px-6 rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-colors text-base"
                  aria-label={`Modificar ${item.name}`}
                >
                  Modificar
                </button>
            ) : (
              <button 
                  onClick={handleInitialAdd} 
                  className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors text-base" 
                  aria-label={`Agregar ${item.name} a mi reserva`}
                >
                  Agregar a mi reserva
                </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BaggageOptionCard;