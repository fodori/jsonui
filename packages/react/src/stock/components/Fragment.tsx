import React, { useContext } from 'react'
import { StockContext, constants as c, wrapperUtil } from '@jsonui/core'

const Fragment = ({ [c.V_CHILDREN_NAME]: props, ...a }: { [c.V_CHILDREN_NAME]: any }) => {
  const stock = useContext(StockContext)
  return <>{wrapperUtil.generateNewChildren(props, stock)}</>
}

export default Fragment
