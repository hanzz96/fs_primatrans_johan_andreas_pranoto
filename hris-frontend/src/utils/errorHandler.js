import { toast } from "react-toastify";

export function handleApiError(error) {
  // Check if it’s an Axios error with response
  const status = error?.response?.status;
  const data = error?.response?.data;
  console.log(error,'error')
  console.log(status,'status');
  console.log(data,'data');
  if (status >= 400 && status < 500) {
    // Client errors
    let message = "Something went wrong!";
    if (data?.errors) {
      // Laravel validation errors
      message = Object.values(data.errors).flat().join("\n");
    } else if (data?.message) {
      message = data.message;
    }
    toast.error(message);
  } else {
    // Server or unknown errors
    const message = data?.message || error.message || "Server error occurred!";
    toast.error(message);
  }
}