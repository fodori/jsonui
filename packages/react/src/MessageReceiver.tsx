import { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ChangeDefaultValueFunc } from 'types'
import { MessageHandlerContext } from './MessageReceiverContext'

const MessageReceiver = () => {
  const dispatch = useDispatch()
  const messageHandler = useContext(MessageHandlerContext)
  const changeDefaultValue: ChangeDefaultValueFunc = ({ store, path, value }) => {
    // TODO maybe need to export from core
    dispatch({ type: 'DATA_UPDATE', payload: { store, value, path } })
  }
  useEffect(() => {
    messageHandler?.set(changeDefaultValue)
  }, [messageHandler, dispatch])
  return null
}

export default MessageReceiver
