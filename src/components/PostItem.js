import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from "react";

const PostItem = ({ date, title, description, slug }) => (
    <Link to={slug}>
        <section className="bg-white shadow-md rounded-md p-6 mb-8 hover:bg-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
            <date className="text-sm text-gray-600 mb-4">{date}</date>
            <p className="text-lg text-gray-700">{description}</p>
        </section>
    </Link>
)

PostItem.propTypes = {
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
}

export default PostItem