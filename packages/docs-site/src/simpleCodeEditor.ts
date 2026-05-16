import EditorImport from 'react-simple-code-editor'

/** Vite + CJS: default import may be `{ default: Editor }` instead of the component. */
const SimpleCodeEditor =
  typeof EditorImport === 'function'
    ? EditorImport
    : (EditorImport as { default: typeof EditorImport }).default

export default SimpleCodeEditor
