'use client'
import { useCart } from '@/lib/store'
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, Send, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default function Cart() {
  const { items, isOpen, isReview, closeCart, removeItem, updateQty, clearCart, setReview, totalItems, totalPrice, orderMessage } = useCart()

  const sendWhatsApp = () => {
    const settings = (window as any).__ROYAL_SETTINGS__
    const num = settings?.whatsapp || '85596907731'
    window.open(`https://wa.me/${num}?text=${orderMessage()}`, '_blank')
  }

  const sendTelegram = () => {
    const settings = (window as any).__ROYAL_SETTINGS__
    const user = settings?.telegram || 'royalcoffeekh'
    window.open(`https://t.me/${user}?text=${orderMessage()}`, '_blank')
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300]" onClick={closeCart} />
      <div className="cart-panel fixed right-0 top-0 h-full w-full max-w-[420px] z-[400] flex flex-col border-l border-[rgba(201,146,42,0.15)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3">
            {isReview && (
              <button onClick={() => setReview(false)} className="text-[rgba(245,240,232,0.4)] hover:text-[#c9922a] transition-colors" style={{ cursor: 'none' }}>
                <ArrowLeft size={17} />
              </button>
            )}
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 400 }}>
              {isReview ? <span className="gold-shimmer">Review Order</span> : <>Your <span className="gold-shimmer" style={{ fontStyle: 'italic' }}>Order</span></>}
            </h3>
            {!isReview && totalItems() > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(201,146,42,0.12)] text-[#c9922a] border border-[rgba(201,146,42,0.2)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {totalItems()} {totalItems() === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[rgba(245,240,232,0.4)] hover:text-[#c9922a] hover:border-[rgba(201,146,42,0.3)] transition-all" style={{ cursor: 'none' }}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag size={44} className="text-[rgba(201,146,42,0.2)]" />
              <p className="text-sm text-[rgba(245,240,232,0.35)] tracking-wide" style={{ fontFamily: 'Outfit, sans-serif' }}>Your order is empty</p>
              <button onClick={closeCart} className="btn-outline px-6 py-2 rounded-full text-xs tracking-widest" style={{ cursor: 'none' }}>Browse Menu</button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem' }} className="text-[rgba(245,240,232,0.9)] truncate">{item.name}</p>
                    <p className="text-xs text-[#c9922a] mt-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  {!isReview ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-6 h-6 rounded-md bg-[rgba(201,146,42,0.1)] text-[#c9922a] flex items-center justify-center hover:bg-[rgba(201,146,42,0.2)] transition-colors" style={{ cursor: 'none' }}><Minus size={11} /></button>
                      <span className="text-xs font-medium text-[rgba(245,240,232,0.9)] w-5 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-6 h-6 rounded-md bg-[rgba(201,146,42,0.1)] text-[#c9922a] flex items-center justify-center hover:bg-[rgba(201,146,42,0.2)] transition-colors" style={{ cursor: 'none' }}><Plus size={11} /></button>
                      <button onClick={() => removeItem(item.id)} className="w-6 h-6 rounded-md text-[rgba(245,240,232,0.2)] hover:text-red-400 flex items-center justify-center transition-colors ml-1" style={{ cursor: 'none' }}><Trash2 size={11} /></button>
                    </div>
                  ) : (
                    <span className="text-xs text-[rgba(245,240,232,0.4)]" style={{ fontFamily: 'Outfit, sans-serif' }}>×{item.quantity}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[rgba(255,255,255,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[rgba(245,240,232,0.4)] tracking-widest uppercase" style={{ fontFamily: 'Outfit, sans-serif' }}>Total</span>
              <span className="gold-shimmer text-2xl" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}>${totalPrice().toFixed(2)}</span>
            </div>

            {!isReview ? (
              <button onClick={() => setReview(true)} className="w-full btn-gold py-3.5 rounded-xl text-xs tracking-widest" style={{ cursor: 'none' }}>
                Review Order →
              </button>
            ) : (
              <div className="space-y-2.5">
                <p className="text-center text-[10px] text-[rgba(245,240,232,0.35)] tracking-widest uppercase" style={{ fontFamily: 'Outfit, sans-serif' }}>Send order via</p>
                <button onClick={sendWhatsApp} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#1da851] transition-colors" style={{ fontFamily: 'Outfit, sans-serif', cursor: 'none' }}>
                  <MessageCircle size={15} /> WhatsApp
                </button>
                <button onClick={sendTelegram} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#229ED9] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#1b8abf] transition-colors" style={{ fontFamily: 'Outfit, sans-serif', cursor: 'none' }}>
                  <Send size={15} /> Telegram
                </button>
                <button onClick={clearCart} className="w-full py-2 text-[10px] tracking-widest uppercase text-[rgba(245,240,232,0.2)] hover:text-red-400 transition-colors" style={{ fontFamily: 'Outfit, sans-serif', cursor: 'none' }}>Clear Order</button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
