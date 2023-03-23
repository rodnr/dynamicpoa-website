import { Link } from "gatsby";
import PropTypes from 'prop-types';
import React from "react";

const Pagination = ({ isFirst, isLast, numPages, currentPage, prevPage, nextPage }) => (
    <div className="flex justify-center items-center space-x-4">
        {!isFirst && (
            <Link
                to={prevPage}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l"
            >
                ← Página Anterior
            </Link>
        )}
        <p className="bg-gray-200 text-gray-700 font-semibold py-2 px-4">
            {currentPage} de {numPages}
        </p>
        {!isLast && (
            <Link
                to={nextPage}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r"
            >
                Próxima Página →
            </Link>
        )}
    </div>
)

Pagination.propTypes = {
    isFirst: PropTypes.bool.isRequired,
    isLast: PropTypes.bool.isRequired,
    numPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    prevPage: PropTypes.string,
    nextPage: PropTypes.string
}

export default Pagination