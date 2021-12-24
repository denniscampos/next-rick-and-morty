import Image from "next/image"
import {
    ApolloClient,
    InMemoryCache,
    gql
  } from "@apollo/client";

interface Props {
  residents: Props[]
  name: string,
  image: string
}

interface Context {
  params: {
    id: number
  }
}

interface Locations {
  id: number,
}

const location = ({residents}: Props) => {
    return (
        <div>
            <h1>location</h1>
            <h3>Residents</h3>
            {residents.map((resident, i) => (
              <div key={i}>
                <p>{resident.name}</p>
                <Image src={resident.image} width={300} height={200}/>
              </div>
            ))}
        </div>
    )
}

export default location

export async function getStaticPaths() {
  const res = await fetch(`https://rickandmortyapi.com/api/location`)

  const locations = await res.json()
  const paths = locations.results.map((location: Locations) => ({params: { id: location.id.toString() }}))
  console.log('check params', paths)
  return {paths, fallback: false}
}


export async function getStaticProps(context: Context) {
    const client = new ApolloClient({
      uri: 'https://rickandmortyapi.com/graphql',
      cache: new InMemoryCache()
    })
  
    const { data } = await client.query({
      query: gql`
      query {
        location(id: ${context.params.id}) {
          id
          name
          type
          residents {
            id
            name
            status
            image
          }
        }
      }
      `
    })
  
    return {
      props: {
        residents: data.location.residents
      }
    }
  }
