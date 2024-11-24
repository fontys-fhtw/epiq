// DishList.js

import DishCard from "./DishCard";

export default function DishList({
  menuData,
  handleEditClick,
  supabase,
  refetchMenu,
}) {
  return (
    <div>
      {menuData?.map(({ category, dishes }) => (
        <div key={category.id} className="mt-4">
          <h4 className="text-xl font-semibold">{category}</h4>
          {!dishes.length && <h2>No {category} yet.</h2>}
          {dishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              handleEditClick={handleEditClick}
              supabase={supabase}
              refetchMenu={refetchMenu}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
