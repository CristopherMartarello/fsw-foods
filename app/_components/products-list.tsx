import { Prisma } from "@prisma/client";
import ProductItem from "./product-item";

interface ProductListProps {
  //especificando que vai ser uma lista de produtos que tenham o restaurante
  products: Prisma.ProductGetPayload<{
    //especificando nas props que o produto vai trazer o restaurante também
    include: {
      restaurant: {
        select: {
          name: true;
        };
      };
    };
  }>[];
}

const ProductList = async ({ products }: ProductListProps) => {
  return (
    <div className="flex gap-4 overflow-x-scroll px-5 [&::-webkit-scrollbar]:hidden">
      {products.map((p) => (
        <ProductItem key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductList;
