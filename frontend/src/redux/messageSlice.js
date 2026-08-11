import {createSlice} from "@reduxjs/toolkit"
const messageSlice = createSlice({
    name:"message",
    initialState:{
        messages:[],
        artifacts:[],
        typing:false
    },
    reducers:{
       setMessages:(state,action)=>{
        state.messages = action.payload
       },
       addMessages:(state,action)=>{
        state.messages.push(action.payload)
       },
       setArtifacts:(state,action)=>{
        state.artifacts=action.payload 
       },
       setTyping:(state,action)=>{
        state.typing=action.payload 
       }
       
    }
}) 

export const {setMessages,addMessages,setArtifacts,setTyping} = messageSlice.actions
export default messageSlice.reducer