import {all, call, put, takeEvery} from 'redux-saga/effects';
import axios from 'axios';

async function myfetch(endpoint) {
  const out = await axios.get(endpoint);
  return out.data;
}

function* getItems() {
  //const endpoint = 'https://jsonplaceholder.typicode.com/todos/1';
  const endpoint = 'http://testme.com/testme';
  const response = yield call(myfetch, endpoint);
  const items = response;

  //test
  console.log('items', items);

  yield put({type: 'ITEMS_GET_SUCCESS', items: items});
}

export function* getItemsSaga() {
  yield takeEvery('ITEMS_GET', getItems);
}

export default function* rootSaga() {
  yield all([getItemsSaga()]);
}
