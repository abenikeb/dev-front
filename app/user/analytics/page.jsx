"use client";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Layout, Row, Col, Card, Table, Button, Input, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import http from "@app/api-services/httpService";
import "chart.js/auto";
import copy from "copy-to-clipboard";
const { Content } = Layout;
const { Search } = Input;

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

  const prepareLastWeekChartData = () => {
    const currentDate = new Date();
    const threeMonthsAgo = new Date(
      currentDate.getTime() - 150 * 24 * 60 * 60 * 1000
    );

    const lastThreeMonthsUserData = userData.filter((item) => {
      const createdAtDate = new Date(item.createdAt);
      return createdAtDate >= threeMonthsAgo;
    });

    const lastThreeMonthsOrganizationData = organizationData.filter((item) => {
      const createdAtDate = new Date(item.createdAt);
      return createdAtDate >= threeMonthsAgo;
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

    const lastThreeMonthsUserDataCounts = countRegistrations(
      lastThreeMonthsUserData
    );
    const lastThreeMonthsOrganizationDataCounts = countRegistrations(
      lastThreeMonthsOrganizationData
    );

    const userDataValues = labels.map(
      (day, index) => lastThreeMonthsUserDataCounts[index] || 0
    );
    const organizationDataValues = labels.map(
      (day, index) => lastThreeMonthsOrganizationDataCounts[index] || 0
    );

    return {
      labels,
      userDataValues,
      organizationDataValues,
      lastWeekUserData: lastThreeMonthsUserData,
      lastWeekOrganizationData: lastThreeMonthsOrganizationData,
    };
  };

  const handleCopy = (text) => {
    copy(text); // Copy the text to clipboard
    message.success("TenantId copied to clipboard");
  };

  const processLastWeekData = () => {
    const currentDate = new Date();
    const oneWeekAgo = new Date(
      currentDate.getTime() - 150 * 24 * 60 * 60 * 1000
    );

    const lastWeekUserData = userData.filter((user) => {
      const createdAtDate = new Date(user.createdAt);
      return createdAtDate >= oneWeekAgo;
    });

    const lastWeekOrganizationData = organizationData.filter((item) => {
      const createdAtDate = new Date(item.createdAt);
      return createdAtDate >= oneWeekAgo;
    });

    const lastWeekUserDataWithCreatedOrg = lastWeekUserData.map((user) => {
      const createdOrg = lastWeekOrganizationData.find(
        (org) => org.contactEmail === user.email
      );
      return {
        ...user,
        created_org: createdOrg ? createdOrg.companyName : null,
      };
    });

    setLastWeekUserData(lastWeekUserDataWithCreatedOrg);
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
      render: (text) => `+251 ${text}`,
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text) => (
        <Tag
          color={text === "Admin" ? "cyan" : "orange"}
          style={{ fontWeight: "normal" }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Org Name",
      dataIndex: "created_org",
      key: "created_org",
      render: (text, record) => {
        const boldStyle = text
          ? { fontWeight: "normal", color: "black" }
          : { fontWeight: "normal", color: "gray" };
        return <span style={boldStyle}>{text ? text : "Not Created"}</span>;
      },
    },
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) => {
        const date = new Date(text);
        const options = { month: "short", day: "2-digit", year: "numeric" };
        return date.toLocaleDateString("en-US", options);
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag
          color={text === "approved" ? "green" : "orange"}
          style={{ fontWeight: "normal" }}
        >
          {text}
        </Tag>
      ),
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
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "TenantId",
      dataIndex: "axisTenantId",
      key: "axisTenantId",
      render: (text, record) => (
        <>
          <span>
            {text && text.length > 13 ? text.slice(0, 13) + "..." : text}
          </span>
          {text && (
            <Button
              icon={<CopyOutlined />}
              onClick={() => handleCopy(text)}
              style={{ marginLeft: 8 }}
            />
          )}
        </>
      ),
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

  const filterUserData = (value) => {
    const filteredData = userData.filter(
      (user) =>
        user.firstName.toLowerCase().includes(value.toLowerCase()) ||
        user.lastName.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase()) ||
        user.tel.toLowerCase().includes(value.toLowerCase()) ||
        user.role.toLowerCase().includes(value.toLowerCase()) ||
        user.status.toLowerCase().includes(value.toLowerCase())
    );
    setLastWeekUserData(filteredData);
  };

  // Function to filter organization data based on search input
  const filterOrganizationData = (value) => {
    const filteredData = organizationData.filter((org) =>
      (
        org.companyName.toLowerCase() +
        org.contactPersonName.toLowerCase() +
        org.contactPhone.toLowerCase() +
        org.contactEmail.toLowerCase() +
        org.short_code.toString().toLowerCase()
      ).includes(value.toLowerCase())
    );
    setLastWeekOrganizationData(filteredData);
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
          <br />
          <div style={{ marginTop: 24 }}>
            <Row gutter={16} align="middle">
              <Col span={12}>
                <h2 style={{ color: "#aaa" }}>User's Data</h2>
              </Col>
              <Col span={12}>
                <Search
                  placeholder="Search user data"
                  allowClear
                  enterButton={<SearchOutlined style={{ color: "green" }} />}
                  onSearch={filterUserData}
                  style={{ marginBottom: 16, width: "100%" }}
                  enterButtonStyle={{ background: "green", border: "none" }}
                />
              </Col>
            </Row>
            <hr />
            <br />
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
              onChange={(pagination, filters, sorter, extra) => {
                //console.log("params", pagination, filters, sorter, extra);
              }}
            />

            {/* <Table dataSource={lastWeekUserData} columns={userColumns} /> */}
          </div>

          <div style={{ marginTop: 24 }}>
            <Row gutter={16} align="top">
              <Col span={12}>
                <h2 style={{ color: "#aaa" }}>OrganizationData's Data</h2>
              </Col>
              <Col span={12}>
                <Search
                  placeholder="Search organization data"
                  allowClear
                  enterButton={<SearchOutlined style={{ color: "green" }} />}
                  onSearch={filterOrganizationData}
                  style={{ marginBottom: 16, width: "100%" }}
                  enterButtonStyle={{ background: "green", border: "none" }}
                />
              </Col>
            </Row>
            <hr />
            <br />

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
              onChange={(pagination, filters, sorter, extra) => {
                //console.log("params", pagination, filters, sorter, extra);
              }}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AnalyticsPage;
