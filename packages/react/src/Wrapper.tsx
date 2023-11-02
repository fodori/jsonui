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
  const new1Props = wrapperUtil.normalisePrimitives(origProps)
  const newCurrentPaths = useContext(PathModifierContext)
  const props = {
    ...new1Props,
    currentPaths: newCurrentPaths,
    // eslint-disable-next-line react/destructuring-assignment
    ...wrapperUtil.pathModifierBuilder({ ...origProps, currentPaths: newCurrentPaths }, origProps?.[c.PATH_MODIFIERS_KEY]),
  }
  const { [c.V_COMP_NAME]: component, id, [c.PATH_MODIFIERS_KEY]: pathModifiers } = props
  const stock: InstanceType<typeof Stock> = useContext(StockContext)
  const { currentPaths, subscriberPaths, ...ownProps } = wrapperUtil.getRootWrapperProps(props, stock)
  // TODO isError
  useSelector(compSelectorHook(currentPaths as PathModifiersType, subscriberPaths as ReduxPathType[]), shallowEqual)
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
    <ErrorBoundary type="wrapper" id={id}>
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
            ...newProps
          } = ownProps
          // children was {wrapperUtil.generateChildren(ownProps, stock)}
          return pathModifiers ? (
            <PathModifierContext.Provider value={currentPaths as any}>
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

export const ChildWrapper = ({ props }: { props: any }) => {
  const stock: InstanceType<typeof Stock> = useContext(StockContext)
  return <>{wrapperUtil.generateNewChildren(props, stock)}</>
}
