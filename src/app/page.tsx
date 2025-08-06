// app/page.tsx
import { CardHome } from "../../components/ui/cardHome";
export default function HomePage() {

  return (
    <div className={"flex flex-wrap justify-center"}>
      <CardHome texto="Panel Admin" link="/rss-panel" />
      <CardHome texto="Carruseles" link="/carruseles" />
    </div>
  );
}
