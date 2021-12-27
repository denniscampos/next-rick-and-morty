import { GetStaticPaths, GetStaticProps } from "next";
import Locations from "../components/Locations";
import { NextPage } from "next";
import client from "../apolloconfig/apollo"
import { GET_ALL_LOCATIONS, GET_PAGE_INFO } from "../apolloconfig/queries";

interface Props {
  locations: Props[];
  id: number;
  name: string;
  type: string;
}

const Page: NextPage<Props> = ({ locations }) => {
  return <Locations locations={locations} id={0} name={""} type={""} />;
};

export default Page;

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query({ query: GET_PAGE_INFO})

  const numberOfPages = data.locations.info.pages + 1;
  const arrayOfPages = [...Array(numberOfPages).keys()];

  const paths = arrayOfPages.map((page) => ({
    params: { page: `${page}` },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params: { page },
}: any) => {

  const { data } = await client.query({
    query: GET_ALL_LOCATIONS,
    variables: { page: Number(page) },
  });

  return {
    props: {
      locations: data.locations.results,
    },
  };
};
