import { ChartCard } from "@/components/shared/chart-card";
import { Button } from "@/components/ui/button";
import { MenuItemRow, type MenuItemRowData } from "./menu-item-row";

const POPULAR_ITEMS: MenuItemRowData[] = [
  {
    name: "Dry-Aged Ribeye",
    category: "Main Course",
    price: "$48.00",
    orders: "84 orders",
    trend: "+14%",
    trendUp: true,
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDWXS7gDwe9xlIhFWSn3--eLh6s3ozTVxvkqnSnwZTDFD_kQInslNy9sgPAenbqKK7BXjegUqhQEXJbAH-MpHUY5oSm8nxSPqLn8hs6Rdn1lshEmpBywYGdPl_qwYyWCuHqnUclhBDniG-eBV_J8kRkQTc2UOxbnrOKKWMA1wvMgYsXkeovqgPCM6JHHmIWhf6Lutts1bHE-tikDbCb12SBuuO9qXv7ahXKPBTX11FoK3qRdAOjRnaAhdRzHwpxutxVuqMvWYEIWQ",
  },
  {
    name: "Lobster Ravioli",
    category: "Appetizer",
    price: "$24.00",
    orders: "67 orders",
    trend: "+8%",
    trendUp: true,
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwi-MkHN1W0zVuYUJHEFxZzcQDdXbrOvSPbGFuznYtbpwaFphWOA6OM5yeYsN7D_aKH-bRvDnAusJtroOC3veeHwCMM1Qz0M5RQ1ekz9lI4R9nFgdGfPLwgFo4jxBQvci7MZn5JOpXD2Dts_0TkR4ONRh_LOuIMNzdSNmeFo0pNPoOSM7kUjJmnWrBYvxuKkFXNdnxngSFYJnww5qDwjlKCivHpG5F_gdUjwoTFZXY9wCztotodZPUqGOxD5uPlIBWL42Jof7Kqg",
  },
  {
    name: "Signature Fondant",
    category: "Dessert",
    price: "$16.00",
    orders: "52 orders",
    trend: "-2%",
    trendUp: false,
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAO8_1i44cpYvVEVWoHexUi2Qn25ztHrzdK3YqT5rh-J4gLpOT2LsdW6Y8qIeOD89QAzkJcnSTOzlLOJOg4oJfPL9lfeuWzT8FUeG9QRdogA7TLq54dqkfo8MMQdKxR18vIinF4scbVQYZyTrF0rAdAfFk3jKekPB5og2W0sEQTDmOaBNo2owVZxYPGIQpnUqIx0HxBuz5mRvSLvPJ2j-0OloWxxJSPLsyErUlnHeGiF3WFEpo0UHZZUFhp8V6QaqswuXWAXD3RDw",
  },
  {
    name: "Heirloom Burrata",
    category: "Appetizer",
    price: "$19.00",
    orders: "45 orders",
    trend: "+22%",
    trendUp: true,
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBoPWXL39W2F_FhcAMEhhlMWJdEKig-PRnz4boSxpOcfCxWD1YfyW4xj3YprEU72cBV3RFX4O_gmyeQ0BwR3eC5MUi1enKelclDnyDcv_Tl5b4SOuPMGJwuVvck8b3xVWYk-aV-m7o_9Z8iA_7a4KFjK6Tm2zvEOY58EEqNmpn4QRYb0mUpHVxRpg77fLZQXMZSlpOuoIBaSJ-vwkhJLqXGAz-jViEtHPuDw7n58S2s-J4M9ghOYiCeZJ7StoYoVwYh9UbeW1RP6g",
  },
];

export function PopularItemsCard() {
  return (
    <ChartCard
      title="Popular Items"
      actions={
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
          View Analytics
        </Button>
      }
    >
      <div className="space-y-1">
        {POPULAR_ITEMS.map((item) => (
          <MenuItemRow key={item.name} item={item} />
        ))}
      </div>
    </ChartCard>
  );
}
