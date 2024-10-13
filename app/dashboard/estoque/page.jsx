'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { inserirEstoque, buscarEstoque, excluirEstoque } from '@/backend/db/estoque'
import JsBarcode from 'jsbarcode'
import { BrowserMultiFormatReader } from '@zxing/library'

const EstoqueFuturista = () => {
  const [estoques, setEstoques] = useState([])
  const [scanning, setScanning] = useState(false)
  const videoRef = useRef(null)
  const codeReaderRef = useRef(null)

  const fetchEstoque = useCallback(async () => {
    const dados = await buscarEstoque()
    setEstoques(dados)
  }, [])

  useEffect(() => {
    fetchEstoque()
  }, [fetchEstoque])

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader()
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset()
      }
    }
  }, [])

  useEffect(() => {
    estoques.forEach((estoque) => {
      const canvas = document.getElementById(`barcode-${estoque.id}`)
      if (canvas) {
        JsBarcode(canvas, estoque.codigo, {
          format: 'CODE128',
          displayValue: true,
          fontSize: 14,
          height: 80,
          width: 2,
        })
      }
    })
  }, [estoques])

  const gerarCodigoBarras = () => Math.floor(10000000 + Math.random() * 90000000).toString()

  const handleFormEstoque = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const produto = formData.get('produto')
    const valor = formData.get('valor')
    const unidade = formData.get('unidade')

    if (!produto || !valor || !unidade) {
      alert('Por favor, preencha todos os campos')
      return
    }

    const novoCodigo = gerarCodigoBarras()

    try {
      await inserirEstoque(produto, parseInt(valor), parseInt(unidade), novoCodigo)
      fetchEstoque()
      event.target.reset()
    } catch (error) {
      alert('Erro ao inserir Produto')
    }
  }

  const handleDelete = async (id) => {
    try {
      await excluirEstoque(id)
      fetchEstoque()
    } catch (error) {
      alert('Erro ao excluir Produto')
    }
  }

  const startScanner = useCallback(() => {
    setScanning(true)
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        videoRef.current.srcObject = stream
        videoRef.current.play()

        codeReaderRef.current.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
          if (result) {
            alert(`Código de barras lido: ${result.getText()}`)
            setScanning(false)
            stream.getTracks().forEach((track) => track.stop())
          }
          if (err && !(err instanceof ZXing.NotFoundException)) {
            console.error(err)
          }
        })
      })
      .catch((err) => {
        console.error('Erro ao acessar a câmera: ', err)
        setScanning(false)
      })
  }, [])

  const stopScanner = useCallback(() => {
    setScanning(false)
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
    }
    if (codeReaderRef.current) {
      codeReaderRef.current.reset()
    }
  }, [])

  const imprimirCodigos = (codigo) => {
    const quantidade = prompt('Quantos códigos de barras você deseja imprimir?', '50')
    const quantidadeNumerica = parseInt(quantidade)

    if (isNaN(quantidadeNumerica) || quantidadeNumerica <= 0) {
      alert('Por favor, insira um número válido.')
      return
    }

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('A nova janela não pôde ser aberta. Verifique se os pop-ups estão permitidos.')
      return
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Códigos de Barras</title>
          <style>
            body { display: flex; flex-wrap: wrap; justify-content: space-around; }
            canvas { margin: 10px; }
          </style>
        </head>
        <body>
          ${Array(quantidadeNumerica).fill().map(() => `
            <canvas class="barcode"></canvas>
          `).join('')}
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
          <script>
            document.querySelectorAll('.barcode').forEach(canvas => {
              JsBarcode(canvas, '${codigo}', {
                format: 'CODE128',
                displayValue: true,
                fontSize: 14,
                height: 80,
                width: 2,
              });
            });
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-400 animate-pulse">Cadastro de Estoque</h1>
      
      <form onSubmit={handleFormEstoque} className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nome do produto</label>
            <input type="text" name="produto" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Valor</label>
            <input type="number" name="valor" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Unidade</label>
            <input type="number" name="unidade" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" />
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
            Adicionar ao estoque
          </button>
          <button type="button" onClick={scanning ? stopScanner : startScanner} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200">
            {scanning ? 'Parar Scanner' : 'Ler Código de Barras'}
          </button>
        </div>
      </form>

      <div className="mb-8">
        <video ref={videoRef} className={`w-full max-w-md mx-auto ${scanning ? 'block' : 'hidden'}`}></video>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Produto</th>
              <th className="px-4 py-2 text-left">Valor</th>
              <th className="px-4 py-2 text-left">Unidade</th>
              <th className="px-4 py-2 text-center">Código de Barras</th>
              <th className="px-4 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {estoques.map((estoque) => (
              <tr key={estoque.id} className="border-b border-gray-700 hover:bg-gray-750 transition duration-200">
                <td className="px-4 py-2">{estoque.produto}</td>
                <td className="px-4 py-2">{estoque.valor}</td>
                <td className="px-4 py-2">{estoque.unidade}</td>
                <td className="px-4 py-2 text-center">
                  <canvas id={`barcode-${estoque.id}`} className="mx-auto"></canvas>
                </td>
                <td className="px-4 py-2 text-center">
                  <button onClick={() => handleDelete(estoque.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mr-2 transition duration-200">
                    Excluir
                  </button>
                  <button onClick={() => imprimirCodigos(estoque.codigo)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded transition duration-200">
                    Imprimir Código
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EstoqueFuturista