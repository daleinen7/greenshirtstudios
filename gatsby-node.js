const { default: slugify } = require('slugify');

exports.createPages = async function ({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      allContentfulBlogPost {
        nodes {
          title
          content {
            raw
          }
          author {
            name
            lastName
            slug
          }
          coverImage {
            gatsbyImageData
          }
          date
        }
      }
      allContentfulClass {
        nodes {
          contentful_id
          name
          slug
          type
          description {
            raw
          }
          coverImage {
            gatsbyImageData
          }
          cost
          instructors {
            slug
            name
            lastName
            bio {
              raw
            }
            profilePicture {
              gatsbyImageData(width: 637)
            }
          }
          alertBannerTitle
          alertBannerContent {
            raw
          }
          session
          day
          startTime
          endTime
          dates
          location
          isVirtual
          classSize
          age
          policies
          customAttendancePolicy {
            raw
          }
          customCancellationPolicy {
            raw
          }
          stripeProductId
          stripeInstallmentId
        }
      }
    }
  `);

  const existing_blogs = {};
  data.allContentfulBlogPost.nodes.forEach((node) => {
    const curr_slug = `/blogs/${slugify(node.title, {
      strict: true,
      lower: true,
    })}`;
    let new_slug = curr_slug;
    if (existing_blogs[curr_slug]) {
      const new_dupe_count = existing_blogs[curr_slug] + 1;
      new_slug = curr_slug + '-' + new_dupe_count;
      existing_blogs[curr_slug] = new_dupe_count;
    } else {
      existing_blogs[curr_slug] = 1;
    }
    actions.createPage({
      path: new_slug,
      component: require.resolve('./src/templates/blog.jsx'),
      context: node,
    });
  });

  data.allContentfulClass.nodes.forEach((node) => {
    actions.createPage({
      path: `/classes/${node.slug}`,
      component: require.resolve('./src/templates/class.jsx'),
      context: node,
    });
  });
};
