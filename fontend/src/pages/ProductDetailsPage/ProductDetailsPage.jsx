import React from "react";
import { useParams } from "react-router-dom";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";

const ProductDetailsPage = () => {
  const { id } = useParams();

  return <ProductDetailsComponent productId={id} />;
};

export default ProductDetailsPage;
