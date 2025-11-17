'use client'

import Image from 'next/image'

interface City {
  id: number
  name: string
  image: string
  alt: string
}

const cities: City[] = [
  {
    id: 1,
    name: 'Bhopal',
    image: '/bhopal.jpg',
    alt: 'Bhopal city skyline',
  },
  {
    id: 2,
    name: 'Indore',
    image: '/indore2.jpg',
    alt: 'Indore city view',
  },
  {
    id: 3,
    name: 'Jabalpur',
    image: '/jabalpur-min.jpg',
    alt: 'Jabalpur skyline',
  },
]

export default function CityGrid() {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            We are available in
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find your perfect room in Bhopal, Indore, Jabalpur and more cities
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cities.map((city) => (
            <div
              key={city.id}
              className="aspect-[4/3] relative group overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-blue-400 to-blue-600"
            >
              {/* City Image with blur placeholder */}
              <Image
                src={city.image}
                alt={city.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                placeholder="blur"
                blurDataURL="/placeholder.png"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

              {/* City name with gradient fade */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white font-semibold text-xl bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                {city.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
