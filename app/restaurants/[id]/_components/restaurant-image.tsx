"use client";
import {
  favoriteRestaurant,
  unfavoriteRestaurant,
} from "@/app/_actions/restaurant";
import { Button } from "@/app/_components/ui/button";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { ChevronLeftIcon, HeartIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RestaurantImageProps {
  restaurant: Pick<Restaurant, "name" | "imageURL" | "id">;
  userFavoriteRestaurants: UserFavoriteRestaurant[];
}

const RestaurantImage = ({
  restaurant,
  userFavoriteRestaurants,
}: RestaurantImageProps) => {
  const router = useRouter();

  const { data } = useSession();
  const isFavorite = userFavoriteRestaurants.some(
    (fav) => fav.restaurantId === restaurant.id,
  );

  const handleFavoriteClick = async () => {
    if (!data?.user.id) return;
    try {
      if (isFavorite) {
        await unfavoriteRestaurant(data.user.id, restaurant.id);
        return toast.success("Restaurante removido dos favoritos.");
      }

      await favoriteRestaurant(data.user.id, restaurant.id);
      toast.success("Restaurante favoritado!", {
        description:
          "Você pode conferir na tela dos seus restaurantes favoritos.",
      });
    } catch (error) {
      toast.error("Erro ao favoritar restaurante.");
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="relative h-[250px] w-full">
      <Image
        src={restaurant.imageURL}
        alt={restaurant.name}
        fill
        className="object-cover"
      />

      <Button
        className="absolute left-4 top-4 h-10 w-10 rounded-full bg-white text-foreground hover:text-white"
        size="icon"
        onClick={handleBackClick}
      >
        <ChevronLeftIcon size={18} />
      </Button>

      {data?.user.id && (
        <Button
          size="icon"
          className={`absolute right-4 top-4 h-10 w-10 rounded-full bg-gray-100 bg-opacity-35 ${isFavorite && "bg-primary hover:bg-gray-700"}`}
          onClick={handleFavoriteClick}
        >
          <HeartIcon className="h-fit w-fit fill-white" size={20} />
        </Button>
      )}
    </div>
  );
};

export default RestaurantImage;
