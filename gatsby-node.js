const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require('path');
const _ = require('lodash');

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // Sometimes, optional fields tend to get not picked up by the GraphQL
  // interpreter if not a single content uses it. Therefore, we're putting them
  // through `createNodeField` so that the fields still exist and GraphQL won't
  // trip up. An empty string is still required in replacement to `null`.
  if (node.internal.type === 'MarkdownRemark') {
    const { layout, primaryTag } = node.frontmatter;

    const value = createFilePath({ node, getNode });

    // Used to generate URL to view this content.
    createNodeField({
      node,
      name: 'slug',
      value,
    });

    // Used to determine a page layout.
    createNodeField({
      node,
      name: 'layout',
      value: layout || '',
    });

    createNodeField({
      node,
      name: 'primaryTag',
      value: primaryTag || '',
    });
  }
};

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  const typeDefs = [
    'type MarkdownRemark implements Node { frontmatter: Frontmatter }',
    schema.buildObjectType({
      name: 'Frontmatter',
      fields: {
        author: {
          type: 'AuthorYaml',
          resolve: (source, args, context) =>
            // If you were linking by ID, you could use `getNodeById` to
            // find the correct author:
            //
            // return context.nodeModel.getNodeById({
            //   id: source.author,
            //   type: "AuthorJson",
            // })
            //
            // But since here we are using the author name as foreign key,
            // you can use `nodeModel.findOne` to find the linked author node.
            // Note: Instead of getting all nodes and then using Array.prototype.find()
            // Use nodeModel.findOne instead where possible!
            context.nodeModel.findOne({
              type: 'AuthorYaml',
              query: {
                filter: { name: { eq: source.author } },
              },
            }),
        },
      },
    }),
  ];
  createTypes(typeDefs);
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMarkdownRemark(
        limit: 2000
        sort: { fields: [frontmatter___date], order: ASC }
        filter: { frontmatter: { draft: { ne: true } } }
      ) {
        edges {
          node {
            excerpt
            frontmatter {
              title
              tags
              date
              draft
              image {
                childImageSharp {
                  gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
                }
              }
              author {
                id
                bio
                avatar {
                  children {
                    ... on ImageSharp {
                      gatsbyImageData(quality: 90, layout: FULL_WIDTH)
                    }
                  }
                }
              }
            }
            fields {
              layout
              slug
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    console.error(result.errors);
    throw new Error(result.errors);
  }

  // Create post pages
  const posts = result.data.allMarkdownRemark.edges;
  posts.forEach(({ node }, index) => {
    const { slug, layout } = node.fields;
    const prev = index === 0 ? null : posts[index - 1].node;
    const next = index === posts.length - 1 ? null : posts[index + 1].node;

    createPage({
      path: slug,
      // This will automatically resolve the template to a corresponding
      // `layout` frontmatter in the Markdown.
      //
      // Feel free to set any `layout` as you'd like in the frontmatter, as
      // long as the corresponding template file exists in src/templates.
      // If no template is set, it will fall back to the default `post`
      // template.
      //
      // Note that the template has to exist first, or else the build will fail.
      component: path.resolve(`./src/templates/${layout || 'post'}.js`),
      context: {
        // Data passed to context is available in page queries as GraphQL variables.
        slug,
        prev,
        next,
        primaryTag: node.frontmatter.tags ? node.frontmatter.tags[0] : '',
      },
    });
  });

  // Create tag pages
  const tagTemplate = path.resolve('./src/templates/tags.js');
  const tags = _.uniq(
    _.flatten(
      result.data.allMarkdownRemark.edges.map((edge) =>
        _.castArray(_.get(edge, 'node.frontmatter.tags', [])),
      ),
    ),
  );
  tags.forEach((tag) => {
    createPage({
      path: `/tags/${_.kebabCase(tag)}/`,
      component: tagTemplate,
      context: {
        tag,
      },
    });
  });
};

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  // adds sourcemaps for tsx in dev mode
  if (stage === `develop` || stage === `develop-html`) {
    actions.setWebpackConfig({
      devtool: 'eval-source-map',
    });
  }
};
