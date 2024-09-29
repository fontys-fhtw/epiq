import Menu from "@/components/customer/Menu";

const MenuPage = () => {
  const tableId = "1";

  return (
    <div>
      <h1>Customer Menu</h1>
      <Menu tableId={tableId} />
    </div>
  );
};

export default MenuPage;
