import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const { error } = await login(email, senha)

    if (error) {
      setErro('E-mail ou senha incorretos.')
      setCarregando(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-slate-800 rounded-2xl p-8 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-emerald-400 mb-6 text-center">
          Seu Agendamento
        </h1>

        <label className="block text-sm text-slate-300 mb-1">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <label className="block text-sm text-slate-300 mb-1">Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-emerald-400"
        />

        {erro && <p className="text-red-400 text-sm mb-4">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-emerald-500 hover:bg-emerald-400 transition text-slate-900 font-semibold py-2 rounded-lg disabled:opacity-50"
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}