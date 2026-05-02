import React from 'react'
import {
  resolveStorePath,
  V_COMP,
  V_CHILDREN,
  LIST_SEMAPHORE,
  LIST_ITEM,
  LIST_PAGE,
  LIST_ITEM_PER_PAGE,
  LIST_LENGTH,
  PATH_MODIFIERS_KEY,
  computeListSliceRange,
} from '@jsonui/core'
import type { JsonUINode, ActionMap, ModifierMap, TranslationsMap, Store, ValidationRegistry, ModifierContext } from '@jsonui/core'
import type { ComponentMap } from '../../componentMap.js'
import type { RenderNodeProps } from './types.js'
import { coercePrimitiveChild } from './coercePrimitiveChild.js'

export type NestedRenderNode = (props: RenderNodeProps) => React.ReactElement | null

type ListBranchNode = JsonUINode & {
  [LIST_SEMAPHORE]: boolean
  [LIST_ITEM]: JsonUINode
  [PATH_MODIFIERS_KEY]?: ModifierContext['pathModifiers']
}

export function computeRenderNodeSlotChildren(args: {
  node: JsonUINode
  resolvedSlots: Record<string, unknown> | undefined
  effectivePathModifiers?: ModifierContext['pathModifiers']
  pathModifiers?: ModifierContext['pathModifiers']
  currentPath: string
  store: Store
  components: ComponentMap
  modifiers: ModifierMap
  actions: ActionMap
  validators: ValidationRegistry | undefined
  translations: TranslationsMap | undefined
  defaultLanguage: string | undefined
  activeLanguage: string | undefined
  renderNested: NestedRenderNode
}): {
  mainChildren: React.ReactNode
  multiChildSlots: Record<string, React.ReactNode>
} {
  const {
    node,
    resolvedSlots,
    effectivePathModifiers,
    pathModifiers,
    currentPath,
    store,
    components,
    modifiers,
    actions,
    validators,
    translations,
    defaultLanguage,
    activeLanguage,
    renderNested,
  } = args

  const nestedPropsBase = {
    components,
    modifiers,
    actions,
    store,
    validators,
    translations,
    defaultLanguage,
    activeLanguage,
  }

  const nodeListConfig: ListBranchNode | null = LIST_SEMAPHORE in node && (node as Record<string, unknown>)[LIST_ITEM] ? (node as ListBranchNode) : null

  const listConfigForSlot = (slotKey: string, slotRaw: unknown): ListBranchNode | null => {
    const p = node as Record<string, unknown>
    if (slotKey === V_CHILDREN && LIST_SEMAPHORE in p && p[LIST_ITEM]) {
      return node as ListBranchNode
    }
    if (typeof slotRaw === 'object' && slotRaw !== null && LIST_SEMAPHORE in slotRaw) {
      return slotRaw as ListBranchNode
    }
    return null
  }

  const renderListFromConfig = (listConfig: ListBranchNode): React.ReactNode => {
    const listItem = listConfig[LIST_ITEM]
    const listPathModifiers = listConfig[PATH_MODIFIERS_KEY]

    const effKeys = effectivePathModifiers !== undefined ? Object.keys(effectivePathModifiers) : []
    const listPm = listPathModifiers ?? {}
    const storeName = effKeys.find((k) => Object.prototype.hasOwnProperty.call(listPm, k)) ?? Object.keys(listPm)[0]

    const baseListPath =
      storeName && effectivePathModifiers?.[storeName]
        ? effectivePathModifiers[storeName].path
        : storeName && listPathModifiers?.[storeName]?.path
          ? resolveStorePath(listPathModifiers[storeName].path, currentPath, pathModifiers, storeName)
          : undefined
    const listPath = baseListPath
    const root = store
    const listData = storeName && listPath != null && listPath !== '' ? (root.getForStore(storeName, listPath) as unknown[]) : []

    if (!Array.isArray(listData)) return null

    const listCfgRaw = listConfig as Record<string, unknown>
    const { indices } = computeListSliceRange({
      listDataLength: listData.length,
      page: listCfgRaw[LIST_PAGE],
      itemPerPage: listCfgRaw[LIST_ITEM_PER_PAGE],
      listLength: listCfgRaw[LIST_LENGTH],
    })

    return indices.map((i) => {
      const itemPath = listPath ? `${listPath}/${i}` : `/${i}`
      const itemPathModifiers =
        storeName && listPath
          ? {
              ...(effectivePathModifiers ?? {}),
              [storeName]: { path: `${listPath}/${i}` },
            }
          : effectivePathModifiers
      return (
        <React.Fragment key={i}>
          {renderNested({
            node: listItem,
            ...nestedPropsBase,
            currentPath: itemPath,
            pathModifiers: itemPathModifiers,
          })}
        </React.Fragment>
      )
    })
  }

  const renderPlainSlotContent = (raw: unknown, resolvedVal: unknown): React.ReactNode => {
    if (Array.isArray(raw)) {
      const resolvedArr = resolvedVal as unknown[] | undefined
      return raw.map((child, i) => <React.Fragment key={i}>{renderPlainSlotContent(child, resolvedArr?.[i])}</React.Fragment>)
    }

    if (raw && typeof raw === 'object' && V_COMP in raw) {
      return renderNested({
        node: raw as JsonUINode,
        ...nestedPropsBase,
        currentPath,
        pathModifiers: effectivePathModifiers,
      })
    }

    const val = resolvedVal !== undefined ? resolvedVal : raw

    if (Array.isArray(val)) {
      return val.map((child, i) =>
        typeof child === 'object' && child !== null && V_COMP in (child as object) ? (
          <React.Fragment key={i}>
            {renderNested({
              node: child as JsonUINode,
              ...nestedPropsBase,
              currentPath,
              pathModifiers: effectivePathModifiers,
            })}
          </React.Fragment>
        ) : (
          coercePrimitiveChild(child)
        )
      ) as React.ReactNode
    }
    if (typeof val === 'object' && val !== null && V_COMP in val) {
      return renderNested({
        node: val as JsonUINode,
        ...nestedPropsBase,
        currentPath,
        pathModifiers: effectivePathModifiers,
      })
    }
    return coercePrimitiveChild(val)
  }

  let mainChildren: React.ReactNode = nodeListConfig ? renderListFromConfig(nodeListConfig) : null
  const multiChildSlots: Record<string, React.ReactNode> = {}
  const slotsResolved = resolvedSlots ?? {}

  for (const [key, value] of Object.entries(node)) {
    if (!key.startsWith('$child')) continue

    const resolved = slotsResolved[key]
    const listCfg = listConfigForSlot(key, value)

    let slotChildren: React.ReactNode = null
    if (listCfg) {
      slotChildren = renderListFromConfig(listCfg)
    } else if (value !== undefined) {
      if (Array.isArray(value)) {
        const resolvedArr = resolved as unknown[] | undefined
        slotChildren = value.map((child, i) => <React.Fragment key={i}>{renderPlainSlotContent(child, resolvedArr?.[i])}</React.Fragment>)
      } else {
        slotChildren = renderPlainSlotContent(value, resolved)
      }
    }

    if (key === V_CHILDREN) {
      if (!nodeListConfig) {
        mainChildren = slotChildren
      }
    } else {
      multiChildSlots[key.slice(1)] = slotChildren
    }
  }

  return { mainChildren, multiChildSlots }
}
