import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        lang
        title
        description
        twitter
      }
    }
  }
`;

const SEO = ({ lang, description, type, meta, keywords, title, image }) => (
  <StaticQuery
    query={detailsQuery}
    render={data => {
      const config = data.site.siteMetadata;
      const metaLang = lang || config.lang;
      const metaDescription = description || config.description;
      return (
        <Helmet
          htmlAttributes={{
            lang: metaLang,
          }}
          title={title}
          titleTemplate={`%s | ${config.title}`}
          meta={[
            {
              name: 'description',
              content: metaDescription,
            },
            {
              property: 'og:title',
              content: `${title} | ${config.title}`,
            },
            {
              property: 'og:description',
              content: metaDescription,
            },
            {
              property: 'og:type',
              content: type,
            },
            {
              property: 'og:site_name',
              content: config.title,
            },
            {
              property: 'og:image',
              content: image,
            },
            {
              name: 'twitter:card',
              content: 'summary',
            },
            {
              name: 'twitter:creator',
              content: config.twitter ? config.twitter : '',
            },
            {
              name: 'twitter:title',
              content: `${title} | ${config.title}`,
            },
            {
              name: 'twitter:image',
              content: image,
            },
            {
              name: 'twitter:description',
              content: metaDescription,
            },
          ]
            .concat(
              keywords.length > 0
                ? {
                    name: 'keywords',
                    content: keywords.join(', '),
                  }
                : [],
            )
            .concat(meta)}
        />
      );
    }}
  />
);

SEO.propTypes = {
  description: PropTypes.string,
  type: PropTypes.oneOf(['website', 'profile', 'article']),
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.string),
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
};

SEO.defaultProps = {
  description: '',
  type: 'website',
  lang: 'en',
  meta: [],
  keywords: [],
  image: '',
};

export default SEO;
