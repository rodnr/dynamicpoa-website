import { graphql } from "gatsby";
import React from "react";

import Layout from "../components/layout/Layout";
import Pagination from "../components/Pagination";
import PostItem from "../components/PostItem";
import SEO from "../components/seo";

const BlogList = (props) => {
    const postList = props.data.allMarkdownRemark.edges

    const { currentPage, numPages } = props.pageContext

    return (
        <Layout>
            <SEO title="Blog" />
            {postList.map(({ node: { frontmatter: { date, description, title }, fields: { slug } } }, i) => (
                <PostItem
                    key={i}
                    slug={slug}
                    title={title}
                    date={date}
                    description={description}
                />
            ))}
            <Pagination
                isFirst={currentPage === 1}
                isLast={currentPage === numPages}
                currentPage={currentPage}
                numPages={numPages}
                prevPage={currentPage - 1 === 1 ? '/blog' : `/blog/page/${currentPage - 1}`}
                nextPage={`/blog/page/${currentPage + 1}`}
            />
        </Layout>
    )
}

export const query = graphql`
query PostList($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
        sort: {fields: frontmatter___date, order: DESC}
        limit: $limit
        skip: $skip
        ) {
        edges {
            node {
                frontmatter {
                    date(locale: "pt-br", formatString: "DD [de] MMMM [de] YYYY")
                    description
                    title
                }
                fields {
                    slug
                }
            }
        }
    }
}
`

export default BlogList