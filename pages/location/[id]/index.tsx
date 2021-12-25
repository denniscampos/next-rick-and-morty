import Image from "next/image";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

interface Props {
  residents: Props[];
  name: string;
  image: string;
  status: string;
  species: string;
  gender: string;
  id: number;
}

interface Context {
  params: {
    id: number;
  };
}

interface Locations {
  id: number;
}

const location = ({ residents }: Props) => {
  return (
    <div>
      <h1>location</h1>
      <h3>Residents</h3>
      {residents.map((resident) => (
        <Link href={`/character/${resident.id}`} key={resident.id}>
          <a>
            <div>
              <h3>{resident.name}</h3>
              <span>{resident.status}</span>
              <span>{resident.species}</span>
              <span>{resident.gender}</span>
              <Image src={resident.image} width={300} height={200} />
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default location;

export async function getStaticPaths() {
  const res = await fetch(`https://rickandmortyapi.com/api/location`);

  const locations = await res.json();
  const paths = locations.results.map((location: Locations) => ({
    params: { id: location.id.toString() },
  }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps(context: Context) {
  const client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql",
    cache: new InMemoryCache(),
  });

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
            species
            gender
          }
        }
      }
      `,
  });

  return {
    props: {
      residents: data.location.residents,
    },
  };
}
