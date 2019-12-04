// Follow this tutorial: https://medium.com/@lucaspenzeymoog/mocking-api-requests-with-jest-452ca2a8c7d7
import moxios from 'moxios';
import SagaTester from 'redux-saga-tester';
// we need this fake axios
import http from './__mocks__/axios';
import reducer from './reducer';
import {getItemsSaga} from './saga';

/*
// this is our soruce code
const fetchUserPosts = async id => {
  // but we start to use fake axios???????
  const reponse = await http.get(`/users/${id}/posts`);
  return reponse.data;
};
*/

// init state
const initialState = {
  reducer: {
    loading: true,
    items: []
  }
};

// options
const options = {onError: console.error.bind(console)};

describe('Saga', () => {
  // fake http
  beforeEach(() => {
    moxios.install(http);
  });

  // fake http
  afterEach(() => {
    moxios.uninstall(http);
  });

  it('test http', async () => {
    const sagaTester = new SagaTester({
      initialState,
      reducers: {reducer: reducer},
      middlewares: [],
      options
    });

    // test saga
    sagaTester.start(getItemsSaga);

    // start change state
    sagaTester.dispatch({type: 'ITEMS_GET'});

    // expect
    const expectedPosts = ['Post1', 'Post2'];

    // real change state
    moxios.wait(() => {
      // api got result
      const request = moxios.requests.mostRecent();
      // real change state
      request.respondWith({status: 200, response: expectedPosts}); //mocked response
    });

    // state stable
    await sagaTester.waitFor('ITEMS_GET_SUCCESS');

    // compare
    expect(sagaTester.getState()).toEqual({
      reducer: {
        loading: false,
        items: ['Post1', 'Post2']
      }
    });

    // We can see that func got overwritten as well
    //const result = await fetchUserPosts(1);
    //console.log(result); // ['Post1','Post2']
    //expect(result).toEqual(expectedPosts);
  });
});
