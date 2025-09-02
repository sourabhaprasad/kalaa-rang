import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import OrderList from "./OrderList";
import Loader from "../../components/loader";
import { FaDollarSign, FaUsers, FaShoppingCart, FaRupeeSign } from "react-icons/fa";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        background: 'transparent',
        foreColor: '#ffffff'
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3
      },
      grid: {
        borderColor: "#374151",
      },
      markers: {
        size: 4,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            color: '#9CA3AF'
          }
        },
        labels: {
          style: {
            colors: '#9CA3AF'
          }
        }
      },
      yaxis: {
        title: {
          text: "Sales (₹)",
          style: {
            color: '#9CA3AF'
          }
        },
        labels: {
          style: {
            colors: '#9CA3AF'
          }
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
        labels: {
          colors: '#ffffff'
        }
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 pt-20">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Overview of your e-commerce platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-black rounded-lg border border-gray-700 shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Sales</p>
                <h3 className="text-3xl font-bold text-white mt-2">
                  {isLoading ? <Loader /> : `₹${sales?.totalSales?.toFixed(2) || '0.00'}`}
                </h3>
              </div>
              <div className="p-3 bg-green-500 rounded-lg">
                <FaRupeeSign className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-black rounded-lg border border-gray-700 shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Customers</p>
                <h3 className="text-3xl font-bold text-white mt-2">
                  {loading ? <Loader /> : customers?.length || 0}
                </h3>
              </div>
              <div className="p-3 bg-blue-500 rounded-lg">
                <FaUsers className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-black rounded-lg border border-gray-700 shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Orders</p>
                <h3 className="text-3xl font-bold text-white mt-2">
                  {loadingTwo ? <Loader /> : orders?.totalOrders || 0}
                </h3>
              </div>
              <div className="p-3 bg-purple-500 rounded-lg">
                <FaShoppingCart className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black rounded-lg border border-gray-700 shadow-xl p-6 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Sales Analytics</h2>
          <div className="w-full">
            <Chart
              options={{
                ...state.options,
                theme: {
                  mode: 'dark'
                },
                chart: {
                  ...state.options.chart,
                  background: 'transparent',
                  foreColor: '#ffffff'
                },
                grid: {
                  borderColor: '#374151'
                },
                xaxis: {
                  ...state.options.xaxis,
                  labels: {
                    style: {
                      colors: '#9CA3AF'
                    }
                  }
                },
                yaxis: {
                  ...state.options.yaxis,
                  labels: {
                    style: {
                      colors: '#9CA3AF'
                    }
                  }
                }
              }}
              series={state.series}
              type="line"
              height={350}
            />
          </div>
        </div>

        <div className="bg-black rounded-lg border border-gray-700 shadow-xl">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Recent Orders</h2>
          </div>
          <OrderList />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;