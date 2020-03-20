import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { NextPageContext } from 'next';
import fetch from 'isomorphic-unfetch';
import cookie from 'js-cookie';
import { Cookie } from 'next-cookie';

import firebase from '../lib/firebase';

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_URI, 
  credentials: 'same-origin',
  fetch,
});

export default function createApolloClient(
  initialState: NormalizedCacheObject,
  ctx?: NextPageContext
): ApolloClient<NormalizedCacheObject> {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  const authLink = setContext(async (_, { headers }) => {
    let token: string | undefined;

    if (ctx) {
      const nextCookie = new Cookie(ctx);
      token = nextCookie.get('token');
    } else {
      // Refresh the token on the client and update the cookie
      token = await firebase?.auth()?.currentUser?.getIdToken();
      if (token) {
        cookie.set('token', token);
      }
    }

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      }
    }
  });

  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState),
  });
}
