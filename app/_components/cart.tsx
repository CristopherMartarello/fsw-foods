import { useContext } from "react";
import { CartContext } from "../_context/cart";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const Cart = () => {
  const { products, subtotal, totalDiscounts, totalPrice } =
    useContext(CartContext);

  return (
    <div className="py-5">
      <div className="space-y-4">
        {products.map((product) => (
          <CartItem key={product.id} cartProduct={product} />
        ))}
      </div>

      <div className="mt-6">
        <Card>
          <CardContent className="space-y-2 p-5">
            <div className="item-center flex justify-between">
              <span className="text-xs text-muted-foreground">Subtotal</span>
              <span className="text-xs">{formatCurrency(subtotal)}</span>
            </div>

            <Separator className="h-[0.5px] bg-[#EEEEEE]" />

            <div className="item-center flex justify-between">
              <span className="text-xs text-muted-foreground">Descontos</span>
              <span className="text-xs">
                - {formatCurrency(totalDiscounts)}
              </span>
            </div>

            <Separator className="h-[0.5px] bg-[#EEEEEE]" />

            <div className="item-center flex justify-between">
              <span className="text-xs text-muted-foreground">Entrega</span>
              {Number(products[0].restaurant.deliveryFee) === 0 ? (
                <span className="uppercase text-primary">Grátis</span>
              ) : (
                <span className="text-xs">
                  {formatCurrency(Number(products[0].restaurant.deliveryFee))}
                </span>
              )}
            </div>

            <Separator className="h-[0.5px] bg-[#EEEEEE]" />

            <div className="item-center flex justify-between font-semibold">
              <span className="text-xs">Total</span>
              <span className="text-xs">{formatCurrency(totalPrice)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button className="mt-6 w-full"></Button>
    </div>
  );
};

export default Cart;
