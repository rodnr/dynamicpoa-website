import PropTypes from 'prop-types';
import React from "react";
import * as S from './styled';

const RecommendedPosts = ({ next, previous }) => (
    <S.Container>
        {previous && (
            <S.LinkContainer to={previous.fields.slug}>
                <S.Arrow>&larr;</S.Arrow>
                {previous.frontmatter.title}
            </S.LinkContainer>
        )}
        {next && (
            <S.LinkContainer to={next.fields.slug}>
                {next.frontmatter.title}
                <S.Arrow right>&rarr;</S.Arrow>
            </S.LinkContainer>
        )}
    </S.Container>
);

RecommendedPosts.propTypes = {
    next: PropTypes.shape({
        frontmatter: PropTypes.shape({
            title: PropTypes.string.isRequired
        }),
        fields: PropTypes.shape({
            slug: PropTypes.string.isRequired
        }),
    }),
    previous: PropTypes.shape({
        frontmatter: PropTypes.shape({
            title: PropTypes.string.isRequired
        }),
        fields: PropTypes.shape({
            slug: PropTypes.string.isRequired
        }),
    })
}

export default RecommendedPosts