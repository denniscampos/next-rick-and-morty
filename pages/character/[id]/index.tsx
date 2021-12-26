import Image from "next/image";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import Header from "../../../components/Header";
import styles from "../../../styles/Character.module.css";

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
      <Header />
      <main className={styles.resident__container}>
        <section className={styles.resident__container__card}>
        <Image src={character.image} width={300} height={200} />
        <div className={styles.resident__container__card__information}>
          <h3>{character.name}</h3>
          <span>{character.status}</span>
          <span>{character.species}</span>
          <span>{character.gender}</span>
        </div>
        </section>
      </main>
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
};

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
};
