import { BikeIcon, TimerIcon } from "lucide-react";
import { Card } from "./ui/card";
import { Restaurant } from "@prisma/client";
import { formatCurrency } from "../_helpers/price";

interface DeliveryInfoProps {
  restaurant: Pick<Restaurant, "deliveryFee" | "deliveryTimeMinutes">;
}

const DeliveryInfo = ({ restaurant }: DeliveryInfoProps) => {
  return (
    <>
      <Card className="mt-6 flex justify-around py-3">
        {/*CUSTO DE ENTREGA*/}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-xs">Entrega</span>
            <BikeIcon size={16} />
          </div>

          {Number(restaurant.deliveryFee) > 0 ? (
            <p className="text-sm font-semibold">
              {formatCurrency(Number(restaurant.deliveryFee))}
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

          {Number(restaurant.deliveryTimeMinutes) > 0 ? (
            <p className="text-sm font-semibold">
              {restaurant.deliveryTimeMinutes}min
            </p>
          ) : (
            <p className="text-xs font-semibold">Não informado</p>
          )}
        </div>
      </Card>
    </>
  );
};

export default DeliveryInfo;
