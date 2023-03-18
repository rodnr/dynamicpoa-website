import { graphql } from "gatsby";
import React from "react";

import Layout from "../components/layout/Layout";
import * as S from "../components/Post/styled";
import RecommendedPosts from "../components/RecommendedPosts";
import SEO from "../components/seo";

const BlogPost = ({ data, pageContext }) => {
    const post = data.markdownRemark
    const next = pageContext.nextPost
    const previous = pageContext.previousPost

    return (
        <Layout>
            <SEO title={post.frontmatter.title} />
            <S.PostHeader>
                <S.PostDate>
                    {post.frontmatter.date}
                </S.PostDate>
                <S.PostTitle>{post.frontmatter.title}</S.PostTitle>
                <S.PostDescription>{post.frontmatter.description}</S.PostDescription>
            </S.PostHeader>
            <S.MainContent>
                <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
            </S.MainContent>
            <RecommendedPosts next={next} previous={previous} />
        </Layout>
    )
}

export const query = graphql`
    query MyQuery($slug: String!) {
        markdownRemark(fields: {slug: {eq: $slug}}) {
            frontmatter {
                title
                description
                date(locale: "pt-br", formatString: "DD [de] MMMM [de] YYYY")
            }
            html
        }
  }
`

export default BlogPost