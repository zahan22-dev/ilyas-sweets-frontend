export const metadata = {
  title: "Shipping Policy | Ilyas Sweets",
};

export default function ShippingPolicy() {
  return (
    <main className="bg-[#FEFFFF] min-h-screen pt-40 pb-40">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-black font-heading text-[#111111] tracking-tighter leading-[0.9] uppercase mb-12 drop-shadow-sm">
          Shipping <span className="text-[#FF8A00] italic pr-4">Policy.</span>
        </h1>
        
        <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-gray-50 space-y-10 text-lg text-gray-600 font-bold leading-loose">
          <section>
            <h2 className="text-2xl font-black font-heading uppercase text-[#111111] tracking-widest mb-4">1. Delivery Zones</h2>
            <p>We currently offer delivery exclusively within the Karachi metropolitan area to ensure that our premium sweets and hot snacks arrive fresh and in optimal condition.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black font-heading uppercase text-[#111111] tracking-widest mb-4">2. Delivery Timings</h2>
            <p>Our standard delivery window is from 10:00 AM to 10:00 PM, seven days a week. For standard orders, we aim to deliver within 45 to 60 minutes of order confirmation. Delays may occur during peak hours, bad weather, or public holidays.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black font-heading uppercase text-[#111111] tracking-widest mb-4">3. Delivery Charges</h2>
            <p>A flat delivery fee of Rs. 150 applies to all orders within our standard delivery zones. For bulk orders or catering deliveries, custom delivery charges may apply and will be communicated prior to order confirmation.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-black font-heading uppercase text-[#111111] tracking-widest mb-4">4. Receiving Your Order</h2>
            <p>Please ensure someone is available at the delivery address to receive the order. Our riders will attempt to contact you upon arrival. If an order cannot be delivered due to an incorrect address or the customer being unreachable, the order will be returned to the bakery, and no refund will be issued due to the perishable nature of the items.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
