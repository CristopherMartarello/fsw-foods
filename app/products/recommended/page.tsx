import Header from "@/app/_components/header";
import ProductItem from "@/app/_components/product-item";
import { db } from "@/app/_lib/prisma";

const RecommendedProductsPage = async () => {
  const products = await db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0, //greater than zero
      },
    },
    take: 20,
    include: {
      //utilizando a FK para pegar o restaurante na outra table
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });

  //TODO: pegar produtos com mais pedidos
  return (
    <>
      <Header />
      <div className="p-6">
        <h2 className="mb-6 text-lg font-semibold">Pedidos Recomendados</h2>
        <div className="grid grid-cols-2 gap-6">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              className="min-w-full"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RecommendedProductsPage;
