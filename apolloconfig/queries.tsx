import { gql } from "@apollo/client";

const GET_ALL_LOCATIONS = gql`
  query Query($page: Int) {
    locations(page: $page) {
      results {
        id
        name
        type
      }
    }
  }
`;

const GET_PAGE_INFO = gql`
  query {
    locations {
      info {
        next
        prev
        pages
      }
    }
  }
`;

export { GET_ALL_LOCATIONS, GET_PAGE_INFO };
