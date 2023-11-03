import React, { useContext } from 'react'
import { StockContext, wrapperUtil, constants as c } from '@jsonui/core'

function View({ children, ...props }: any) {
  const stock = useContext(StockContext)
  return <div {...props}>{wrapperUtil.generateNewChildren(props[c.V_CHILDREN_NAME], stock)}</div>
}

export default View
