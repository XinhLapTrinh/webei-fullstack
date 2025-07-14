import { useEffect, useState } from "react";
import { Image } from "antd";
import { ThumbnailListContainer, ThumbnailWrapper } from "./style";

const ProductImageGallery = ({ product }) => {
  // ✅ Ghép ảnh chính và phụ
  const rawImages = [
    ...(product?.mainImage ? [product.mainImage] : []),
    ...(product?.subImages || []),
  ];

  // ✅ Thêm đường dẫn đầy đủ
  const images = rawImages.map((img) =>
    img.startsWith("http") ? img : `http://localhost:5000/uploads/${img}`
  );

  const [mainImage, setMainImage] = useState(images[0] || "/images/default-placeholder.png");

  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [product]);

  return (
    <div>
      <Image
        src={mainImage}
        preview
        fallback="/images/default-placeholder.png"
        style={{
          width: "100%",
          height: 400,
          objectFit: "contain",
          backgroundColor: "#fff",
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 8,
        }}
      />

      <ThumbnailListContainer>
        {images.map((img, idx) => (
          <ThumbnailWrapper
            key={idx}
            active={img === mainImage}
            onClick={() => setMainImage(img)}
          >
            <Image
              src={img}
              preview={false}
              fallback="/images/default-placeholder.png"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </ThumbnailWrapper>
        ))}
      </ThumbnailListContainer>
    </div>
  );
};

export default ProductImageGallery;
