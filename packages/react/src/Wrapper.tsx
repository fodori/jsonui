import React, { useContext } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { ClassNames } from '@emotion/react'
import {
  constants as c,
  wrapperUtil,
  util,
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

const genStyle = (props: PropsType) => {
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

export const getStyleForWeb = (props: PropsType = {}, component: string) =>
  component === 'View' ? genStyle(props) : { ...(props.style as any), ...(props[c.STYLE_WEB_NAME] as any) }

export const getValue = (state: any, store: string, path: string) => util.jsonPointerGet(state[store], path) || null

function Wrapper({ props: origProps }: { props: any }) {
  const newCurrentPaths = useContext(PathModifierContext)
  const stock: InstanceType<typeof Stock> = useContext(StockContext)

  const props = {
    ...wrapperUtil.normalisePrimitives(origProps),
    currentPaths: wrapperUtil.getCurrentPaths({ ...origProps, currentPaths: newCurrentPaths }, origProps?.[c.PATH_MODIFIERS_KEY]),
  }
  const { [c.V_COMP_NAME]: component } = props
  const ownProps = wrapperUtil.getRootWrapperProps(props, stock)
  // TODO isError
  useSelector(compSelectorHook(props.currentPaths as PathModifiersType, ownProps.subscriberPaths as ReduxPathType[]), shallowEqual)
  if (!stock) {
    return null
  }
  const Comp: WrapperType = stock.getComponent(component) as WrapperType

  const infobox = false
  if (!Comp) {
    // eslint-disable-next-line no-throw-literal
    throw `The Component(${component}) is not available`
  }
  const newStyle = ownProps.style || ownProps[c.STYLE_WEB_NAME] ? getStyleForWeb(ownProps, component) : undefined
  return (
    <ErrorBoundary type="wrapper" id={props.id}>
      <ClassNames>
        {({ css, cx }) => {
          ownProps.className = newStyle ? cx(css(newStyle)) : undefined
          const {
            [c.PARENT_PROP_NAME]: parentComp,
            style,
            [c.STYLE_WEB_NAME]: _unused1,
            [c.V_COMP_NAME]: _unused2,
            // [c.V_CHILDREN_NAME]: _unused3,
            [c.PATH_MODIFIERS_KEY]: _unused4,
            currentPaths: _unused5,
            subscriberPaths: _unused6,
            [c.PATH_MODIFIERS_KEY]: _unused7,
            ...newProps
          } = ownProps
          // children was {wrapperUtil.generateChildren(ownProps, stock)}
          return ownProps[c.PATH_MODIFIERS_KEY] ? (
            <PathModifierContext.Provider value={props.currentPaths as any}>
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
