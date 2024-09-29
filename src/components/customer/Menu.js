"use client";

import { useEffect, useState } from "react";

const Menu = ({ tableId }) => {
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`/api/customer/menu/${tableId}`);
        if (!response.ok) {
          throw new Error("Menu not found");
        }
        const data = await response.json();
        setMenu(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMenu();
  }, [tableId]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Menu for Table {tableId}</h2>
      {menu.length > 0 ? (
        <ul>
          {menu.map((item) => (
            <li key={item.id}>
              {item.name} - {item.price}€
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading menu...</p>
      )}
    </div>
  );
};

export default Menu;
