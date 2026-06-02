import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Plus, Minus, Trash2, Truck, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export default function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-cream shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-brand-ink/5">
              <h2 className="text-2xl font-serif">Your Bag</h2>
              <button onClick={onClose} className="p-2 hover:bg-brand-ink/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-brand-ink/40 space-y-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="font-serif italic text-lg">Your bag is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-24 bg-brand-sand rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-lg leading-tight">{item.name}</h3>
                        <p className="text-sm text-brand-ink/60">${item.price}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 border border-brand-ink/10 rounded-full px-2 py-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 hover:text-brand-clay transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 hover:text-brand-clay transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-brand-ink/40 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-brand-ink/5 space-y-6 bg-brand-sand/30">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">
                    <Truck size={12} />
                    <span>Free Shipping on all orders</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">
                    <ShieldCheck size={12} />
                    <span>Cash on Delivery available</span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-brand-ink/60 text-sm uppercase tracking-widest">Subtotal</span>
                  <span className="text-2xl font-serif">${total}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-brand-ink text-brand-cream py-4 rounded-full font-medium hover:bg-brand-sage transition-all duration-300 shadow-lg hover:shadow-brand-sage/20"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
