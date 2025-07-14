import { Input } from "antd";
import React from "react";

const InputComponent = ({size,placeholder, style, ...rests}) => {
    return(
        <Input
            style={style}
            size={size} 
            placeholder={placeholder}
            {...rests}
        />
    )
}
export default InputComponent