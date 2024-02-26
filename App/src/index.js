import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import {ApolloClient, InMemoryCache, ApolloProvider, gql, HttpLink, ApolloLink} from '@apollo/client'
import cookies from "./utlis/cookie"
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { GlobalStateProvider } from './GlobalStateContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = cookies.get('accessToken');
  operation.setContext({
    headers: {
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  });
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(new createUploadLink({ uri: 'https://site222344.tw.cs.unibo.it/graphql' })),
  cache: new InMemoryCache(),
})

function ApolloClientAuth(){
  return(
    <ApolloProvider client={client}>
      <React.StrictMode>
        <BrowserRouter basename='/app'> 
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </ApolloProvider>
  )
}
root.render(  
  <GlobalStateProvider>
    <ApolloClientAuth />
  </GlobalStateProvider>
);

reportWebVitals();
