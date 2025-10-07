import BillDisplay from "../BillDisplay";

export default function BillDisplayExample() {
  const mockItems = [
    { itemName: "టమాటా", quantity: 2.5, price: 40, total: 100 },
    { itemName: "ఉల్లిపాయలు", quantity: 1, price: 30, total: 30 },
    { itemName: "బంగాళాదుంప", quantity: 3, price: 25, total: 75 },
  ];

  return (
    <div className="p-4 max-w-md mx-auto">
      <BillDisplay
        billNumber="001"
        items={mockItems}
        totalAmount={205}
        onShare={() => console.log("Share triggered")}
        onPrint={() => console.log("Print triggered")}
        onSave={() => console.log("Save triggered")}
      />
    </div>
  );
}
