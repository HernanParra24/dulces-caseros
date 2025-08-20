import { IsUUID, IsNotEmpty } from 'class-validator';

export class AddToFavoritesDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;
}

export class RemoveFromFavoritesDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;
}

