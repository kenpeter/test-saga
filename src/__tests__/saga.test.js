// Follow this tutorial: https://medium.com/@lucaspenzeymoog/mocking-api-requests-with-jest-452ca2a8c7d7
import SagaTester from 'redux-saga-tester';
import mockAxios from '../__mocks__/axios';
import reducer from '../reducer';
import {getItemsSaga} from '../saga';

const initialState = {
  reducer: {
    loading: true,
    items: []
  }
};

const options = {onError: console.error.bind(console)};

describe('Saga', () => {
  beforeEach(() => {
    mockAxios.get.mockImplementationOnce(() => Promise.resolve({key: 'val'}));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Showcases the tester API', async () => {
    const sagaTester = new SagaTester({
      initialState,
      reducers: {reducer: reducer},
      middlewares: [],
      options
    });

    sagaTester.start(getItemsSaga);

    sagaTester.dispatch({type: 'ITEMS_GET'});

    await sagaTester.waitFor('ITEMS_GET_SUCCESS');

    expect(sagaTester.getState()).toEqual({key: 'val'});
  });
});
