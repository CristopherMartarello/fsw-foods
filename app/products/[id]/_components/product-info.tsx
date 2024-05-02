"use client";

import DiscountBadge from "@/app/_components/discount-badge";
import ProductList from "@/app/_components/products-list";
import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import {
  calculateProductTotalPrice,
  formatCurrency,
} from "@/app/_helpers/price";
import { Prisma } from "@prisma/client";
import {
  BikeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TimerIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductInfoProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>;
  complementaryProducts: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>[];
}

const ProductInfo = ({ product, complementaryProducts }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantityClick = () =>
    setQuantity((currentState) => currentState + 1);
  const handleDecreaseQuantityClick = () =>
    setQuantity((currentState) =>
      currentState > 1 ? currentState - 1 : currentState,
    );

  return (
    <div className="relative z-50 mt-[-1.5rem] rounded-tl-3xl rounded-tr-3xl bg-white py-5">
      <div className="flex items-center gap-[0.375rem] px-5">
        <div className="relative h-10 w-10">
          <Image
            src={product.restaurant.imageURL}
            alt={product.restaurant.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {product.restaurant.name}
        </span>
      </div>

      {/*NOME DO PRODUTO*/}
      <h1 className="mb-3 mt-1 px-5 text-xl font-semibold">{product.name}</h1>

      {/*PREÇO DO PRODUTO E QUANTIDADE*/}
      <div className="flex justify-between px-5">
        {/*PREÇO DESCONTO*/}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              {formatCurrency(calculateProductTotalPrice(product))}
            </h2>
            {product.discountPercentage > 0 && (
              <DiscountBadge product={product} />
            )}
          </div>

          {/*PREÇO ORIGINAL*/}
          {product.discountPercentage > 0 && (
            <>
              <span className="text-muted-foreground">De: </span>
              <span className="text-muted-foreground line-through">
                {formatCurrency(Number(product.price))}
              </span>
            </>
          )}
        </div>

        {/*QUANTIDADE*/}
        <div className="flex items-center gap-4 text-center">
          <Button
            className="border border-solid border-muted-foreground"
            size="icon"
            variant="ghost"
            onClick={handleDecreaseQuantityClick}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="w-4">{quantity}</span>
          <Button size="icon" onClick={handleIncreaseQuantityClick}>
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      {/*DADOS DA ENTREGA*/}
      <div className="px-5">
        <Card className="mt-6 flex justify-around py-3">
          {/*CUSTO DE ENTREGA*/}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">Entrega</span>
              <BikeIcon size={16} />
            </div>

            {Number(product.restaurant.deliveryFee) > 0 ? (
              <p className="text-sm font-semibold">
                {formatCurrency(Number(product.restaurant.deliveryFee))}
              </p>
            ) : (
              <p className="text-xs font-semibold">Grátis</p>
            )}
          </div>
          {/*TEMPO DE ENTREGA*/}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">Tempo estimado</span>
              <TimerIcon size={16} />
            </div>

            {Number(product.restaurant.deliveryTimeMinutes) > 0 ? (
              <p className="text-sm font-semibold">
                {product.restaurant.deliveryTimeMinutes}min
              </p>
            ) : (
              <p className="text-xs font-semibold">Não informado</p>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 space-y-3 px-5">
        <h3 className="font-semibold">Sobre</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="px-5 font-semibold">Sucos</h3>
        <ProductList products={complementaryProducts} />
      </div>

      <div className="mt-6 px-5">
        <Button className="w-full font-semibold">Adicionar à sacola</Button>
      </div>
    </div>
  );
};

export default ProductInfo;
