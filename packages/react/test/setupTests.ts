/* eslint-disable import/no-extraneous-dependencies */
import Enzyme from 'enzyme'
import { createSerializer } from '@emotion/jest'

// Enzyme.configure({ adapter: new Adapter() })

expect.addSnapshotSerializer(createSerializer())
