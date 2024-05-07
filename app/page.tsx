import CategoryList from "./_components/category-list";
import Header from "./_components/header";
import Search from "./_components/search";
import ProductList from "./_components/products-list";
import { Button } from "./_components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { db } from "./_lib/prisma";
import PromoBanner from "./_components/promo-banner";
import RestauranList from "./_components/restaurant-list";
import Link from "next/link";

const Home = async () => {
  const products = await db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0, //greater than zero
      },
    },
    take: 10,
    include: {
      //utilizando a FK para pegar o restaurante na outra table
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });

  const burguersCategory = await db.category.findFirst({
    where: {
      name: "Hambúrgueres",
    },
  });

  const pizzasCategory = await db.category.findFirst({
    where: {
      name: "Pizzas",
    },
  });

  return (
    <>
      <Header />
      <div className="px-5 pt-6">
        <Search />
      </div>

      <div className="pt-6">
        <CategoryList />
      </div>

      <div className="px-5 pt-6">
        <Link href={`categories/${pizzasCategory?.id}/products`}>
          <PromoBanner
            src="/promo-banner-01.png"
            alt="Até 30% de desconto em pizzas."
          />
        </Link>
      </div>

      <div className="space-y-3 pt-6">
        <div className="flex items-center justify-between px-5">
          <h2 className="font-semibold">Pedidos Recomendados</h2>
          <Link href={"/products/recommended"}>
            <Button
              variant="ghost"
              className="h-fit p-0 text-primary hover:bg-transparent"
            >
              Ver todos
              <ChevronRightIcon size={16} />
            </Button>
          </Link>
        </div>
        <ProductList products={products} />
      </div>

      <div className="px-5 pt-6">
        <Link href={`/categories/${burguersCategory?.id}/products`}>
          <PromoBanner
            src="/promo-banner-02.png"
            alt="A partir de R$17,90 em Lanches."
          />
        </Link>
      </div>

      <div className="space-y-3 pt-6">
        <div className="flex items-center justify-between px-5">
          <h2 className="font-semibold">Restaurantes Recomendados</h2>
          <Link href="/restaurants/recommended">
            <Button
              variant="ghost"
              className="h-fit p-0 text-primary hover:bg-transparent"
            >
              Ver todos
              <ChevronRightIcon size={16} />
            </Button>
          </Link>
        </div>
        <RestauranList />
      </div>
    </>
  );
};

export default Home;
