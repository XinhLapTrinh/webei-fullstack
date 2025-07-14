// src/components/TypeProduct/TypeProduct.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { WrapperType } from "./style";

const TypeProduct = ({ name, slug}) => {
  const navigate = useNavigate();
  return (
    <WrapperType onClick={() => navigate(`/type/${slug}`)}>
      {name}
    </WrapperType>
  );
};

export default TypeProduct;
