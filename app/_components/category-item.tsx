import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface CategoryItemProps {
  category: Category;
}

const CategoryItem = ({ category }: CategoryItemProps) => {
  return (
    <Link
      href={`/categories/${category.id}/products`}
      className="flex min-w-[160px] items-center justify-center gap-3 rounded-full border bg-slate-50 px-4 py-3"
    >
      <Image
        src={category.imageURL}
        alt={category.name}
        width={30}
        height={30}
      />

      <span className="text-sm font-semibold">{category.name}</span>
    </Link>
  );
};

export default CategoryItem;
