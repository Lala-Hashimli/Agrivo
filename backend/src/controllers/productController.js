import * as productService from "../services/productService.js";

export async function listProducts(req, res) {
  const products = await productService.listProducts(req.query);

  res.json({
    success: true,
    count: products.length,
    products,
  });
}

export async function getProduct(req, res) {
  const product = await productService.getProductById(req.params.id);

  res.json({
    success: true,
    product,
  });
}

export async function listFarmerProducts(req, res) {
  const products = await productService.listProductsByFarmer(req.params.farmerId, req.query);

  res.json({
    success: true,
    count: products.length,
    products,
  });
}

export async function createProduct(req, res) {
  const body = req.body || {};
  const product = await productService.createProduct(req.user.id, body);

  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    product,
  });
}

export async function updateProduct(req, res) {
  const body = req.body || {};
  const product = await productService.updateProduct(req.params.id, req.user, body);

  res.json({
    success: true,
    message: "Product updated successfully.",
    product,
  });
}

export async function deleteProduct(req, res) {
  await productService.deleteProduct(req.params.id, req.user);

  res.json({
    success: true,
    message: "Product deleted successfully.",
  });
}
