import { db } from "../_lib/prisma";
import RestaurantItem from "./restaurant-item";

const RestauranList = async () => {
  //TODO: pegar restaurantes com maior número de pedidos
  const restaurants = await db.restaurant.findMany({ take: 10 });
  return (
    <div className="flex gap-4 overflow-x-scroll px-5 [&::-webkit-scrollbar]:hidden">
      {restaurants.map((r) => (
        <RestaurantItem key={r.id} restaurant={r} />
      ))}
    </div>
  );
};

export default RestauranList;
