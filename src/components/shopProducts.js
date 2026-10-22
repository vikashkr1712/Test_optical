export const productGroups = {
  best: [
    { id: 'product-1', brand: 'Maui Jim', model: 'MJ-H407 02', colour: 'Black · Rimless', type: 'Sunglasses', price: 14690 },
    { id: 'product-2', brand: 'Emporio Armani', model: '0EA4232 6106/87', colour: 'Transparent grey', type: 'Sunglasses', price: 15390 },
    { id: 'product-3', brand: 'Emporio Armani', model: '0EA3038 5063', colour: 'Matt black', type: 'Eyeglasses', price: 12490 },
  ],
  edit: [
    { id: 'edit-1', brand: 'Burberry', model: '0BE4438U 300187', colour: 'Black', type: 'Sunglasses', price: 34290 },
    { id: 'edit-2', brand: 'Burberry', model: '0BE4403 409680', colour: 'Brown', type: 'Sunglasses', price: 22590 },
    { id: 'edit-3', brand: 'Champ', model: 'S5018 C4', colour: 'Blue · Junior', type: 'Sunglasses', price: 1500 },
  ],
};

export const shopProducts = Object.values(productGroups).flat();
export const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
