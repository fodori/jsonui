import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { ClassNames } from '@emotion/react'
import { constants as c, wrapperUtil, util, StockContext, PathModifierContext, genAllStateProps, Stock, WrapperType } from '@jsonui/core'
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
  const newStyle = ownProps.style || ownProps[c.STYLE_WEB_NAME] ? util.getStyleForWeb(ownProps, component) : undefined
  return (
    <ErrorBoundary type="wrapper" id={id}>
      <ClassNames>
        {({ css, cx }) => {
          ownProps.className = newStyle ? cx(css(newStyle)) : undefined
          const { parentComp, style, [c.STYLE_WEB_NAME]: _unused1, [c.V_COMP_NAME]: _unused2, [c.V_CHILDREN_NAME]: _unused3, ...newProps } = ownProps
          return pathModifiers ? (
            <PathModifierContext.Provider value={currentPaths as any}>
              <Comp {...newProps}>{util.noChildren(component) ? undefined : wrapperUtil.generateChildren(ownProps, stock)}</Comp>
              {infobox && <InfoBox {...ownProps} />}
            </PathModifierContext.Provider>
          ) : (
            <>
              <Comp {...newProps}>{util.noChildren(component) ? undefined : wrapperUtil.generateChildren(ownProps, stock)}</Comp>
              {infobox && <InfoBox {...ownProps} />}
            </>
          )
        }}
      </ClassNames>
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
