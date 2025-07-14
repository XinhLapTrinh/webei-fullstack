import React, { useEffect, useState } from "react";
import { getProducts } from "../../api/productAPI";
import CardComponent from "../CardComponent/CardComponent"; // Đảm bảo đã import đúng
import { Spin, Empty, Row, Col } from "antd";



const NewestProducts = ({title}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewest = async () => {
      try {
        const res = await getProducts({ sort: "-createdAt", limit: 8 });
        setProducts(res.products || []);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm mới nhất:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewest();
  }, []);

  return (
    <div className="px-4 py-6" style={{marginTop:'20px'}}>
        <h2 style={{fontSize:'24px',marginBottom:'20px', textAlign:'center'}}>{title}</h2>
      {loading ? (
        <Spin size="large" tip="Đang tải..." />
      ) : products.length === 0 ? (
        <Empty description="Không có sản phẩm mới." />
      ) : (
        <Row gutter={[16, 24]}>
          {products.map((product) => (
            <Col xs={24} sm={12} lg={6} key={product._id}>
              <CardComponent
                id={product._id}
                name={product.name}
                price={product.price}
                discount={product.discount}
                sold={product.sold}
                rating={product.rating}
                image={product.mainImage}
                description={product.description}
                category={product.category}
                status={product.status} // Nếu cần thêm trường status
                flashSale={product.flashSale}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default NewestProducts;
