// // src/components/UploadImageField/UploadImageField.jsx
// import React from "react";
// import { Upload } from "antd";
// import { PlusOutlined } from "@ant-design/icons";

// const UploadImageField = ({ value = [], onChange, max = 1 }) => {
//   const handleChange = ({ fileList }) => {
//     // Giới hạn số lượng tối đa
//     if (fileList.length <= max) {
//       onChange(fileList);
//     }
//   };

//   return (
//     <Upload
//       listType="picture-card"
//       fileList={value}
//       onChange={handleChange}
//       beforeUpload={() => false} // Không upload ngay
//       multiple={max > 1} // Cho phép chọn nhiều nếu max > 1
//     >
//       {value.length >= max ? null : (
//         <div>
//           <PlusOutlined />
//           <div style={{ marginTop: 8 }}>Tải ảnh</div>
//         </div>
//       )}
//     </Upload>
//   );
// };

// export default UploadImageField;


import React from "react";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const UploadImageField = ({ value = [], onChange, max = 1 }) => {
  const handleChange = ({ fileList }) => {
    // Giới hạn số lượng ảnh
    if (fileList.length <= max) {
      onChange?.(fileList);
    } else {
      message.warning(`Chỉ cho phép tối đa ${max} ảnh`);
    }
  };

  return (
    <Upload
      listType="picture-card"
      fileList={value}
      onChange={handleChange}
      beforeUpload={() => false} // Không upload ngay
      multiple={max > 1}
      accept="image/*"
    >
      {value.length >= max ? null : (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Tải ảnh</div>
        </div>
      )}
    </Upload>
  );
};

export default UploadImageField;

