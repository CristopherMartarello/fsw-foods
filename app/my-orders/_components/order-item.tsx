"use client";
import { Avatar, AvatarImage } from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Separator } from "@/app/_components/ui/separator";
import { CartContext } from "@/app/_context/cart";
import { formatCurrency } from "@/app/_helpers/price";
import { OrderStatus, Prisma } from "@prisma/client";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";

interface OrdemItemProps {
  order: Prisma.OrderGetPayload<{
    include: {
      restaurant: true;
      products: {
        include: {
          product: true;
        };
      };
    };
  }>;
}

const getOrderStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case "CANCELED":
      return "Cancelado";
    case "DELIVERING":
      return "Em transporte";
    case "CONFIRMED":
      return "Confirmado";
    case "PREPARING":
      return "Preparando";
    case "COMPLETED":
      return "Entregue";
  }
};

const OrderItem = ({ order }: OrdemItemProps) => {
  const { addProductToCart } = useContext(CartContext);
  const router = useRouter();

  const handleRedoOrderClick = () => {
    for (const orderProduct of order.products) {
      addProductToCart({
        product: { ...orderProduct.product, restaurant: order.restaurant },
        quantity: orderProduct.quantity,
      });
    }

    router.push(`/restaurants/${order.restaurantId}`);
  };
  return (
    <Card>
      <CardContent className="p-5">
        <div
          className={`w-fit rounded-full px-2 py-1 text-white ${order.status === "COMPLETED" ? "bg-muted-foreground" : "bg-green-500"}`}
        >
          <span className="block text-xs font-semibold">
            {getOrderStatusLabel(order.status)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={order.restaurant.imageURL} />
            </Avatar>

            <span className="text-sm font-semibold">
              {order.restaurant.name}
            </span>
          </div>

          <Button variant="link" size="icon" className="h-5 w-5 text-black">
            <Link href={`/restaurants/${order.restaurantId}`}>
              <ChevronRightIcon />
            </Link>
          </Button>
        </div>

        <div className="py-3">
          <Separator className="bg-muted" />
        </div>

        <div className="space-y-2">
          {order.products.map((product) => (
            <div key={product.id} className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground text-xs text-white">
                <span className="block">{product.quantity}</span>
              </div>
              <span className="block text-xs text-muted-foreground">
                {product.product.name}
              </span>
            </div>
          ))}
        </div>

        <div className="py-3">
          <Separator className="bg-muted" />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">
            {formatCurrency(Number(order.totalPrice))}
          </p>
          <Button
            variant="ghost"
            className="text-xs text-primary"
            size="sm"
            disabled={order.status !== "COMPLETED"}
            onClick={handleRedoOrderClick}
          >
            Pedir novamente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItem;
