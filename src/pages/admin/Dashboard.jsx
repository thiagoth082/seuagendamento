import { useAuth } from '../../contexts/AuthContext'
import { useNegocio } from '../../hooks/useNegocio'

export default function Dashboard() {
  const { usuario, logout } = useAuth()
  const { negocio, carregando } = useNegocio()

  if (carregando) {
    return <div className="min-h-screen bg-slate-900" />
  }

  if (!negocio) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <p>Nenhum negócio vinculado a este usuário.</p>
        <button onClick={logout} className="underline text-sm mt-4">
          Sair
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-400">{negocio.nome}</h1>
        <div className="flex gap-4 items-center">
          <a href="/admin/servicos" className="text-sm text-slate-300 hover:text-white underline">
            Serviços
          </a>
          <button
            onClick={logout}
            className="text-sm text-slate-300 hover:text-white underline"
          >
            Sair
          </button>
        </div>
      </div>
      <p className="text-slate-400 text-sm mb-1">Logado como: {usuario?.email}</p>
      <p className="text-slate-400 text-sm mb-1">Papel: {negocio.papel}</p>
      <p className="text-slate-400 text-sm">
        Status do negócio: <span className="text-emerald-400">{negocio.status}</span>
      </p>
    </div>
  )
}