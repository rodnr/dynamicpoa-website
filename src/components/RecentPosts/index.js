import { graphql, Link, useStaticQuery } from "gatsby";
import React from "react";
import Button from "../Button";
import PostItem from "../PostItem";
import * as S from "./styled";

const RecentPosts = () => {

    const data = useStaticQuery(graphql`
        query RecentPosts {
            allMarkdownRemark(
                sort: {fields: frontmatter___date, order: DESC}
                limit: 3
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
    `)
    console.log(data)
    const postList = data.allMarkdownRemark.edges

    return (
        <S.RecentContainer>
            <S.RecentTitle>Posts recentes</S.RecentTitle>
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
            <Link to="/blog">
                <Button>Blog</Button>
            </Link>
        </S.RecentContainer>
    )
}

export default RecentPosts