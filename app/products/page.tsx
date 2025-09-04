"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
};

export default function ProductsPage(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  }, []);

  const openModal = (product: Product) => {
    console.log("Opening:", product);
    setSelected(product);
    setOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => openModal(product)}
          >
            <CardHeader>
              <img
                src={product.image}
                alt={product.title}
                className="h-40 object-contain mx-auto"
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="line-clamp-1">{product.title}</CardTitle>
              <p className="text-lg font-semibold mt-2">${product.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>

  
      <AnimatePresence>
        {open && selected && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <DialogTitle>{selected.title}</DialogTitle>
                  <DialogDescription>
                    <img
                      src={selected.image}
                      alt={selected.title}
                      className="h-60 object-contain mx-auto my-4"
                    />
                    <p className="text-gray-700">{selected.description}</p>
                    <p className="text-xl font-bold mt-4">
                      Price: ${selected.price}
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => alert("Added to cart!")}>
                    Add to Cart
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
