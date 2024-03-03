import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(20);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/customers");
        setCustomers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchData();
  }, []);

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

  const sortedCustomers = () => {
    if (!sortBy) return customers;

    const sorted = [...customers].sort((a, b) => {
      const valueA = sortBy === "date" ? new Date(a.createdAt) : a[sortBy];
      const valueB = sortBy === "date" ? new Date(b.createdAt) : b[sortBy];
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    });

    return sorted;
  };

  const filteredCustomers = sortedCustomers().filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search by name or location"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th >Customer Name</th>
            <th >Age</th>
            <th >Phone</th>
            <th >Location</th>
            <th className="btn" onClick={() => handleSort("date")}>Date</th>
            <th className="btn" onClick={() => handleSort("time")}>Time</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
              <td>{new Date(customer.createdAt).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="pagination-bottom">
        {Array.from(
          { length: Math.ceil(filteredCustomers.length / customersPerPage) },
          (_, i) => (
            <li key={i}>
              <button onClick={() => paginate(i + 1)}>{i + 1}</button>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default App;
