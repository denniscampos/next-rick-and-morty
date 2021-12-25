import Image from "next/image";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from 'next'

interface Props {
  character: any;
  id: number;
  name: string;
  image: string;
  status: string;
  species: string;
  gender: string;
}

interface Character {
  id: number;
}

const Character = ({ character }: Props) => {
  const router = useRouter();

  return (
    <div>
      <p>{character.name}</p>
      <p>{character.status}</p>
      <p>{character.species}</p>
      <p>{character.gender}</p>
      <Image src={character.image} width={300} height={200} />
    </div>
  );
};

export default Character;

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`https://rickandmortyapi.com/api/character`);
  const characters = await res.json();
  const paths = characters.results.map((character: Character) => ({
    params: { id: character.id.toString() },
  }));

  return { paths, fallback: "blocking" };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query {
        character(id: ${context.params?.id}) {
          id
          name
          status
          species
          gender
          image
        }
      }
      `,
  });
  return {
    props: {
      character: data.character,
    },
  };
}
