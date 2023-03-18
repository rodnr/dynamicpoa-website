import { Link } from "gatsby";
import PropTypes from 'prop-types';
import React from "react";

const RecommendedPosts = ({ next, previous }) => (
    <div className="flex justify-between items-center w-4/5 mx-auto">

        <div>
            {previous && (
                <Link to={previous.fields.slug} className="bg-gray-100 rounded-lg px-4 py-2 ml-2 transition-colors duration-200 ease-in-out hover:bg-gray-200">
                    <span className="mr-2">&larr;</span>
                    {previous.frontmatter.title}
                </Link>
            )}
        </div>
        <div>
            {next && (
                <Link to={next.fields.slug} className="bg-gray-100 rounded-lg px-4 py-2 mr-2 transition-colors duration-200 ease-in-out hover:bg-gray-200">
                    {next.frontmatter.title}
                    <span className="ml-2">&rarr;</span>
                </Link>
            )}
        </div>
    </div>
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