import { CatalogPage } from "./components/catalog-page";
import { useAnimeCatalog } from "./use-catalog";

export default function AnimePage() {
  const catalog = useAnimeCatalog();
  return <CatalogPage kind="anime" {...catalog} />;
}
