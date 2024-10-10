// Import necessary components and hooks

import './SearchBar.css';

import { useEffect, useState } from 'react';
import { IoCloseSharp, IoSearch } from "react-icons/io5";

import React from 'react';
import { Img } from 'react-image';

// Define the SearchBar component
const SearchBar = () => {
	// State variables for search input, search results, and selected item
	const [search, setSearch] = useState('');
	const [searchData, setSearchData] = useState([]);
	const [selectedItem, setSelectedItem] = useState(-1);

	// Handle search input change
	const handleChange = (e) => {
		setSearch(e.target.value);
	};

	// Handle search input deletion
	const handleDeleteSearch = () => {
		setSearch('');
		setSearchData([]);
		setSelectedItem(-1);
	};

	// Handle keyboard events for search input
	const handleKeyDown = (e) => {
		if (selectedItem < searchData.length) {
			// Handle arrow key navigation and selection
			if (e.key === 'ArrowUp' && selectedItem > 0) {
				setSelectedItem((prev) => prev - 1);
			} else if (e.key === 'ArrowDown' && selectedItem < searchData.length - 1) {
				setSelectedItem((prev) => prev + 1);
			} else if (e.key === 'Enter' && selectedItem >= 0) {
				// Open the selected item in a new tab
				window.open(
					`https://www.imdb.com/title/${searchData[selectedItem].imdbID}`
				);
			} else if (e.key === 'Escape') {
				// Clear search input and results
				handleDeleteSearch();
			}
		} else {
			// Reset selected item when no results are available
			setSelectedItem(-1);
		}
	};

	// Fetch search results from the OMDB API when search input changes
	useEffect(() => {
		if (search !== '') {
			fetch(`https://www.omdbapi.com/?apikey=2cde4e08&s=${search}`)
				.then((res) => res.json())
				.then((data) => {
					if (data.Search) {
						// Set search results
						setSearchData(data.Search);
					} else {
						// Clear search results when no matches are found
						setSearchData([]);
					}
				});
		}
	}, [search]);

	// Render the search bar component
	return (
		<section className="search_section">
			<div className="search_input_div">
				<input
					type="text"
					className="search_input"
					placeholder="Search IMDb..."
					autoComplete="off"
					onChange={handleChange}
					value={search}
					onKeyDown={handleKeyDown}
				/>
				<div className="search_icon">
					{search === '' ? (
						<IoSearch />
					) : (
						<IoCloseSharp onClick={handleDeleteSearch} />
					)}
				</div>
			</div>
			<div className="search_result">
				{searchData.map((data, index) => {
					return (
						<a
							href={`https://www.imdb.com/title/${data.imdbID}`}
							key={index}
							target="_blank"
							className={
								selectedItem === index
									? 'search_suggestion_line active'
									: 'search_suggestion_line'
							}
							rel="noreferrer"
						>
							<Img src={data.Poster} alt={data.Title} className="poster" />
							{data.Title} ({data.Year})
						</a>
					);
				})}
			</div>
		</section>
	);
};

// Export the SearchBar component
export default SearchBar;

