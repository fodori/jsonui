/* eslint-disable import/no-extraneous-dependencies */
import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { createSerializer } from '@emotion/jest'

Enzyme.configure({ adapter: new Adapter() })

expect.addSnapshotSerializer(createSerializer())
