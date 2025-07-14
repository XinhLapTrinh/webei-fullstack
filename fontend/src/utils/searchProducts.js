// utils/searchProducts.js
import { getProducts } from "../api/productAPI";

export async function searchProducts(keyword) {
  try {
    const res = await getProducts(keyword); // gọi API có hỗ trợ ?search=
    const products = res.products || res;

    const lowerKeyword = keyword.toLowerCase();

    return products.filter((product) =>
      product.name.toLowerCase().includes(lowerKeyword)
    );
  } catch (error) {
    console.error("❌ Lỗi tìm kiếm sản phẩm:", error);
    return [];
  }
}

// // utils/searchProducts.js
// import { getProducts } from "../api/productAPI";

// export async function searchProducts(keyword) {
//   try {
//     const res = await getProducts(keyword);
//     return res.products || res;
//   } catch (error) {
//     console.error("❌ Lỗi tìm kiếm sản phẩm:", error);
//     return [];
//   }
// }
