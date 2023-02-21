import { DeepPartial } from 'redux';
import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema';
import { getCounter } from './getCounter';

describe('getCounter', () => {
    test('should return counter', () => {
        const state: DeepPartial<StateSchema> = {
            counter: {
                value: 10,
            },
        };
        expect(getCounter(state as StateSchema)).toEqual({ value: 10 });
    });
});