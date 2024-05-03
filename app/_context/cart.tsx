/* eslint-disable no-unused-vars */
//contexto do carrinho de compras, precisa ser fornecido globalmente para diversas partes da aplicação
"use client";

import { Prisma, Product } from "@prisma/client";
import { ReactNode, createContext, useMemo, useState } from "react";
import { calculateProductTotalPrice } from "../_helpers/price";

export interface CartProduct
  extends Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          deliveryFee: true;
        };
      };
    };
  }> {
  quantity: number;
}

interface ICartContext {
  products: CartProduct[];
  subtotal: number;
  totalPrice: number;
  totalDiscounts: number;
  addProductToCart: ({
    product,
    quantity,
    emptyCart,
  }: {
    product: Prisma.ProductGetPayload<{
      include: {
        restaurant: {
          select: {
            deliveryFee: true;
          };
        };
      };
    }>;
    quantity: number;
    emptyCart?: boolean;
  }) => void;
  decreaseProductQuantity: (productId: string) => void;
  increaseProductQuantity: (productId: string) => void;
  removeProductFromCart: (productId: string) => void;
}

export const CartContext = createContext<ICartContext>({
  products: [],
  subtotal: 0,
  totalPrice: 0,
  totalDiscounts: 0,
  addProductToCart: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProductFromCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);

  const subtotal = useMemo(() => {
    //utilizando o useMemo para garantir que só será recalculado quando aquela dependencia em específico for atualizada
    return products.reduce((accumulator, product) => {
      return accumulator + Number(product.price) * product.quantity;
    }, 0);
  }, [products]);

  const totalPrice = useMemo(() => {
    return (
      products.reduce((accumulator, product) => {
        return (
          accumulator + calculateProductTotalPrice(product) * product.quantity
        );
      }, 0) + Number(products?.[0]?.restaurant?.deliveryFee)
    );
  }, [products]);

  const totalDiscounts =
    subtotal - totalPrice + Number(products?.[0]?.restaurant?.deliveryFee);

  const increaseProductQuantity = (productId: string) => {
    return setProducts((prevProducts) =>
      prevProducts.map((cartProduct) => {
        if (cartProduct.id === productId) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + 1,
          };
        }

        return cartProduct;
      }),
    );
  };

  const decreaseProductQuantity = (productId: string) => {
    return setProducts((prevProducts) =>
      prevProducts.map((cartProduct) => {
        if (cartProduct.id === productId && cartProduct.quantity > 1) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity - 1,
          };
        }

        return cartProduct;
      }),
    );
  };

  const addProductToCart = ({
    product,
    quantity,
    emptyCart,
  }: {
    product: Prisma.ProductGetPayload<{
      include: {
        restaurant: {
          select: {
            deliveryFee: true;
          };
        };
      };
    }>;
    quantity: number;
    emptyCart?: boolean;
  }) => {
    if (emptyCart) {
      setProducts([]);
    }

    //verificar se o produto já está no carrinho
    const isProductAlreadyOnCart = products.some(
      (cartProduct) => cartProduct.id === product.id,
    );

    //se estiver aumentar a sua quantidade
    if (isProductAlreadyOnCart) {
      return setProducts((prevProducts) =>
        prevProducts.map((cartProduct) => {
          if (cartProduct.id === product.id) {
            return {
              ...cartProduct,
              quantity: cartProduct.quantity + quantity,
            };
          }

          return cartProduct;
        }),
      );
    }

    //senão, adicioná-lo com a qtd recebida
    setProducts((prevContent) => [
      ...prevContent,
      { ...product, quantity: quantity },
    ]);
  };

  const removeProductFromCart = (productId: string) => {
    return setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId),
    );
  };

  return (
    <CartContext.Provider
      value={{
        products,
        subtotal,
        totalPrice,
        totalDiscounts,
        addProductToCart,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProductFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
