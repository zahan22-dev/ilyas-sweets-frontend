export default function Reviews() {
  const reviews = [
    {
      id: 1,
      name: "Ahmed Raza",
      text: "Absolutely the best Gulab Jamun I've had in Karachi. So fresh, melt-in-the-mouth texture. My whole family loved it!",
      rating: 5,
    },
    {
      id: 2,
      name: "Sadia Khan",
      text: "The Chicken Samosas are a must-try. Perfect crispiness and the filling is loaded with flavor. Highly recommended for tea time.",
      rating: 5,
    },
    {
      id: 3,
      name: "Usman Ali",
      text: "Ordered the premium sweets box for a wedding. The packaging was beautiful and the sweets were exceptionally fresh. Great service.",
      rating: 5,
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#FEFFFF]">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-black font-heading text-[#111111] mb-6 tracking-tighter uppercase">
            Customer <span className="text-[#FFC702]">Love</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-500 font-bold max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our loyal customers have to say about our sweets and snacks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 relative">
              <div className="absolute -top-6 -right-6 text-[#FFC702] opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1.5.5 1.5 1.714 0 1.786-.5 2.286-1.5 2.286v4zm13 0c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 1 0 1.5.5 1.5 1.714 0 1.786-.5 2.286-1.5 2.286v4z"/></svg>
              </div>
              
              <div className="flex gap-1 mb-6 text-[#FFC702]">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              
              <p className="text-gray-600 font-bold text-lg leading-relaxed mb-8 relative z-10">"{review.text}"</p>
              
              <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#111111] font-black text-lg uppercase">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-[#111111] uppercase tracking-wider">{review.name}</h4>
                  <span className="text-sm font-bold text-gray-400">Verified Buyer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
