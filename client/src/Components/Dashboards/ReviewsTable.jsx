import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DataTable from "./DataTable";
import * as Icons from "react-icons/fa6";
import axios from "axios";
const baseURL = import.meta.env.VITE_NODE_URL

const reviewColumns = [
  { label: "Title", key: "title" },
  { label: "Review", key: "review" },
  { label: "Username", key: "userId.username" },
  { label: "Email", key: "userId.email" },
  { label: "Rating", key: "sentiment" },
  
];

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/reviews/all-reviews`);

        if (Array.isArray(res.data)) {
          setReviews(res.data);
        } else if (Array.isArray(res.data.reviews)) {
          setReviews(res.data.reviews);
        } else {
          setReviews([]);
        }

      } catch (error) {
        console.error("Error fetching reviews:", error.message);
        Swal.fire("Error", "Failed to fetch reviews", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (review) => {
    Swal.fire({
      title: `Delete review by ${review.userId.username}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseURL}/api/reviews/reviews/` + review.userId._id + "/" + review.recipeId);

          setReviews((prev) =>
            prev.filter(
              (r) =>
                !(
                  r.userId._id === review.userId._id &&
                  r.recipeId === review.recipeId
                )
            )
          );

          Swal.fire("Deleted!", "The review has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting review:", error.message);
          Swal.fire("Error", "Failed to delete review", "error");
        }
      }
    });
  };

  const reviewActions = [
    { label: "Delete", icon: <Icons.FaTrash />, onClick: handleDelete },
    
  ];

  return (
    <DataTable
      title="Reviews"
      data={Array.isArray(reviews) ? reviews : []}
      columns={reviewColumns}
      actions={reviewActions}
      loading={loading}
    />
  );
}

export default ReviewsPage;
