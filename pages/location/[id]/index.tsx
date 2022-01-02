import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import { GetStaticProps, GetStaticPaths } from "next";
import Header from "../../../components/Header";
import styles from "../../../styles/Location.module.css";
import client from "../../../apolloconfig/apollo";

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

const Location = ({ residents }: Props) => {
  const [search, setSearch] = useState("");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  return (
    <div>
      <Header />
      <div className={styles.goBack__btn}>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
      <div className={styles.search__character}>
        <input
          type="text"
          placeholder="Search Character..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <main className={styles.resident__container}>
        {residents
          .filter((resident) => {
            const fullName = `${resident.name}`;
            if (search === "") return resident;
            else if (fullName.toLowerCase().includes(search.toLowerCase()))
              return resident;
          })
          .map((resident) => (
            <Link href={`/character/${resident.id}`} key={resident.id}>
              <a>
                <section className={styles.resident__container__card}>
                  <Image
                    src={resident.image}
                    alt="character profile card"
                    width={300}
                    height={200}
                  />
                  <div
                    className={styles.resident__container__card__information}
                  >
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

export default Location;

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`https://rickandmortyapi.com/api/location`);

  const locations = await res.json();
  const paths = locations.results.map((location: Locations) => ({
    params: { id: location.id.toString() },
  }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (context) => {
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
