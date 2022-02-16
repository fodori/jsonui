import React from 'react'
import { constants as c } from '@jsonui/core'

const styles = {
  label: {
    backgroundColor: '#ffffaa',
    borderColor: '#666666',
    borderStyle: 'dotted',
    borderWidth: 1,
    padding: 2,
    fontSize: 10,
    display: 'block',
  },
  labelCont: {
    // flex: 1,
    // flexDirection: 'column',
    position: 'relative',
    top: 0,
    right: 0,
    marginLeft: 10,
    padding: 4,
    display: 'block',
  },
}

const getName = (props: any) => {
  if (props && props[c.V_COMP_NAME]) {
    return props[c.V_COMP_NAME]
  }
  return 'Unknown'
}

export const getLabel = (props: any) => (
  <span style={styles.labelCont as React.CSSProperties}>
    <span style={styles.label}>{getName(props)}</span>
  </span>
)

export class InfoBox extends React.PureComponent {
  counter = 0

  constructor(props: any) {
    super(props)
    this.counter = 1
  }

  componentDidMount() {
    this.counter += 1
  }

  componentDidUpdate() {
    this.counter += 1
  }

  render() {
    const { id } = this.props as any
    const { filter } = this.props as any
    const component: string = (this.props as any)[c.V_COMP_NAME]
    if (!component || component === '_PrimitiveProp') {
      return null
    }
    if (filter && Array.isArray(filter) && Object.keys(filter).length !== 0 && !filter.includes(id)) {
      return null
    }
    // const { children, stock, parentComp, ...newProps } = this.props
    return (
      <span style={styles.labelCont as React.CSSProperties}>
        <span style={styles.label}>
          {/* {JSON.stringify(newProps).replace(/,/g, '\n')} */}
          rendered: {this.counter}
        </span>
      </span>
    )
  }
}
