import { useState, useMemo } from 'react'

export function usePagination({ totalItems, pageSize = 10 }) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(totalItems / pageSize)

  const goTo     = (p)  => setCurrentPage(Math.min(Math.max(1, p), totalPages))
  const next     = ()   => goTo(currentPage + 1)
  const prev     = ()   => goTo(currentPage - 1)
  const reset    = ()   => setCurrentPage(1)

  const pageNumbers = useMemo(() => {
    const delta  = 2
    const left   = currentPage - delta
    const right  = currentPage + delta + 1
    const range  = []
    const result = []
    let last

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) range.push(i)
    }

    for (const i of range) {
      if (last) {
        if (i - last === 2) result.push(last + 1)
        else if (i - last !== 1) result.push('...')
      }
      result.push(i)
      last = i
    }

    return result
  }, [currentPage, totalPages])

  return { currentPage, totalPages, pageNumbers, goTo, next, prev, reset }
}
