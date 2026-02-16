import React, { useContext, useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { ClassNames } from '@emotion/react'
import { constants as c, wrapperUtil, StockContext, PathModifierContext, Stock, PropsType, compSelectorHook, PathModifiersType, ReduxPath } from '@jsonui/core'
import { cloneDeep } from 'lodash'
import { InfoBox } from './stock/components/Label'
import ErrorBoundary from './ErrorBoundary'
import * as wrapperUtilAsync from '@jsonui/core/src/wrapper/wrapperUtilAsync'

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

interface AsyncWrapperState {
  isLoading: boolean
  props: PropsType | null
  error: Error | null
}

function WrapperAsync({ props: origProps }: { props: any }) {
  const newCurrentPaths = useContext(PathModifierContext as any)
  const stock: InstanceType<typeof Stock> = useContext(StockContext as any)

  const [asyncState, setAsyncState] = useState<AsyncWrapperState>({
    isLoading: false,
    props: null,
    error: null,
  })

  const baseProps = cloneDeep({
    ...wrapperUtil.normalisePrimitives(origProps),
    [c.CURRENT_PATH_NAME]: wrapperUtil.getCurrentPaths({ ...origProps, [c.CURRENT_PATH_NAME]: newCurrentPaths }, origProps?.[c.PATH_MODIFIERS_KEY]),
  })

  useEffect(() => {
    const processAsync = async () => {
      try {
        if (wrapperUtilAsync.hasAsyncModifiers(baseProps, stock)) {
          setAsyncState((prev) => ({ ...prev, isLoading: true, error: null }))

          const processedProps = cloneDeep(baseProps)
          await wrapperUtilAsync.getRootWrapperPropsAsync(processedProps, stock)

          setAsyncState({
            isLoading: false,
            props: processedProps,
            error: null,
          })
        } else {
          // Fallback to sync processing
          const processedProps = cloneDeep(baseProps)
          wrapperUtil.getRootWrapperProps(processedProps, stock)
          setAsyncState({
            isLoading: false,
            props: processedProps,
            error: null,
          })
        }
      } catch (error) {
        setAsyncState({
          isLoading: false,
          props: null,
          error: error instanceof Error ? error : new Error('Unknown error'),
        })
      }
    }

    processAsync()
  }, [origProps, stock])

  const props = asyncState.props || baseProps
  const { [c.V_COMP_NAME]: component } = props

  // Use selector for reactive updates
  useSelector(compSelectorHook(props[c.CURRENT_PATH_NAME] as PathModifiersType, props[c.REDUX_GET_SUBSCRIBERS_NAME] as ReduxPath[]), shallowEqual)

  if (!stock) {
    return null
  }

  if (asyncState.error) {
    return <div style={{ color: 'red', padding: '10px' }}>Error loading component: {asyncState.error.message}</div>
  }

  if (asyncState.isLoading) {
    return <div style={{ padding: '10px', opacity: 0.6 }}>Loading...</div>
  }

  const Comp: React.ElementType = stock.getComponent(component) as unknown as React.ElementType

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

export default WrapperAsync
