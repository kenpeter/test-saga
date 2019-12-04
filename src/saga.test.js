import SagaTester from 'redux-saga-tester';
import moxios from 'moxios';
import sinon from 'sinon';
import axios from 'axios';
import {equal} from 'assert';
import reducer from './reducer';
import {getItemsSaga} from './saga';

const initialState = {
  reducer: {
    loading: true,
    items: []
  }
};

const options = {onError: console.error.bind(console)};

describe('Saga', () => {
  beforeEach(function() {
    // import and pass your custom axios instance to this method
    moxios.install();
  });

  afterEach(function() {
    // import and pass your custom axios instance to this method
    moxios.uninstall();
  });

  it('Showcases the tester API', done => {
    moxios.withMock(() => {
      console.log('hi---');
      axios.get('/testme');

      moxios.wait(() => {
        console.log('hi---in');
        const request = moxios.requests.mostRecent();
        request
          .respondWith({
            status: 200,
            response: {}
          })
          .then(async () => {
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

            done();
          })
          .catch(done);
      });
    });
  });
});
