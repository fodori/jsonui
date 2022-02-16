import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { constants as c, wrapperUtil, util, StockContext, PathModifierContext, genAllStateProps, Stock, WrapperType } from '@jsonui/core'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Platform } from 'react-native'
import { InfoBox } from './stock/components/Label'
import ErrorBoundary from './ErrorBoundary'

function Wrapper(props: any) {
  const { [c.V_COMP_NAME]: component, id, [c.PATH_MODIFIERS_KEY]: pathModifiers } = props
  const stock: InstanceType<typeof Stock> = useContext(StockContext)
  const { currentPaths, ...ownProps } = wrapperUtil.getRootWrapperProps(props, stock)
  if (!stock) {
    return null
  }
  const Comp: WrapperType = stock.getComponent(component) as WrapperType
  const infobox = false
  if (!Comp) {
    // eslint-disable-next-line no-throw-literal
    throw `The Component(${component}) is not available`
  }
  const mergedStyle = ownProps.style || ownProps[c.STYLE_RN_NAME] ? { ...(ownProps.style as any), ...(ownProps[c.STYLE_RN_NAME] as any) } : undefined
  ownProps.style =
    Platform.OS === 'ios' || Platform.OS === 'android'
      ? (EStyleSheet.create({ style: { ...mergedStyle } }) || {}).style
      : EStyleSheet.create({ ...mergedStyle })
  const { parentComp, style, [c.STYLE_WEB_NAME]: _unused1, [c.V_COMP_NAME]: _unused2, [c.V_CHILDREN_NAME]: _unused3, ...newProps } = ownProps
  return (
    <ErrorBoundary type="wrapper" id={id}>
      {pathModifiers ? (
        <PathModifierContext.Provider value={currentPaths as any}>
          <Comp {...newProps}>{util.noChildren(component) ? undefined : wrapperUtil.generateChildren(ownProps, stock)}</Comp>
          {infobox && <InfoBox {...ownProps} />}
        </PathModifierContext.Provider>
      ) : (
        <>
          <Comp {...newProps}>{util.noChildren(component) ? undefined : wrapperUtil.generateChildren(ownProps, stock)}</Comp>
          {infobox && <InfoBox {...ownProps} />}
        </>
      )}
    </ErrorBoundary>
  )
}

const ReduxWrapper = connect(genAllStateProps, null, (stateProps, dispatchProps, ownProps) => util.mergePath(ownProps, stateProps), {
  areStatePropsEqual: (next, prev) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(next)) {
      if (value !== prev[key]) {
        return false
      }
    }
    return true
  },
})(Wrapper)

function WrapperOuter(props: any) {
  const currentPaths = useContext(PathModifierContext)
  const newProps = {
    ...props,
    currentPaths,
    // eslint-disable-next-line react/destructuring-assignment
    ...wrapperUtil.pathModifierBuilder({ ...props, currentPaths }, props[c.PATH_MODIFIERS_KEY]),
  }
  return <ReduxWrapper {...newProps} />
}
export default WrapperOuter
