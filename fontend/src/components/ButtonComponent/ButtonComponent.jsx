import { Button } from "antd";
import React from "react";

const ButtonComponent = ({size,textButton, style,type,icon, ...rests}) => {
    return(
        <Button
             type={type} 
             style={style} 
             size={size}
             icon={icon}
             {...rests} 
            >{textButton}</Button>
    )
}
export default ButtonComponent