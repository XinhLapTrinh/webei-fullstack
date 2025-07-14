
import React from "react";
import { Carousel } from "antd";

const SliderComponent = ({ arrImages }) => {
  return (
    <Carousel autoplay>
      {arrImages.map((image, index) => (
        <div key={index}>
          <img
            src={image}
            alt={`Slide ${index}`}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default SliderComponent;
