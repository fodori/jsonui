import React, { useContext } from 'react'
import { StockContext, wrapperUtil } from '@jsonui/core'

function View({ children, ...props }: any) {
  const stock = useContext(StockContext)
  return (
    <div {...props} style={undefined}>
      {wrapperUtil.generateNewChildren(props, stock)}
    </div>
  )
}

export default View
