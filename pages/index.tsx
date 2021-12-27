import type { NextPage } from "next";
import { GetStaticProps } from "next";
import Locations from "../components/Locations";
import client from "../apolloconfig/apollo"
import { GET_ALL_LOCATIONS } from "../apolloconfig/queries";

interface Props {
  locations: Props[];
  id: number;
  name: string;
  type: string;
}

const Home: NextPage<Props> = ({ locations }) => {
  return <Locations locations={locations} id={0} name={""} type={""} />;
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await client.query({query: GET_ALL_LOCATIONS})

  return {
    props: {
      locations: data.locations.results,
    },
  };
};
