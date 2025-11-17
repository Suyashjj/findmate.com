import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="relative min-h-screen w-full bg-white overflow-hidden">
      {/* Gradient Reflection */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[400px] rounded-full bg-gradient-to-br from-orange-100 via-rose-100/70 to-orange-50 opacity-70 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <section className='container mx-auto flex justify-center items-center min-h-screen px-4 py-8 relative z-10'>
        <SignUp />
      </section>
    </div>
  )
}