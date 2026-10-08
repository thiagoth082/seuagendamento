import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNegocio } from '../../hooks/useNegocio'

export default function Servicos() {
  const { negocio } = useNegocio()
  const [servicos, setServicos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [nome, setNome] = useState('')
  const [duracao, setDuracao] = useState('')
  const [preco, setPreco] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function carregarServicos() {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setServicos(data)
    setCarregando(false)
  }

  useEffect(() => {
    if (negocio) carregarServicos()
  }, [negocio])

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!nome || !duracao || !preco) {
      setErro('Preencha nome, duração e preço.')
      return
    }

    setSalvando(true)

    const { error } = await supabase.from('servicos').insert({
      negocio_id: negocio.id,
      nome,
      duracao_minutos: parseInt(duracao),
      preco: parseFloat(preco),
    })

    if (error) {
      setErro('Erro ao salvar: ' + error.message)
    } else {
      setNome('')
      setDuracao('')
      setPreco('')
      await carregarServicos()
    }
    setSalvando(false)
  }

  async function excluirServico(id) {
    if (!confirm('Excluir este serviço?')) return
    await supabase.from('servicos').delete().eq('id', id)
    await carregarServicos()
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold text-emerald-400 mb-6">Serviços</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 rounded-2xl p-6 mb-8 grid gap-4 sm:grid-cols-4"
      >
        <input
          type="text"
          placeholder="Nome do serviço"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="px-4 py-2 rounded-lg bg-slate-700 outline-none focus:ring-2 focus:ring-emerald-400 sm:col-span-2"
        />
        <input
          type="number"
          placeholder="Duração (min)"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
          className="px-4 py-2 rounded-lg bg-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Preço (R$)"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className="px-4 py-2 rounded-lg bg-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
        />

        {erro && <p className="text-red-400 text-sm sm:col-span-4">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="sm:col-span-4 bg-emerald-500 hover:bg-emerald-400 transition text-slate-900 font-semibold py-2 rounded-lg disabled:opacity-50"
        >
          {salvando ? 'Salvando...' : 'Adicionar serviço'}
        </button>
      </form>

      {carregando ? (
        <p className="text-slate-400">Carregando...</p>
      ) : servicos.length === 0 ? (
        <p className="text-slate-400">Nenhum serviço cadastrado ainda.</p>
      ) : (
        <div className="grid gap-3">
          {servicos.map((s) => (
            <div
              key={s.id}
              className="bg-slate-800 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{s.nome}</p>
                <p className="text-sm text-slate-400">
                  {s.duracao_minutos} min · R$ {Number(s.preco).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => excluirServico(s.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}