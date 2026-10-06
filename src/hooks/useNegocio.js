import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useNegocio() {
  const { usuario } = useAuth()
  const [negocio, setNegocio] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!usuario) {
      setCarregando(false)
      return
    }

    async function buscarNegocio() {
      const { data, error } = await supabase
        .from('usuarios_negocios')
        .select('papel, negocios (id, nome, slug, status)')
        .eq('usuario_id', usuario.id)
        .single()

      if (!error && data) {
        setNegocio({ ...data.negocios, papel: data.papel })
      }
      setCarregando(false)
    }

    buscarNegocio()
  }, [usuario])

  return { negocio, carregando }
}