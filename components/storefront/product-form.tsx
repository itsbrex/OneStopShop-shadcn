"use client";

import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { addToCart } from "@/server-actions/add-to-cart";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import Link from "next/link";
import { routes } from "@/lib/routes";

export const ProductForm = (props: {
  availableInventory: string | null;
  productId: number;
  productName: string | null;
}) => {
  const [quantity, setQuantity] = useState<string | number>(1);
  let [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-end justify-start gap-4 mt-6">
      {props.availableInventory && Number(props.availableInventory) > 0 && (
        <div className="flex flex-col gap-1 items-start">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            className="w-24"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onBlur={(e) => {
              if (Number(e.target.value) < 1 || isNaN(Number(e.target.value))) {
                setQuantity(1);
                return;
              }
              setQuantity(() => Number(e.target.value.split(".")[0]));
            }}
            type="number"
          />
        </div>
      )}
      {props.availableInventory && Number(props.availableInventory) > 0 ? (
        <Button
          className="w-36"
          onClick={() => {
            startTransition(
              () =>
                void addToCart({
                  id: props.productId,
                  qty: Number(quantity),
                })
            );
            toast({
              title: "Added to cart",
              description: `${quantity}x ${props.productName} has been added to your cart.`,
              action: (
                <Link href={routes.cart}>
                  <ToastAction altText="View cart">View</ToastAction>
                </Link>
              ),
            });
          }}
        >
          Add to Cart
        </Button>
      ) : (
        <Button variant="secondary" disabled={true} className="w-36">
          Sold Out
        </Button>
      )}
    </div>
  );
};
