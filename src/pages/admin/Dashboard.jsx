import { useAuth } from '../../contexts/AuthContext'

export default function Dashboard() {
  const { usuario, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-400">Painel</h1>
        <button
          onClick={logout}
          className="text-sm text-slate-300 hover:text-white underline"
        >
          Sair
        </button>
      </div>
      <p>Logado como: {usuario?.email}</p>
    </div>
  )
}