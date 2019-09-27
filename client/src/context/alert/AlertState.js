import React, { useReducer } from "react";
import AlertContext from "./alertContect";
import alertReducer from "./alertReducer";
import uuid from 'uuid';
import {
SET_ALERT,REMOVE_ALERT
} from "../types";


const AlertState = props=>{
const initaialState=[];
const [state,dispatch]= useReducer(alertReducer,initaialState);


const setAlert = (msg,type,timeout=5000)=>{
const id=uuid.v4();
dispatch({
    type:SET_ALERT,payload:{msg,type,id}
});
setTimeout(()=> dispatch({type:REMOVE_ALERT,payload:id}),timeout);
}

return (
    <AlertContext.Provider
    value={{
     alerts:state,
     setAlert

    }}>
        {props.children}
    </AlertContext.Provider>
)
}

export default AlertState;