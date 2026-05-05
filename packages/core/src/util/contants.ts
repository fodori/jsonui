export const V_COMP = '$comp'
export const V_CHILDREN = '$children'
export const ACTION_KEY = '$action'
export const MODIFIER_KEY = '$modifier'
export const PATH_MODIFIERS_KEY = '$pathModifiers'
export const LIST_SEMAPHORE = '$isList'
export const LIST_ITEM = '$listItem'

/** Main JsonUI list pagination keys (parity). */
export const LIST_PAGE = '$page'
export const LIST_ITEM_PER_PAGE = '$itemPerPage'
export const LIST_LENGTH = '$listLength'

/** Main JsonUI nested locale blobs merged into the translation map. */
export const REF_LOCALES = '$locales'

/** Field-level inline validation spec key on a node. */
export const V_VALIDATIONS = '$validations'

// Store-name suffixes for parallel trees (errors, touch-state, etc.).
export const ERROR_STORE_SUFFIX = '.error'
/** Shadow store for field touched state (aligned with main JsonUI `.touch`). */
export const TOUCH_STORE_SUFFIX = '.touch'

export const JSON_SEPARATOR = '/'

// Single-root store layout helper.
// All logical stores live under `/storeRoot/{storeName}/...`.
export const STORE_ROOT_PATH = '/storeRoot'
