import React, { useContext } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { ClassNames } from '@emotion/react'
import {
  constants as c,
  wrapperUtil,
  StockContext,
  PathModifierContext,
  Stock,
  WrapperType,
  PropsType,
  compSelectorHook,
  PathModifiersType,
  ReduxPathType,
} from '@jsonui/core'
import { InfoBox } from './stock/components/Label'
import ErrorBoundary from './ErrorBoundary'

const getWebStyle = (props: PropsType) => {
  const { [c.PARENT_PROP_NAME]: parentComp } = props
  const style = { display: 'flex', flexDirection: 'column', ...(props.style as any), ...(props[c.STYLE_WEB_NAME] as any) }

  if (style && style.borderWidth && !style.borderStyle) {
    style.borderStyle = 'solid'
  }
  if (style && style.flex) {
    if (
      parentComp &&
      (parentComp as any).style &&
      (parentComp as any).style.flex &&
      (parentComp as any).style.flex < 1
      // if smaller or larger, noesn't matter
    ) {
      style.height = `100%`
      style.width = `100%`
    } else if (!style.height) {
      style.height = `${style.flex * 100}%`
    }
  }
  return style
}

export const getStyle = (props: PropsType = {}, component: string) =>
  component === 'View' ? getWebStyle(props) : { ...(props.style as any), ...(props[c.STYLE_WEB_NAME] as any) }

function Wrapper({ props: origProps }: { props: any }) {
  const newCurrentPaths = useContext(PathModifierContext)
  const stock: InstanceType<typeof Stock> = useContext(StockContext)

  const props = {
    ...wrapperUtil.normalisePrimitives(origProps),
    [c.CURRENT_PATH_NAME]: wrapperUtil.getCurrentPaths({ ...origProps, [c.CURRENT_PATH_NAME]: newCurrentPaths }, origProps?.[c.PATH_MODIFIERS_KEY]),
  }
  const { [c.V_COMP_NAME]: component } = props
  const ownProps = wrapperUtil.getRootWrapperProps(props, stock)
  // TODO isError
  useSelector(compSelectorHook(props[c.CURRENT_PATH_NAME] as PathModifiersType, ownProps.subscriberPaths as ReduxPathType[]), shallowEqual)
  if (!stock) {
    return null
  }
  const Comp: WrapperType = stock.getComponent(component) as WrapperType

  const infobox = false
  if (!Comp) {
    // eslint-disable-next-line no-throw-literal
    throw `The Component(${component}) is not available`
  }

  const newStyle = ownProps.style || ownProps[c.STYLE_WEB_NAME] ? getStyle(ownProps, component) : undefined

  return (
    <ErrorBoundary type="wrapper" id={props.id}>
      <ClassNames>
        {({ css, cx }) => {
          ownProps.className = newStyle ? cx(css(newStyle)) : undefined
          const newProps = wrapperUtil.removeTechnicalProps(ownProps)
          // children was {wrapperUtil.generateChildren(ownProps, stock)}
          return ownProps[c.PATH_MODIFIERS_KEY] ? (
            <PathModifierContext.Provider value={props[c.CURRENT_PATH_NAME] as any}>
              <Comp {...newProps} />
              {infobox && <InfoBox {...ownProps} />}
            </PathModifierContext.Provider>
          ) : (
            <>
              <Comp {...newProps} />
              {infobox && <InfoBox {...ownProps} />}
            </>
          )
        }}
      </ClassNames>
    </ErrorBoundary>
  )
}

export default Wrapper
