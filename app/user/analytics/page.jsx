"use client";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Layout, Row, Col, Card, Table, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import http from "@app/api-services/httpService";
import "chart.js/auto";
const { Content } = Layout;

const AnalyticsPage = () => {
  const [userData, setUserData] = useState([]);
  const [organizationData, setOrganizationData] = useState([]);
  const [lastWeekUserData, setLastWeekUserData] = useState([]);
  const [lastWeekOrganizationData, setLastWeekOrganizationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (userData.length > 0 && organizationData.length > 0) {
      processLastWeekData();
    }
  }, [userData, organizationData]);

  const fetchData = async () => {
    try {
      const [userResponse, organizationResponse] = await Promise.all([
        http.get("https://developer.ethiotelecom.et/v2/user"),
        http.get("https://developer.ethiotelecom.et/v2/merchant-info"),
      ]);
      setUserData(userResponse.data);
      setOrganizationData(organizationResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const processLastWeekData = () => {
    const currentDate = new Date();
    const oneWeekAgo = new Date(
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    const lastWeekUserData = userData.filter((item) => {
      const createdAtDate = new Date(item.createdAt);
      return createdAtDate >= oneWeekAgo;
    });

    const lastWeekOrganizationData = organizationData.filter((item) => {
      const createdAtDate = new Date(item.createdAt);
      return createdAtDate >= oneWeekAgo;
    });

    setLastWeekUserData(lastWeekUserData);
    setLastWeekOrganizationData(lastWeekOrganizationData);
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // Callback function for pagination change
  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  // Calculate the correct index based on current page and page size
  const calculateIndex = (recordIndex) => {
    const { current, pageSize } = pagination;
    return (current - 1) * pageSize + recordIndex + 1;
  };

  const prepareLastWeekChartData = () => {
    const currentDate = new Date();
    const oneWeekAgo = new Date(
      currentDate.getTime() - 90 * 24 * 60 * 60 * 1000
    );

    const lastWeekUserData = userData.filter((item) => {
      const createdAtDate = new Date(item.createdAt);
      // return createdAtDate >= oneWeekAgo;
      return createdAtDate;
    });

    const lastWeekOrganizationData = organizationData.filter((item) => {
      const createdAtDate = new Date(item.createdAt);
      return createdAtDate >= oneWeekAgo;
    });

    const labels = [
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
      "Monday",
    ];

    const lastWeekUserDataCounts = countRegistrations(lastWeekUserData);
    const lastWeekOrganizationDataCounts = countRegistrations(
      lastWeekOrganizationData
    );

    const userDataValues = labels.map(
      (day, index) => lastWeekUserDataCounts[index] || 0
    );
    const organizationDataValues = labels.map(
      (day, index) => lastWeekOrganizationDataCounts[index] || 0
    );

    return {
      labels,
      userDataValues,
      organizationDataValues,
      lastWeekUserData,
      lastWeekOrganizationData,
    };
  };

  const countRegistrations = (data) => {
    const counts = new Array(90).fill(0);
    data.forEach((item) => {
      const createdAtDate = new Date(item.createdAt);
      const dayOfWeek = createdAtDate.getDay();
      counts[dayOfWeek]++;
    });
    return counts;
  };

  const {
    labels: lastLabels,
    userDataValues,
    organizationDataValues,
  } = prepareLastWeekChartData();

  // Columns for user table
  const userColumns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => calculateIndex(index),
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Tel",
      dataIndex: "tel",
      key: "tel",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  // Columns for organization table
  const organizationColumns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => calculateIndex(index),
    },
    {
      title: "companyName",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "contactPersonName",
      dataIndex: "contactPersonName",
      key: "contactPersonName",
    },
    {
      title: "contactPhone",
      dataIndex: "contactPhone",
      key: "contactPhone",
    },
    {
      title: "contactEmail",
      dataIndex: "contactEmail",
      key: "contactEmail",
    },
    {
      title: "short_code",
      dataIndex: "short_code",
      key: "short_code",
    },
  ];

  // Function to generate the CSV content
  const generateCSVContent = (dataSource, columns) => {
    const header = columns.map((column) => column.title);
    const data = dataSource.map((record) =>
      columns.map((column) => record[column.dataIndex])
    );

    const csvContent = [
      header.join(","),
      ...data.map((row) => row.join(",")),
    ].join("\n");

    return csvContent;
  };

  // Function to download CSV file
  const downloadCSV = (dataSource, columns, fileName) => {
    const csvContent = generateCSVContent(dataSource, columns);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  // Render the Download Excel button for the table
  const ExportCSV = ({ dataSource, columns, fileName }) => {
    const handleDownload = () => {
      downloadCSV(dataSource, columns, fileName);
    };

    return (
      <Button icon={<DownloadOutlined />} onClick={handleDownload}>
        Download Excel
      </Button>
    );
  };

  return (
    <Layout>
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <div style={{ background: "#fff", padding: 24, minHeight: 380 }}>
          <h2>Developer Portal Analytics</h2>
          <Row gutter={16}>
            <Col span={24}>
              <Card>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <Bar
                    data={{
                      labels: lastLabels,
                      datasets: [
                        {
                          label: "Registered Users",
                          backgroundColor: "rgba(0, 158, 115, 0.5)",
                          data: userDataValues,
                        },
                        {
                          label: "Registered Organizations",
                          backgroundColor: "rgba(255, 159, 64, 0.5)",
                          data: organizationDataValues,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: "Day",
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: "Registrations",
                          },
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                )}
              </Card>
            </Col>
          </Row>

          <div style={{ marginTop: 24 }}>
            <h2>User's Data</h2>
            <Table
              dataSource={lastWeekUserData.map((record, index) => ({
                ...record,
                index: calculateIndex(index),
              }))}
              columns={userColumns}
              pagination={{
                ...pagination,
                onChange: handlePaginationChange,
              }}
              footer={() => (
                <ExportCSV
                  dataSource={lastWeekUserData}
                  columns={userColumns}
                  fileName="users_data.csv"
                />
              )}
            />

            {/* <Table dataSource={lastWeekUserData} columns={userColumns} /> */}
          </div>

          <div style={{ marginTop: 24 }}>
            <h2>OrganizationData's Data</h2>
            <Table
              dataSource={lastWeekOrganizationData.map((record, index) => ({
                ...record,
                index: calculateIndex(index),
              }))}
              columns={organizationColumns}
              pagination={{
                ...pagination,
                onChange: handlePaginationChange,
              }}
              footer={() => (
                <ExportCSV
                  dataSource={lastWeekOrganizationData}
                  columns={organizationColumns}
                  fileName="organization_data.csv"
                />
              )}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AnalyticsPage;
