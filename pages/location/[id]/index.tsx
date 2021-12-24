import { useRouter } from "next/router"
import {
    ApolloClient,
    InMemoryCache,
    gql
  } from "@apollo/client";

interface Props {
  residents: Props[]
}

const location = ({residents}: Props) => {
  const router = useRouter()
    return (
        <div>
            <h1>location</h1>
            <h3>Residents</h3>
        </div>
    )
}

export default location

export async function getStaticProps(context: any) {
  console.log('here', context.params.id)
    const client = new ApolloClient({
      uri: 'https://rickandmortyapi.com/graphql',
      cache: new InMemoryCache()
    })
  
    const { data } = await client.query({
      query: gql`
      query {
        locations {
          id
          results {
            residents {
              id
              name
              status
              species
            }
          }
        }
      }
      `
    })
  
    return {
      props: {
        residents: data.locations
      }
    }
  }
