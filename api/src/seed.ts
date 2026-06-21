import { prisma } from "../db/src/index";

const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Sports",
  "Furniture",
];

async function main() {
  const TOTAL = 200_000;
  const BATCH_SIZE = 5000;

  for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
    const products = [];

    for (let j = 0; j < BATCH_SIZE; j++) {
      products.push({
        name: `Product ${i + j + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)]!,
        price: Math.floor(Math.random() * 1000) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await prisma.product.createMany({
      data: products,
    });

    console.log(`Inserted ${Math.min(i + BATCH_SIZE, TOTAL)} products`);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });