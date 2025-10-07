import { useState } from "react";
import QuantityInput from "../QuantityInput";

export default function QuantityInputExample() {
  const [quantity, setQuantity] = useState(1.5);

  return (
    <div className="p-6 max-w-md mx-auto">
      <QuantityInput value={quantity} onChange={setQuantity} />
    </div>
  );
}
