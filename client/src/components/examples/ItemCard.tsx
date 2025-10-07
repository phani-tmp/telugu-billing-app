import { useState } from "react";
import ItemCard from "../ItemCard";

export default function ItemCardExample() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-3 max-w-md">
      <ItemCard
        name="టమాటా"
        price={40}
        isSelected={selected === "tomato"}
        onClick={() => setSelected("tomato")}
      />
      <ItemCard
        name="ఉల్లిపాయలు"
        price={30}
        isSelected={selected === "onion"}
        onClick={() => setSelected("onion")}
      />
      <ItemCard
        name="బంగాళాదుంప"
        isSelected={selected === "potato"}
        onClick={() => setSelected("potato")}
      />
    </div>
  );
}
