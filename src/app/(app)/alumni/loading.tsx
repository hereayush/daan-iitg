// Shown by Next.js App Router while the alumni server component fetches data
export default function AlumniLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* PageIntro skeleton */}
      <div className="mb-10 flex flex-col gap-3">
        <div className="skeleton h-4 w-40 rounded" />
        <div className="skeleton h-9 w-64 rounded" />
        <div className="skeleton h-4 w-96 rounded" />
      </div>

      {/* Filter bar skeleton */}
      <div className="card-cartoon bg-white p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="skeleton h-11 flex-1 rounded-lg" />
        <div className="skeleton h-11 sm:w-48 rounded-lg" />
        <div className="skeleton h-11 sm:w-48 rounded-lg" />
      </div>

      {/* Count bar skeleton */}
      <div className="skeleton h-4 w-48 mb-4 rounded" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="card-cartoon bg-white p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="skeleton w-14 h-14 rounded-xl flex-shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="skeleton h-4 w-28 rounded" />
                <div className="skeleton h-3 w-20 rounded" />
              </div>
            </div>
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-3 w-32 rounded" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="pt-2 border-t border-navy/10 flex flex-col gap-1.5">
              <div className="skeleton h-3 w-24 rounded" />
              <div className="skeleton h-3 w-36 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
