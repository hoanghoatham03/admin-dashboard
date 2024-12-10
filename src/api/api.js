import { axiosInstance } from "../config/axiosConfig";
import { getToken } from "../store/authStore";

//auth
export async function login(email, password) {
  const res = await axiosInstance.post("/auth/login", { email, password });
  return res.data;
}

export async function logout() {
  const token = getToken();
  const res = await axiosInstance.post("/auth/logout", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

//user
//response:
// [
//     {
//         userId: string;
//         firstName: string;
//         lastName: string;
//         mobileNumber: string;
//         email: string;
//         avatar: string;
//     }
// ]
export async function getAllUsers(pageNo = 0, pageSize = 10) {
  const token = getToken();
  const res = await axiosInstance.get(
    `/admin/users?pageNo=${pageNo + 1}&pageSize=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function getUserById(userId) {
  const res = await axiosInstance.get(`/users/${userId}`);
  return res.data;
}

//product
//response:
// {
//     productId: number;
//     productName: string;
//     description: string;
//     stock: number;
//     price: number;
//     discount: number;
//     realPrice: number;
//     categoryId: number;
//     categoryName?: string;
//     comments?: Comment[];
//     images?: ProductImage[];
//     imageUrl: string;
// }
export async function getProducts(pageNo = 0, pageSize = 10) {
  const res = await axiosInstance.get(
    `/products?pageNo=${pageNo + 1}&pageSize=${pageSize}`
  );
  console.log("product res", res.data);
  return res.data;
}

export async function getProductById(productId) {
  const res = await axiosInstance.get(`/products/${productId}`);
  return res.data;
}

export async function createProduct(product) {
  const token = getToken();
  const res = await axiosInstance.post("/admin/products", product, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });
  return res.data;
}

export async function updateProduct(productId, product) {
  const token = getToken();
  console.log(">>>product request:", product);
  const res = await axiosInstance.put(`/admin/products/${productId}`, product, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });
  return res.data;
}

export async function deleteProduct(productId) {
  const token = getToken();
  const res = await axiosInstance.delete(`/admin/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

//category
//response:
// [
//    {
//        categoryId: string;
//        categoryName: string;
//    }
// ]
export async function getAllCategories() {
  const res = await axiosInstance.get("/categories");
  return res.data;
}

export async function getCategoryById(categoryId) {
  const res = await axiosInstance.get(`/categories/${categoryId}`);
  return res.data;
}

export async function createCategory(category) {
  const token = getToken();
  const res = await axiosInstance.post("/admin/categories", category, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function updateCategory(categoryId, category) {
  const token = getToken();
  const res = await axiosInstance.put(
    `/admin/categories/${categoryId}`,
    category,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function deleteCategory(categoryId) {
  const token = getToken();
  const res = await axiosInstance.delete(`/admin/categories/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

//order
//response:
// [
// {
//     orderId: number;
//     orderDate: string;
//     totalAmount: number;
//     orderStatus: string;
//     address: Address;
//     payment: Payment;
//     orderItems: OrderItem[];
//     paymentStatus: string;
// }
// ]
export async function getAllOrders(pageNo = 0, pageSize = 10) {
  const token = getToken();
  const res = await axiosInstance.get(
    `/admin/orders?pageNo=${pageNo + 1}&pageSize=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(">>>order res:", res.data);
  return res.data;
}

// OrderStatus {
//     PENDING,
//     DELIVERED,
//     CANCELLED
// }

export async function updateOrderStatus(userId, orderId, orderStatus) {
  const token = getToken();
  console.log(">>userId:", userId);
  console.log(">>orderId:", orderId);
  console.log(">>orderStatus:", orderStatus);
  console.log(">>token:", token);
  const res = await axiosInstance.put(
    `/admin/users/${userId}/orders/${orderId}/orderStatus?orderStatus=${orderStatus}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

// PaymentStatus {
//     PENDING, SUCCESS, FAILED
// }
export async function updatePaymentStatus(userId, orderId, paymentStatus) {
  const token = getToken();
  const res = await axiosInstance.put(
    `/admin/users/${userId}/orders/${orderId}/paymentStatus?paymentStatus=${paymentStatus}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}
