import type { ComponentType, SVGProps } from "react";
import {
  ArchiveBoxIcon,
  BeakerIcon,
  BuildingStorefrontIcon,
  CakeIcon,
  Cog6ToothIcon,
  CubeIcon,
  FireIcon,
  GiftIcon,
  GlobeAltIcon,
  Squares2X2Icon,
  SunIcon,
  SwatchIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

export type BusinessIcon = ComponentType<SVGProps<SVGSVGElement>>;

export const CATEGORY_ICONS: Record<string, BusinessIcon> = {
  agriculture: SunIcon,
  textiles: Squares2X2Icon,
  engineering: Cog6ToothIcon,
  chemicals: BeakerIcon,
  "food-beverage": CakeIcon,
  handicrafts: GiftIcon,
  spices: FireIcon,
};

export function getCategoryIcon(category: string): BusinessIcon {
  return CATEGORY_ICONS[category] ?? CubeIcon;
}

export function CategoryIcon({
  category,
  className = "h-4 w-4",
}: {
  category: string;
  className?: string;
}) {
  const Icon = getCategoryIcon(category);
  return <Icon className={className} aria-hidden />;
}

export const ALL_CATEGORIES_ICON = GlobeAltIcon;
export const DEFAULT_PRODUCT_ICON = ArchiveBoxIcon;

export const INDUSTRY_ICONS: Record<string, BusinessIcon> = {
  "agriculture-agro-processing": SunIcon,
  "textiles-apparel": SwatchIcon,
  "automotive-engineering": WrenchScrewdriverIcon,
  "chemicals-pharmaceuticals": BeakerIcon,
  "food-seafood": ArchiveBoxIcon,
  "retail-ecommerce": BuildingStorefrontIcon,
  agriculture: SunIcon,
  textiles: SwatchIcon,
  engineering: Cog6ToothIcon,
  chemicals: BeakerIcon,
  "food-beverage": CakeIcon,
  handicrafts: GiftIcon,
};

export function getIndustryIcon(slug: string): BusinessIcon {
  return INDUSTRY_ICONS[slug] ?? CubeIcon;
}
