"use client";

import { useEffect } from "react";

interface PaymentInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  orderNumber?: string;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923332211186";

// SVG Icons
const BanknoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-amber-600">
    <rect width="20" height="12" x="2" y="6" rx="2"/>
    <circle cx="12" cy="12" r="2"/>
    <path d="M6 12h.01M18 12h.01"/>
  </svg>
);

const MessageCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

export function PaymentInstructionsModal({
  isOpen,
  onClose,
  onContinue,
  orderNumber,
}: PaymentInstructionsModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleWhatsAppClick = () => {
    const message = "Hello, I placed an order and I am sharing payment screenshot.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b">
          <BanknoteIcon />
          <h2 className="text-xl font-semibold">Online Payment Instructions</h2>
          <button 
            onClick={onClose}
            className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-gray-600">
            Please transfer payment to the following account:
          </p>

          {/* Bank Details Card */}
          <div className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Bank</span>
              <span className="font-semibold text-gray-900">Meezan Bank</span>
            </div>
            <div className="h-px bg-amber-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Account Title</span>
              <span className="font-semibold text-gray-900">Ilyas Sweets</span>
            </div>
            <div className="h-px bg-amber-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Account Number</span>
              <span className="font-mono font-semibold text-gray-900">99120108128884</span>
            </div>
          </div>

          {/* After Payment Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-blue-900 text-sm">After payment:</p>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Save the payment screenshot</li>
              <li>Send screenshot on WhatsApp: <span className="font-semibold">+92 300 4600839</span></li>
              <li>Then click Continue Order below</li>
            </ol>
          </div>

          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <span className="font-semibold">Important:</span> Save the account number and WhatsApp number before leaving this page.
          </p>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <MessageCircleIcon />
            Send Screenshot on WhatsApp
          </button>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <XIcon />
              Cancel
            </button>
            <button
              onClick={onContinue}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <CheckCircleIcon />
              Continue Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
