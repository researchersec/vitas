// src/dataLoader.ts
export async function getItemData() {
  const response = await fetch('/latest.json');
  const data = await response.json();
  return data.pricing_data;
}
