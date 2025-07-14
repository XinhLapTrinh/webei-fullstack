// src/pages/HomePage/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Grid } from "antd";
import styled from "styled-components";
import {
  getProducts,
  getCategories,
  getFlashSaleProducts
} from "../../api/productAPI";

import CategoryCarousel from "../../components/CategoryCarousel/CategoryCarousel";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import FlashSaleSection from "../../components/FlashSaleSection/FlashSaleSection";
import ProductSection from "../../components/ProductSection/ProductSection";
import BlogSection from "../../components/BlogSection/BlogSection";

import slider1 from "../../assets/images/slide1.jpg";
import slider2 from "../../assets/images/slide2.webp";
import slider3 from "../../assets/images/slide3.png";
import slider4 from "../../assets/images/slide4.png";
import NewestProducts from "../../components/NewestProducts/NewestProducts";
// import ChatBox from "../../components/ChatBox/ChatBox";
import FloatingChat from "../../components/FloatingChat/FloatingChat";
import ReviewestProduct from "../../components/ReviewestProduct/ReviewestProduct";

const { useBreakpoint } = Grid;

const Wrapper = styled.div`
  padding: ${({ isMobile }) => (isMobile ? "12px" : "0 40px")};
  background-color: #f9f9f9;
  min-height: 100vh;
`;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [flashProducts, setFlashProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const screens = useBreakpoint();

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data.products || []);
    });
    getCategories().then((data) => {
      setCategories(data || []);
      console.log('category', categories);
      
    });
    getFlashSaleProducts().then((data) => {
      setFlashProducts(data || []);
    });
  }, []);

  return (
    <Wrapper isMobile={screens.xs}>
      {/* 1. Danh mục cuộn ngang */}
      <CategoryCarousel categories={categories} />

      {/* 2. Slider quảng cáo */}
      <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: "24px" }}>
        <SliderComponent arrImages={[slider1, slider2, slider3, slider4]} />
      </div>
      {flashProducts.length > 0 && (
        <FlashSaleSection products={flashProducts} />
      )}
      <NewestProducts title="Sản phẩm mới nhất"/>
      <ProductSection title="Gợi ý hôm nay" products={products.slice(0, 8)} />
      {/* <FloatingChat username="Khách hàng" /> */}

      <ReviewestProduct title=" Đánh giá tốt nhất " products={products}/>

      <BlogSection />

    </Wrapper>
  );
};

export default HomePage;
