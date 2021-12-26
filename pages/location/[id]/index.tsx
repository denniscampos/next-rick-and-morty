import Image from "next/image";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { GetStaticProps, GetStaticPaths } from "next";
import Header from "../../../components/Header";
import styles from "../../../styles/Location.module.css";

interface Props {
  residents: Props[];
  name: string;
  image: string;
  status: string;
  species: string;
  gender: string;
  id: number;
}

interface Locations {
  id: number;
}

const location = ({ residents }: Props) => {
  return (
    <div>
      <Header />
      <main className={styles.resident__container}>
        {residents.map((resident) => (
          <Link href={`/character/${resident.id}`} key={resident.id}>
            <a>
              <section className={styles.resident__container__card}>
                <Image src={resident.image} width={300} height={200} />
                <div className={styles.resident__container__card__information}>
                <h3>{resident.name}</h3>
                  <span>{resident.status}</span>
                  <span>{resident.species}</span>
                  <span>{resident.gender}</span>
                </div>
              </section>
            </a>
          </Link>
        ))}
      </main>
    </div>
  );
};

export default location;

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`https://rickandmortyapi.com/api/location`);

  const locations = await res.json();
  const paths = locations.results.map((location: Locations) => ({
    params: { id: location.id.toString() },
  }));
  return { paths, fallback: "blocking" };
};

// export async function getStaticProps(context: Context) {
export const getStaticProps: GetStaticProps = async (context) => {
  const client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query {
        location(id: ${context.params?.id}) {
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
};
