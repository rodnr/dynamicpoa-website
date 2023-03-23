import { Link } from "gatsby";
import PropTypes from 'prop-types';
import React from "react";

const RecommendedPosts = ({ next, previous }) => (
    <div className="flex justify-between items-center w-2/3 mx-auto">

        <div>
            {previous && (
                <Link to={previous.fields.slug} className="bg-gray-200 text-gray-700 rounded-lg px-4 py-4 ml-2 transition-colors duration-200 ease-in-out hover:bg-gray-300 font-bold">
                    <span className="mr-2">&larr;</span>
                    {previous.frontmatter.title}
                </Link>
            )}
        </div>
        <div>
            {next && (
                <Link to={next.fields.slug} className="bg-gray-200 text-gray-700 rounded-lg px-4 py-4 mr-2 transition-colors duration-200 ease-in-out hover:bg-gray-300 font-bold">
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