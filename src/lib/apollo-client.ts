import { ApolloClient, InMemoryCache, HttpLink, DefaultOptions } from "@apollo/client"

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
}

const apolloClient = new ApolloClient({
  defaultOptions,
  ssrMode: false,
  ssrForceFetchDelay: 100,
  link: new HttpLink({
    // Use Next.js API route as proxy to avoid CORS/TLS issues
    uri: "/api/graphql",
  }),
  cache: new InMemoryCache(),
})

export default apolloClient
