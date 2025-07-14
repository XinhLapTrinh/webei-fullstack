import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Row, Col, Card, Spin, Typography, Empty, Button } from "antd";
import { getProducts } from "../../api/productAPI"; // ✅ Gọi từ API thật
import CardComponent from "../../components/CardComponent/CardComponent";

const { Title, Text } = Typography;

const SearchResultsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchResults = async () => {
      if (keyword.trim()) {
        setLoading(true);
        try {
          const res = await getProducts({ keyword });
          setResults(res.products || []);
        } catch (error) {
          console.error("Lỗi tìm kiếm:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    };

    fetchResults();
  }, [keyword]);
  
  return (
    <div style={{ padding: "24px 40px" }}>
      <Title level={3}>
        Kết quả tìm kiếm cho: <Text type="danger">"{keyword}"</Text>
      </Title>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 60 }}>
          <Spin size="large" tip="Đang tìm kiếm..." />
        </div>
      ) : results.length === 0 ? (
        <Empty
          description={<span>Không tìm thấy sản phẩm phù hợp</span>}
          style={{ marginTop: 80 }}
        >
          <Link to="/">
            <Button type="primary">Quay lại trang chủ</Button>
          </Link>
        </Empty>
      ) : (
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          {results.map((item) =>(
            <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
              <CardComponent 
                id={item._id}
                name={item.name}
                price={item.price}
                sold={item.sold}
                rating={item.rating}
                discount={item.discount}
                image={item.mainImage}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default SearchResultsPage;



// import React, { useEffect, useState } from "react";
// import { useLocation, Link } from "react-router-dom";
// import { Row, Col, Card, Spin, Typography, Empty, Button } from "antd";
// import { searchProducts } from "../../utils/searchProducts";

// const { Title, Text } = Typography;

// const SearchResultsPage = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const q = queryParams.get("q") || "";

//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchResults = async () => {
//       if (q.trim()) {
//         setLoading(true);
//         try {
//           const filtered = await searchProducts(q); // ✅ gọi đúng async
//           setResults(filtered);
//         } catch (error) {
//           console.error("Lỗi tìm kiếm:", error);
//           setResults([]);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setResults([]);
//       }
//     };

//     fetchResults();
//   }, [q]);

//   return (
//     <div style={{ padding: "24px 40px" }}>
//       <Title level={3} style={{ marginBottom: 16 }}>
//         Kết quả tìm kiếm cho: <Text type="danger">"{q}"</Text>
//       </Title>

//       {loading ? (
//         <div style={{ textAlign: "center", marginTop: 60 }}>
//           <Spin size="large" tip="Đang tìm kiếm..." />
//         </div>
//       ) : results.length === 0 ? (
//         <Empty
//           description={<span>Không tìm thấy sản phẩm phù hợp</span>}
//           style={{ marginTop: 80 }}
//         >
//           <Link to="/">
//             <Button type="primary">Quay lại trang chủ</Button>
//           </Link>
//         </Empty>
//       ) : (
//         <Row gutter={[24, 24]}>
//           {results.map((item) => (
//             <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
//               <Link to={`/product-details/${item._id}`} style={{ textDecoration: "none" }}>
//                 <Card
//                   hoverable
//                   style={{
//                     borderRadius: 10,
//                     overflow: "hidden",
//                     transition: "0.3s",
//                   }}
//                   cover={
//                     <img
//                       alt={item.name}
//                       src={`http://localhost:5000/uploads/${item.images?.[0]}`}
//                       style={{
//                         height: 200,
//                         objectFit: "cover",
//                         transition: "transform 0.3s",
//                       }}
//                       onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//                       onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
//                     />
//                   }
//                 >
//                   <Card.Meta
//                     title={
//                       <Text strong ellipsis style={{ display: "block" }}>
//                         {item.name}
//                       </Text>
//                     }
//                     description={
//                       <Text style={{ color: "#ff4d4f", fontWeight: 500 }}>
//                         {item.price.toLocaleString("vi-VN")} ₫
//                       </Text>
//                     }
//                   />
//                 </Card>
//               </Link>
//             </Col>
//           ))}
//         </Row>
//       )}
//     </div>
//   );
// };

// export default SearchResultsPage;
