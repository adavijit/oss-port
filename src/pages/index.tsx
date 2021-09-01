import { graphql } from "gatsby";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import algoliasearch from "algoliasearch/lite";
import ProjectSearchInput from "../components/search/ProjectSearchInput";
import { InstantSearch } from "react-instantsearch-dom";
import ProjectSearchResults from "../components/search/ProjectSearchResults";
import Tag from "../components/Tag";
import FilterByTag from "../components/search/FilterByTag";

// TODO disable the search if the env vars are missing
const searchClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID,
  process.env.GATSBY_ALGOLIA_API_KEY
);

const indexName = process.env.GATSBY_ALGOLIA_INDEX_NAME;

const IndexPage = ({ data: { allMarkdownRemark } }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="max-w-5xl mx-auto py-12">
      <Helmet title="OSS Port" />
      <h1 className="text-black-500 font-bold text-4xl text-center mb-4">
        Explore open source communities
      </h1>
      <h2 className="text-black-300 text-xl text-center mb-6">
        Onboard and contribute to your next project with ease
      </h2>
      <InstantSearch
        searchClient={searchClient}
        indexName={indexName}
        onSearchStateChange={({ query }) => setSearchQuery(query)}
      >
        <ProjectSearchInput />
        <FilterByTag attribute="frontmatter.tags" />
        <ProjectSearchResults defaultProjects={allMarkdownRemark.nodes} />
      </InstantSearch>
    </main>
  );
};

export const pageQuery = graphql`
  query ProjectList {
    allMarkdownRemark {
      # Get a list of all the tags
      allTags: group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
      # Get a list of all the projects
      nodes {
        id
        frontmatter {
          name
          tags
          repoUrl
          avatar {
            publicURL
          }
        }
        fields {
          slug
        }
      }
    }
  }
`;

export default IndexPage;
