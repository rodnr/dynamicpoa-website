import PropTypes from 'prop-types';
import React from "react";
import * as S from './styled';

const PostItem = ({ date, title, description, slug }) => (
    <div className='mt-4'>
        <S.PostLink to={slug}>
            <S.PostItemWrapper>
                <S.PostTitle>{title}</S.PostTitle>
                <S.PostDate>{date}</S.PostDate>
                <S.PostDescription>{description}</S.PostDescription>
            </S.PostItemWrapper>
        </S.PostLink>
    </div>
);

PostItem.propTypes = {
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
}

export default PostItem