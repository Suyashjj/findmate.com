"use client";
import React from "react";
import { Star, Quote } from "lucide-react";

const ExperiencesSection = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      image: "PS",
      text: "Found my perfect roommate within a week! The matching algorithm is amazing. My roommate and I share similar interests and schedules.",
      date: "2 weeks ago",
    },
    {
      name: "Rahul Kumar",
      location: "Bangalore",
      rating: 5,
      image: "RK",
      text: "This platform made my relocation so easy. All verified profiles gave me peace of mind. Highly recommend for anyone looking for roommates!",
      date: "1 month ago",
    },
    {
      name: "Sneha Patel",
      location: "Delhi",
      rating: 5,
      image: "SP",
      text: "Best roommate finding experience ever! The interface is simple and the safety features are top-notch. Found great roommates who became friends.",
      date: "3 weeks ago",
    },
    {
      name: "Arjun Mehta",
      location: "Pune",
      rating: 4,
      image: "AM",
      text: "Great platform with genuine listings. The verification process ensures you meet real people. Saved me from so many sketchy situations!",
      date: "2 months ago",
    },
    {
      name: "Ananya Singh",
      location: "Hyderabad",
      rating: 5,
      image: "AS",
      text: "As a working professional new to the city, this was a lifesaver. Found roommates with similar lifestyle and budget preferences easily.",
      date: "1 week ago",
    },
    {
      name: "Vikram Reddy",
      location: "Chennai",
      rating: 5,
      image: "VR",
      text: "The search filters are very helpful. Found a room exactly matching my requirements. The whole process was smooth and hassle-free!",
      date: "3 weeks ago",
    },
  ];

  return (
    <section id="experiences" className="relative w-full py-20 overflow-hidden">

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        
        {/* ⭐ HEADER (KEPT SAME AS PREVIOUS) */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-4">
            <Star className="w-4 h-4 fill-amber-600 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">User Experiences</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight mt-4">
            What our users{" "}
            <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              say about us
            </span>
          </h2>

          <p className="mt-4 text-gray-600 text-base md:text-lg font-light max-w-2xl mx-auto">
            Real stories from people who found their perfect roommates through findmate.com
          </p>
        </div>

        {/* Testimonials Grid — NO BG */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-16 h-16 text-gray-600" />
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-6 relative z-10">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-gray-700">
                  {testimonial.image}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                </div>
                <span className="text-xs text-gray-400">{testimonial.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section — NO BG */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-2xl shadow-md border border-gray-200">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">10K+</div>
            <p className="text-sm text-gray-600 font-medium">Happy Users</p>
          </div>

          <div className="p-6 rounded-2xl shadow-md border border-gray-200">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">5K+</div>
            <p className="text-sm text-gray-600 font-medium">Successful Matches</p>
          </div>

          <div className="p-6 rounded-2xl shadow-md border border-gray-200">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">4.8</div>
            <p className="text-sm text-gray-600 font-medium">Average Rating</p>
          </div>

          <div className="p-6 rounded-2xl shadow-md border border-gray-200">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">50+</div>
            <p className="text-sm text-gray-600 font-medium">Cities Covered</p>
          </div>
        </div>

        
        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-full hover:from-amber-700 hover:to-orange-800 transition shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-base">
            Share Your Experience
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExperiencesSection;
