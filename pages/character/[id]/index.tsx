import Image from "next/image";
import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next";
import Header from "../../../components/Header";
import styles from "../../../styles/Character.module.css";
import client from "../../../apolloconfig/apollo";

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
  console.log("update", character);
  const router = useRouter();

  return (
    <div>
      <Header />
      <div className={styles.goBack__btn}>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
      <main className={styles.resident__container}>
        <section className={styles.resident__container__card}>
          <Image
            src={character.image}
            alt="character profile card"
            width={300}
            height={200}
          />
          <div className={styles.resident__container__card__information}>
            <h3>{character.name}</h3>
            <span>
              Status:{" "}
              <span
                className={
                  character.status === "Alive" ? styles.alive : styles.dead
                }
              >
                {character.status}
              </span>
            </span>
            <span>
              Species: <span>{character.species}</span>
            </span>
            <span>
              Gender: <span>{character.gender}</span>
            </span>
            <div className={styles.character__location__and__episode}>
              <span>Last Known Location: </span><span className={styles.location}>{character.location.name}</span>
              <span >First Seen in: </span><span className={styles.episode}>{character.episode[0].name}</span>
            </div>
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
          location {
            name
          }
          episode {
            name
          }
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
