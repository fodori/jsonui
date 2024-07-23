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
  ReduxPath,
} from '@jsonui/core'
import { cloneDeep } from 'lodash'
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

  const props = cloneDeep({
    // TODO replace cloneDeep to a fastest one
    ...wrapperUtil.normalisePrimitives(origProps),
    [c.CURRENT_PATH_NAME]: wrapperUtil.getCurrentPaths({ ...origProps, [c.CURRENT_PATH_NAME]: newCurrentPaths }, origProps?.[c.PATH_MODIFIERS_KEY]),
  })
  const { [c.V_COMP_NAME]: component } = props
  wrapperUtil.getRootWrapperProps(props, stock)
  useSelector(compSelectorHook(props[c.CURRENT_PATH_NAME] as PathModifiersType, props[c.REDUX_GET_SUBSCRIBERS_NAME] as ReduxPath[]), shallowEqual)
  if (!stock) {
    return null
  }
  const Comp: WrapperType = stock.getComponent(component) as WrapperType

  const infobox = false
  if (!Comp) {
    // eslint-disable-next-line no-throw-literal
    throw `The Component(${component}) is not available`
  }

  const newStyle = props.style || props[c.STYLE_WEB_NAME] ? getStyle(props, component) : undefined

  return (
    <ErrorBoundary type="wrapper" id={props.id}>
      <ClassNames>
        {({ css, cx }) => {
          props.className = newStyle ? cx(css(newStyle)) : undefined
          const newProps = Object.keys(props).reduce((newObj, childName) => {
            // eslint-disable-next-line no-param-reassign
            if (wrapperUtil.isChildrenProp(childName)) {
              const res = component === c.PRIMITIVE_COMP_NAME ? props[childName] : wrapperUtil.generateNewChildren(props[childName] as any, stock)
              // eslint-disable-next-line no-param-reassign
              if (childName === c.V_CHILDREN_NAME) {
                // eslint-disable-next-line no-param-reassign
                newObj.children = res
              } else {
                // eslint-disable-next-line no-param-reassign
                newObj[childName] = res
              }
            } else if (!wrapperUtil.isTechnicalProp(childName)) {
              // eslint-disable-next-line no-param-reassign
              newObj[childName] = props[childName]
            }

            return newObj
          }, {} as any)
          // children was {wrapperUtil.generateChildren(ownProps, stock)}
          return props[c.PATH_MODIFIERS_KEY] ? (
            <PathModifierContext.Provider value={props[c.CURRENT_PATH_NAME] as any}>
              <Comp {...newProps} />
              {infobox && <InfoBox {...props} />}
            </PathModifierContext.Provider>
          ) : (
            <>
              <Comp {...newProps} />
              {infobox && <InfoBox {...props} />}
            </>
          )
        }}
      </ClassNames>
    </ErrorBoundary>
  )
}

export default Wrapper
