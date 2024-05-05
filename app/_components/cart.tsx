import { useContext, useState } from "react";
import { CartContext } from "../_context/cart";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { createOrder } from "../_actions/order";
import { OrderStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const Cart = () => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const { data } = useSession();

  const { products, subtotalPrice, totalDiscounts, totalPrice, clearCart } =
    useContext(CartContext);

  const handleFinishOrderClick = async () => {
    if (!data?.user) return;

    const restaurant = products[0].restaurant;

    try {
      setIsSubmitLoading(true);
      await createOrder({
        subtotalPrice,
        totalDiscounts,
        totalPrice,
        deliveryFee: restaurant.deliveryFee,
        deliveryTime: restaurant.deliveryTimeMinutes,
        restaurant: {
          connect: {
            id: restaurant.id,
          },
        },
        status: OrderStatus.CONFIRMED,
        user: {
          connect: { id: data.user.id },
        },
        products: {
          createMany: {
            data: products.map((product) => ({
              productId: product.id,
              quantity: product.quantity,
            })),
          },
        },
      });

      clearCart();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col py-5">
        {products.length > 0 ? (
          <>
            <div className="flex-auto space-y-4">
              {products.map((product) => (
                <CartItem key={product.id} cartProduct={product} />
              ))}
            </div>
            <div className="mt-6">
              <Card>
                <CardContent className="space-y-2 p-5">
                  <div className="item-center flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="text-xs">
                      {formatCurrency(subtotalPrice)}
                    </span>
                  </div>

                  <Separator className="h-[0.5px] bg-[#EEEEEE]" />

                  <div className="item-center flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Descontos
                    </span>
                    <span className="text-xs">
                      - {formatCurrency(totalDiscounts)}
                    </span>
                  </div>

                  <Separator className="h-[0.5px] bg-[#EEEEEE]" />

                  <div className="item-center flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Entrega
                    </span>
                    {Number(products?.[0].restaurant.deliveryFee) === 0 ? (
                      <span className="text-xs uppercase text-primary">
                        Grátis
                      </span>
                    ) : (
                      <span className="text-xs">
                        {formatCurrency(
                          Number(products?.[0].restaurant.deliveryFee),
                        )}
                      </span>
                    )}
                  </div>

                  <Separator className="h-[0.5px] bg-[#EEEEEE]" />

                  <div className="item-center flex justify-between font-semibold">
                    <span className="text-xs">Total</span>
                    <span className="text-xs">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Button
                className="mt-6 w-full"
                onClick={() => setIsConfirmDialogOpen(true)}
              >
                Finalizar pedido
              </Button>
            </div>
          </>
        ) : (
          <h2 className="text-left font-medium">Sua sacola está vazia.</h2>
        )}
      </div>

      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja finalizar seu pedido? </AlertDialogTitle>
            <AlertDialogDescription>
              Ao finalizar o seu pedido você concorda com os termos e condições
              de nossa plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitLoading}
              onClick={handleFinishOrderClick}
            >
              {isSubmitLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Cart;
