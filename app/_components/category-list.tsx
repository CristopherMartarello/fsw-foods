import { db } from "../_lib/prisma";
import CategoryItem from "./category-item";

const CategoryList = async () => {
  const categories = await db.category.findMany({});
  // get categories from database
  // render an item for each category
  return (
    <div className="flex gap-1 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
};

export default CategoryList;
