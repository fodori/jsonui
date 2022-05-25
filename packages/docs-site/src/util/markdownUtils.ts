import React from 'react'

const flatten = (text: string, child: any): any => {
  return typeof child === 'string' ? text + child : React.Children.toArray(child.props.children).reduce(flatten, text)
}

/**
 * HeadingRenderer is a custom renderer
 * It parses the heading and attaches an id to it to be used as an anchor
 */
const HeadingRenderer = (props: any) => {
  const children = React.Children.toArray(props.children)
  const text = children.reduce(flatten, '')
  const slug = text.toLowerCase().replace(/\W/g, '-')
  return React.createElement(`h${props.level}`, { id: slug }, React.createElement(`a`, { name: slug }, props.children))
}

export default HeadingRenderer
