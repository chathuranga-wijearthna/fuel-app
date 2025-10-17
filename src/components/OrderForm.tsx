import React, { useState } from 'react'

export default function OrderForm({ onSubmit, successMessage, errorMessage }: { onSubmit: (payload: any) => Promise<any> | any, successMessage?: string | null, errorMessage?: string | null }) {
  const [tailNumber, setTailNumber] = useState('')
  const [airportIcao, setAirportIcao] = useState('')
  const [requestedFuelVolume, setRequestedFuelVolume] = useState<number | ''>('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  // Get current date/time in the format required by datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date()
    // Convert to local timezone and format for datetime-local input
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  function isValid(): boolean {
    if (!tailNumber || !airportIcao || !requestedFuelVolume || !start || !end) return false;
    if (Number(requestedFuelVolume) <= 1000) return false;
    if (new Date(end).getTime() <= new Date(start).getTime()) return false;
    return true;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid()) return;

    await onSubmit({
      tailNumber: tailNumber.trim(),
      airportIcao: airportIcao.trim().toUpperCase(),
      requestedFuelVolume: Number(requestedFuelVolume),
      deliveryWindowStart: start,
      deliveryWindowEnd: end
    })

    // Reset form after successful submission
    setTailNumber('')
    setAirportIcao('')
    setRequestedFuelVolume('')
    setStart('')
    setEnd('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Card Container */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Fuel Order</h2>
            <p className="text-gray-400">Submit a new fuel delivery request</p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-6">
            {/* Tail Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tail Number
              </label>
              <input
                type="text"
                value={tailNumber}
                onChange={e => setTailNumber(e.target.value)}
                required
                placeholder="Enter aircraft tail number"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Airport ICAO Code Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Airport ICAO Code
              </label>
              <input
                type="text"
                value={airportIcao}
                onChange={e => setAirportIcao(e.target.value.toUpperCase())}
                placeholder="OMDB"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Fuel Volume Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Requested Fuel Volume (Gallons)
              </label>
              <input
                type="number"
                step="0.001"
                min={1000}
                value={requestedFuelVolume}
                onChange={e => setRequestedFuelVolume(e.target.value === '' ? '' : Number(e.target.value))}
                required
                placeholder="Enter fuel volume in gallons (> 1000)"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Delivery Window - Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Start */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Delivery Start
                </label>
                <input
                  type="datetime-local"
                  value={start}
                  onChange={e => setStart(e.target.value)}
                  min={getCurrentDateTime()}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Delivery End */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Delivery End
                </label>
                <input
                  type="datetime-local"
                  value={end}
                  onChange={e => setEnd(e.target.value)}
                  min={start || getCurrentDateTime()}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Inline Messages Above Submit */}
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-400 text-sm font-medium">{successMessage}</p>
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3" role="alert" aria-live="polite">
                <p className="text-red-400 text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid()}
              className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform ${!isValid() ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
            >
              Submit Order
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">Fuel Orders Management System</p>
        </div>
      </div>
    </div>
  )
}
