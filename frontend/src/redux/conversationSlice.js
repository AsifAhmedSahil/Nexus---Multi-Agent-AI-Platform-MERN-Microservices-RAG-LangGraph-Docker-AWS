import {createSlice} from "@reduxjs/toolkit"
const conversationSlice = createSlice({
    name:"conversation",
    initialState:{
        conversations:[],
        selectedConversation:null
    },
    reducers:{
       setConversations:(state,action)=>{
        state.conversations = action.payload
       },
       addConversations:(state,action)=>{
        state.conversations.unshift(action.payload) 
       },
       setSelectedConversation:(state,action)=>{
        state.selectedConversation = action.payload 
       }
    }
}) 

export const {setConversations,addConversations,setSelectedConversation} = conversationSlice.actions
export default conversationSlice.reducer