import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setBeerData } from './redux/action';
import "../src/Styles/Style.css";

const ShowTable = () => {

    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFilter, setSelectedFilter] = useState('brewed_before');
    const [filterDate, setFilterDate] = useState('');
    const perPage = 10;

    const fetchData = async () => {
        try {
            const params = {
                page: currentPage,
                per_page: perPage,
            };
            if (selectedFilter && filterDate) {
                params[selectedFilter] = filterDate;
            }

            const response = await axios.get('https://api.punkapi.com/v2/beers', {
                params,
            });

            dispatch(setBeerData(response.data));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, selectedFilter, filterDate, dispatch]);


    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    const handleFilterDateChange = (event) => {
        setFilterDate(event.target.value);
    };

    return (
        <center>
            <label>
                Select Filter:
                <select value={selectedFilter} onChange={handleFilterChange}>
                    <option value="brewed_before">Brewed Before</option>
                    <option value="brewed_after">Brewed After</option>
                </select>
            </label>
            <label>
                Filter Date:
                <input type="text" placeholder="Enter date i.e 11-2005" value={filterDate} onChange={handleFilterDateChange} />
            </label>
            <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Tagline</th>
                        <th>First Brewed</th>
                        <th>ABV</th>
                        <th>IBU</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((beer) => (
                        <tr key={beer.id}>
                            <td>{beer.id}</td>
                            <td>{beer.name}</td>
                            <td>{beer.tagline}</td>
                            <td>{beer.first_brewed}</td>
                            <td>{beer.abv}</td>
                            <td>{beer.ibu}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="page-wrap">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev Page
                </button>
                <span className="Page-no"> {currentPage} </span>
                <button onClick={handleNextPage}>Next Page</button>
            </div>
        </center>
    );
};

export default ShowTable;
