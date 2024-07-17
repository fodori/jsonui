import Ajv, { ErrorObject, JSONSchemaType } from 'ajv'
import jsonpointer from 'jsonpointer'
import ajvErrors from 'ajv-errors'
import ajvFormats from 'ajv-formats'
import * as c from '../utils/constants'

const pathConverter = (path: string) => path.replace(/\./g, c.SEPARATOR)

export const errorConverter = (errors: ErrorObject<string, Record<string, any>, unknown>[] | null | undefined) => {
  const res = {}
  // convert error and add as an array item to the particular property
  if (errors) {
    errors.forEach((i) => {
      if (i.keyword === 'required') {
        // because it's not parent error, need to move that level
        jsonpointer.set(res, `${pathConverter(`${i.instancePath}.${i.params.missingProperty}`)}/-`, i.message)
      } else if (i.keyword === 'errorMessage' && i?.params?.errors?.[0]?.keyword === 'required') {
        jsonpointer.set(res, `${pathConverter(`${i.instancePath}.${i?.params?.errors?.[0]?.params.missingProperty}`)}/-`, i.message)
      } else {
        jsonpointer.set(res, `${pathConverter(i.instancePath)}/-`, i.message)
      }
    })
  }
  // TODO: if it's a root level validation, looks like : {-: 'should be email'} should be converted
  return res && (res as any)['-'] ? (res as any)['-'] : res
}

export const validateJSON = (schema: any, data: any) => {
  const ajv = new Ajv({ allErrors: true })
  ajvErrors(ajv)
  ajvFormats(ajv)
  const validate = ajv.compile(schema as JSONSchemaType<any>)
  const valid = validate(data)
  return {
    valid: validate(data),
    error: valid ? null : errorConverter(validate.errors),
  }
}

export const validateJSONAndStore = (schema: any, store: string, data: any) => {
  const { valid, error } = validateJSON(schema, data)
  return {
    store: `${store}${c.STORE_ERROR_POSTFIX}`,
    valid,
    value: error,
  }
}
