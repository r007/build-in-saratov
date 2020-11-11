const pageQuery = `{
  pages: allMarkdownRemark(
    filter: { frontmatter: { draft: { ne: true } } }
  ) {
    edges {
      node {
        objectID: id
        excerpt(pruneLength: 5000)
        frontmatter {
          title
          tags
        }
        fields {
          slug
        }
      }
    }
  }
}`;

const postQuery = `{
  posts: allMarkdownRemark(filter: {frontmatter: {draft: {ne: true}}}) {
    edges {
      node {
        objectID: id
        frontmatter {
          title
          date(formatString: "MMM D, YYYY")
          tags
        }
        excerpt(pruneLength: 5000)
        fields {
          slug
        }
      }
    }
  }
}`;
const flatten = (arr) =>
  arr.map(({ node: { frontmatter, ...rest } }) => ({
    ...frontmatter,
    ...rest,
  }));
const settings = { attributesToSnippet: [`excerpt:20`] };
const queries = [
  {
    query: pageQuery,
    transformer: ({ data }) => flatten(data.pages.edges),
    indexName: `Pages`,
    settings,
  },
  {
    query: postQuery,
    transformer: ({ data }) => flatten(data.posts.edges),
    indexName: `Posts`,
    settings,
  },
];
module.exports = queries;
