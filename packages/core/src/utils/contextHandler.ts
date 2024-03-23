import { createContext } from 'react'
import Stock from 'stock/Stock'

export const StockContext = createContext<Stock | null>(null)
export const PathModifierContext = createContext({})
