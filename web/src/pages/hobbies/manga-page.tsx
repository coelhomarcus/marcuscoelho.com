import { CatalogPage } from "./components/catalog-page";
import { useMangaCatalog } from "./use-catalog";

export default function MangaPage() {
  const catalog = useMangaCatalog();
  return <CatalogPage kind="manga" {...catalog} />;
}
