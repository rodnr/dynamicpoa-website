import { graphql } from "gatsby";
import React from "react";

import * as S from "../components/BlogList/styled";
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
            <S.BlogTitle>Blog</S.BlogTitle>
            <S.GridContainer>
                {postList.map(({ node: { frontmatter: { date, description, title, thumbnail }, fields: { slug } } }, i) => (
                    <PostItem
                        key={i}
                        slug={slug}
                        title={title}
                        date={date}
                        description={description}
                        thumbnail={thumbnail}
                    />
                ))}
            </S.GridContainer>
            <div className="mt-8">
                <Pagination
                    isFirst={currentPage === 1}
                    isLast={currentPage === numPages}
                    currentPage={currentPage}
                    numPages={numPages}
                    prevPage={currentPage - 1 === 1 ? '/blog' : `/blog/page/${currentPage - 1}`}
                    nextPage={`/blog/page/${currentPage + 1}`}
                />
            </div>
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
                    thumbnail
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