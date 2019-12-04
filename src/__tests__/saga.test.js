// Follow this tutorial: https://medium.com/@lucaspenzeymoog/mocking-api-requests-with-jest-452ca2a8c7d7
import moxios from 'moxios';
import SagaTester from 'redux-saga-tester';
import http from '../__mocks__/axios';
import reducer from '../reducer';
import {getItemsSaga} from '../saga';

const fetchUserPosts = async id => {
  const reponse = await http.get(`/users/${id}/posts`);
  return reponse.data;
};

const initialState = {
  reducer: {
    loading: true,
    items: []
  }
};

const options = {onError: console.error.bind(console)};

describe('Saga', () => {
  beforeEach(() => {
    moxios.install(http);
  });

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

    // start
    sagaTester.start(getItemsSaga);

    // fire
    sagaTester.dispatch({type: 'ITEMS_GET'});

    // exect
    const expectedPosts = ['Post1', 'Post2'];

    // wait done
    moxios.wait(() => {
      // api got result
      const request = moxios.requests.mostRecent();
      // gets response, and assign to state
      request.respondWith({status: 200, response: expectedPosts}); //mocked response
    });

    // Next thing, not callback style
    // state is done
    await sagaTester.waitFor('ITEMS_GET_SUCCESS');
    // now check state
    expect(sagaTester.getState()).toEqual({
      reducer: {
        loading: true,
        items: ['Post1', 'Post2']
      }
    });

    // We can see that func got overwritten as well
    //const result = await fetchUserPosts(1);
    //console.log(result); // ['Post1','Post2']
    //expect(result).toEqual(expectedPosts);
  });
});
