import './SearchBar.css';

import { useEffect, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
	const [search, setSearch] = useState('');
	const [searchData, setSearchData] = useState([]);
	const [selectedItem, setSelectedItem] = useState(-1);

	const handleChange = (e) => {
		setSearch(e.target.value);
	};

	const handleDeleteSearch = () => {
		setSearch('');
		setSearchData([]);
		setSelectedItem(-1);
	};

	const handleKeyDown = (e) => {
		if (selectedItem < searchData.length) {
			if (e.key === 'ArrowUp' && selectedItem > 0) {
				setSelectedItem((prev) => prev - 1);
			} else if (e.key === 'ArrowDown' && selectedItem < searchData.length - 1) {
				setSelectedItem((prev) => prev + 1);
			} else if (e.key === 'Enter' && selectedItem >= 0) {
				window.open(
					`https://www.imdb.com/title/${searchData[selectedItem].imdbID}`
				);
			}
		} else {
			setSelectedItem(-1);
		}
	};

	useEffect(() => {
		if (search !== '') {
			// Вставь свой API-ключ вместо 'your_api_key'
			fetch(`https://www.omdbapi.com/?apikey=2cde4e08&s=${search}`)
				.then((res) => res.json())
				.then((data) => {
					if (data.Search) {
						setSearchData(data.Search);
					} else {
						setSearchData([]);
					}
				});
		}
	}, [search]);

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
						<SearchIcon />
					) : (
						<CloseIcon onClick={handleDeleteSearch} />
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
							{data.Title} ({data.Year})
						</a>
					);
				})}
			</div>
		</section>
	);
};

export default SearchBar;
