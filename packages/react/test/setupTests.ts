/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom'
import { createSerializer } from '@emotion/jest'

expect.addSnapshotSerializer(createSerializer())
