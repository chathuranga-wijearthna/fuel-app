import { useState } from 'react'
import OrderForm from '../components/OrderForm'
import { createOrder } from '../utils/api'

export default function OperatorOrderForm() {
    const [msg, setMsg] = useState<string | null>(null)
    const [err, setErr] = useState<string | null>(null)

    async function onSubmit(payload: any) {
        setMsg(null); setErr(null)
        try {
            await createOrder(payload)
            setMsg('Order submitted successfully!')
        } catch (e: any) {
            setErr(e?.message ?? 'Failed to submit order')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            {/* Main Content */}
            <div className="py-8">
                {/* Success Message */}
                {msg && (
                    <div className="max-w-2xl mx-auto px-4 mb-6">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                            <p className="text-green-400 text-sm font-medium">{msg}</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {err && (
                    <div className="max-w-2xl mx-auto px-4 mb-6">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                            <p className="text-red-400 text-sm font-medium">{err}</p>
                        </div>
                    </div>
                )}

                {/* Order Form */}
                <OrderForm onSubmit={onSubmit} />
            </div>
        </div>
    )
}
