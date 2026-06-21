import express from "express";
import { prisma } from "../db/src/index";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API is running",
  });
});

app.get("/products", async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const cursor = req.query.cursor
      ? Number(req.query.cursor)
      : undefined;

    const products = await prisma.product.findMany({
      where: category
        ? {
            category,
          }
        : undefined,

      take: 20,

      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),

      orderBy: {
        id: "desc",
      },
    });

    const nextCursor =
      products.length > 0
        ? products[products.length - 1]!.id
        : null;

    res.json({
      products,
      nextCursor,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});