import React from 'react';

export const FilterMenu = ({ 
    searchQuery, 
    filterCategory, 
    sortOption, 
    onSearchChange, 
    onFilterChange, 
    onSortChange, 
    categories 
}) => {
    return (
        <div className="section-card" style={{ marginBottom: '30px' }}>
            <h2 className="section-title">Search & Filter Products</h2>
            <form className="form-modal-grid">
                <input
                    placeholder="Search by model, brand, or category..."
                    value={searchQuery}
                    onChange={onSearchChange}
                    className="form-input"
                    style={{ gridColumn: '1 / -1' }}
                />
                
                <select
                    value={filterCategory}
                    onChange={onFilterChange}
                    className="form-select"
                >
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <select
                    value={sortOption}
                    onChange={onSortChange}
                    className="form-select"
                >
                    <option value="">Sort By</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                </select>
            </form>
        </div>
    );
};
