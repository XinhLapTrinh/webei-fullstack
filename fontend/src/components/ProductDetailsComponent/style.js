import styled from "styled-components";
import { Col } from "antd";

export const WrapperProductDetailsCol = styled(Col)`
  background: #fff;
  padding: 16px;
  border-radius: 8px;
`;

export const ThumbnailListContainer = styled.div`
  display: flex;
  width: 90%;
  overflow-x: auto;
  gap: 12px;
  padding-top: 12px;
`;

export const ThumbnailWrapper = styled.div`
  width: 80px;
  height: 80px;
  flex: 0 0 auto;
  overflow: hidden;
  border: ${(props) =>
    props.active ? "2px solid #1677ff" : "1px solid rgba(0, 0, 0, 0.1)"};
  border-radius: 6px;
  padding: 2px;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
`;



// import { Col, Image } from "antd";
// import styled from "styled-components";

// export const WrapperProductDetails = styled.div`
//     height: 1000px;
//     margin: 10px 50px;
// `

// export const WrapperProductDetailsCol = styled(Col)`
//     width: 100%;
//     height:1000px
// `
// export const ThumbnailListContainer = styled.div`
//   display: flex;
//   overflow-x: auto;
//   gap: 12px;
//   padding: 10px 0;
//   margin-top: 10px;

//   /* Ẩn thanh cuộn nếu muốn */
//   &::-webkit-scrollbar {
//     height: 6px;
//   }

//   &::-webkit-scrollbar-thumb {
//     background: #ccc;
//     border-radius: 4px;
//   }
// `

// export const ThumbnailWrapper = styled.div`
//   width: 80px;
//   height: 80px;
//   flex: 0 0 auto;
//   overflow: hidden;
//   border: ${(props) => (props.active ? "2px solid #1677ff" : "1px solid #ccc")};
//   border-radius: 6px;
//   padding: 2px;
//   cursor: pointer;
//   box-sizing: border-box;
// `