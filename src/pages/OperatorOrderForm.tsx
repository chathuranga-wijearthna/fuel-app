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
            <div className="py-8">
                {/* Order Form */}
                <OrderForm onSubmit={onSubmit} successMessage={msg} errorMessage={err} />
            </div>
        </div>
    )
}
