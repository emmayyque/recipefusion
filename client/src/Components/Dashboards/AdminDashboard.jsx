import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import * as Icons from "react-icons/fa6";
import Chart from "react-apexcharts";
import Sidebar from "../Dashboards/Sidebar.jsx";
import axios from "axios";
import Loader from "../Loader";
const baseURL = import.meta.env.VITE_NODE_URL

import { AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,} from "recharts";

function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [recipesCount, setRecipesCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [reviewStats, setReviewStats] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
  });
  const [searchStats, setSearchStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          usersRes,
          recipesRes,
          reviewsRes,
          reviewStatsRes,
          searchStatsRes,
        ] = await Promise.all([
          axios.get(`${baseURL}/api/users/all-users`, {
            withCredentials: true,
          }),
          axios.get(`${baseURL}/api/recipes/all-recipes`, {
            withCredentials: true,
          }),
          axios.get(`${baseURL}/api/reviews/all-reviews`, {
            withCredentials: true,
          }),
          axios.get(`${baseURL}/api/reviews/reviews-stats`, {
            withCredentials: true,
          }),
          axios.get(`${baseURL}/api/searchHistory/all-searches`, {
            withCredentials: true,
          }),
        ]);

        setUsersCount(usersRes.data.length);
        setRecipesCount(recipesRes.data.length);
        setReviewsCount(reviewsRes.data.length);

        const stats = reviewStatsRes.data.reduce(
          (acc, item) => {
            acc[item._id] = item.count;
            return acc;
          },
          { positive: 0, neutral: 0, negative: 0 }
        );
        setReviewStats(stats);

        const groupedByDate = groupSearchesByDate(searchStatsRes.data);
        setSearchStats(groupedByDate);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const groupSearchesByDate = (searches) => {
    const grouped = searches.reduce((acc, search) => {
      const date = new Date(search.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, count]) => ({
      name: date,
      searches: count,
    }));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div
        className="admin-dashboard"
        style={{
          flexGrow: 1,
          padding: "20px",
          display: "flex",
          justifyContent: loading ? "center" : "flex-start",
          alignItems: loading ? "center" : "flex-start",
        }}
      >
        {loading ? (
          <Loader />
        ) : (
          <div style={{ width: "100%" }}>
            <div className="row jc-between">
              <h3 className="greeting">Welcome Admin</h3>
            </div>

            <div className="cards-container jc-evenly">
              <DashboardCard
                title="Total Users"
                count={usersCount}
                icon={<Icons.FaUser />}
              />
              <DashboardCard
                title="Recipes"
                count={recipesCount}
                icon={<Icons.FaReceipt />}
              />
              <DashboardCard
                title="Reviews"
                count={reviewsCount}
                icon={<Icons.FaStar />}
              />
            </div>

            <div className="dashboard-content">
              <BarChart reviewStats={reviewStats} />
              <SearchHistoryChart searchStats={searchStats} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const DashboardCard = ({ title, count, icon }) => (
  <div className="card row jc-between">
    <div className="card-left">
      <h4 className="card-heading">{title}</h4>
      <p className="count">{count}</p>
    </div>
    <div className="card-right">
      <div className="icons card-icons">{icon}</div>
    </div>
  </div>
);

function BarChart({ reviewStats }) {
  const { positive, neutral, negative } = reviewStats;

  const sentimentData = [positive, neutral, negative];
  const sentimentCategories = ["Positive", "Neutral", "Negative"];
  const sentimentColors = ["#28a745", "#6c757d", "#dc3545"];

  return (
    <div className="barchart">
      <h3 className="barchart-header">
        <Icons.FaStar className="icons-colored" /> Reviews
      </h3>
      <div className="barchart-container">
        <Chart
          type="bar"
          width={"100%"}
          height={300}
          series={[{ data: sentimentData }]}
          options={{
            plotOptions: {
              bar: {
                columnWidth: "45%",
                distributed: true,
              },
            },
            colors: sentimentColors,
            theme: { mode: "light" },
            xaxis: {
              categories: sentimentCategories,
              labels: {
                style: {
                  fontSize: 14,
                  fontWeight: "550",
                  colors: sentimentColors,
                },
              },
            },
            yaxis: {
              min: 0,
              tickAmount: Math.ceil(Math.max(...sentimentData) / 5) || 1,
              labels: {
                formatter: (val) => `${val}`,
                style: {
                  fontSize: 14,
                  fontWeight: "550",
                  colors: ["#333"],
                },
              },
            },
            legend: {
              show: false,
            },
            dataLabels: {
              enabled: true,
              style: {
                colors: ["#fff"],
                fontSize: "14px",
              },
            },
            chart: {
              toolbar: { show: false },
            },
          }}
        />
      </div>
    </div>
  );
}

function SearchHistoryChart({ searchStats }) {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Recipe Generation</h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart
          data={searchStats}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            stroke="#555"
            tick={{ fill: "#bf4c0d", fontSize: 14, fontWeight: 550 }}
          />
          <YAxis
            stroke="#555"
            domain={[0, (dataMax) => Math.ceil(dataMax / 5) * 5]}
            tick={{
              fill: "#bf4c0d",
              fontSize: 14,
              fontWeight: 550,
            }}
            ticks={Array.from(
              {
                length:
                  Math.ceil(
                    (Math.max(...searchStats.map((s) => s.searches)) || 1) / 5
                  ) + 1,
              },
              (_, i) => i * 5
            )}
          />

          <Tooltip />
          <Area
            type="monotone"
            dataKey="searches"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AdminDashboard;
