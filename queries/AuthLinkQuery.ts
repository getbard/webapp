import gql from 'graphql-tag';

const AuthLinkQuery = gql`
  query authLink($type: AuthLink!, $email: String!) {
    authLink(type: $type, email: $email)
  }
`;

export default AuthLinkQuery;
