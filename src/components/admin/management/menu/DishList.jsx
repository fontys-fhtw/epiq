import DishCard from "./DishCard";

export default function DishList({
  menuData,
  supabase,
  refetchMenu,
  availableIngredients,
  categories,
  handleEditClick,
}) {
  return (
    <div>
      {menuData?.map(({ category, dishes }) => (
        <div key={category.id} className="mt-4">
          <h4 className="text-xl font-semibold">{category}</h4>
          {!dishes.length && <h2>No {category} yet.</h2>}
          {dishes.map((dish) => (
            <DishCard
              handleEditClick={handleEditClick}
              key={dish.id}
              dish={dish}
              supabase={supabase}
              refetchMenu={refetchMenu}
              availableIngredients={availableIngredients}
              categories={categories}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
