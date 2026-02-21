import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { fetchGraphQL } from './fetchGraphQL';

function createRelayNetwork() {
  return Network.create((request, variables) => {
    const text = request.text;
    if (text == null) {
      return Promise.reject(new Error('GraphQL request has no text'));
    }
    return fetchGraphQL(text, variables);
  });
}

const store = new Store(RecordSource.create());
const network = createRelayNetwork();

export const relayEnvironment = new Environment({
  network,
  store,
});
