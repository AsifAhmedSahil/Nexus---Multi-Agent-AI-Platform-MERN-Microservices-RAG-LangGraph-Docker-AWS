import api from "../../utils/axios";

export const verifyPayment = async (sessionId) => {
  try {
    const { data } = await api.get("/api/billing/verify-payment", {
      params: { session_id: sessionId },
    });
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
