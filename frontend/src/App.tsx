import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Layout,
  Typography,
  Card,
  Button,
  Input,
  Spin,
  message,
  Modal,
  Alert,
} from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import "antd/dist/reset.css"; // Import Ant Design styles

const { Header, Content } = Layout;
const { TextArea } = Input;

interface Patient {
  name: string;
  summary: string;
  record: string;
}

const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [providerInput, setProviderInput] = useState<string>("");
  const [alert, setAlert] = useState<string>("");
  const [isLoadingPatients, setIsLoadingPatients] = useState<boolean>(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [estimation, setEstimation] = useState<string>("");
  const [plan, setPlan] = useState<string>("");

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoadingPatients(true);
      try {
        const response = await fetch("http://localhost:8080/get_patients");
        const data = await response.json();
        if (data == null) {
          setAlert(
            "Please provide the OpenAI API key in the backend for the app to work properly. Check the README for more information."
          );
          setIsLoadingPatients(false);
          return;
        }
        setPatients(data);
        setAlert("");
      } catch (error) {
        setAlert(
          "Could not communicate with backend. Make sure it is running. Check the README for more information."
        );
        setIsLoadingPatients(false);
        return;
      }
      setIsLoadingPatients(false);
    };

    fetchPatients();
  }, []);

  const handleShowMore = (record: string) => {
    setModalContent(record);
    setIsModalVisible(true);
  };

  const handleSelect = (id: string) => {
    setSelectedPatientId(id);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedPatientId) {
      message.error("Please select a patient");
      return;
    }
    setIsLoadingSubmit(true);
    try {
      const response = await fetch("http://localhost:8080/process_patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedPatientId, providerInput }),
      });
      const data = await response.json();
      setEstimation(data.estimation);
      setPlan(data.plan);
    } catch (error) {
      message.error("Error processing the data");
      console.error("Error:", error);
    }
    setIsLoadingSubmit(false);
  };

  return (
    <Layout>
      <Header>
        <Typography.Title
          style={{
            color: "white",
            margin: 0,
            textAlign: "center",
            marginTop: "10px",
          }}
          level={3}
        >
          <ProfileOutlined style={{ fontSize: "24px", marginRight: "12px" }} />
          MindGuide
          <ProfileOutlined style={{ fontSize: "24px", marginLeft: "12px" }} />
        </Typography.Title>
      </Header>
      {alert ? (
        <Alert message="Error" description={alert} type="error" showIcon />
      ) : null}
      {isLoadingPatients ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px" }}>
          {patients.map((patient) => (
            <Col key={patient.name} xs={24} sm={12} md={8}>
              <Card
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {patient.name}
                    <img
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      alt="profile"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "15%",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                    />
                  </div>
                }
                style={{
                  borderRadius: "8px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderColor: selectedPatientId === patient.name ? "blue" : "",
                }}
              >
                <div
                  style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography.Paragraph>{patient.summary}</Typography.Paragraph>
                  <div
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      onClick={() => handleShowMore(patient.record)}
                      style={{ marginRight: "10px" }}
                    >
                      Show more
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => handleSelect(patient.name)}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Content style={{ padding: "50px", maxWidth: "800px", margin: "auto" }}>
        <form onSubmit={handleSubmit}>
          <TextArea
            rows={4}
            placeholder="Provider Input"
            value={providerInput}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setProviderInput(e.target.value)
            }
            style={{ marginTop: "20px", marginBottom: "20px" }}
          />
          <Button type="primary" htmlType="submit" disabled={isLoadingSubmit}>
            {isLoadingSubmit ? <Spin size="small" /> : "Process"}
          </Button>
        </form>
        {estimation && (
          <Card
            style={{ marginTop: "30px", borderRadius: "8px" }}
            title="Estimation"
          >
            <ReactMarkdown>{estimation}</ReactMarkdown>
          </Card>
        )}

        {plan && (
          <Card style={{ marginTop: "30px", borderRadius: "8px" }} title="Plan">
            <ReactMarkdown>{plan}</ReactMarkdown>
          </Card>
        )}
      </Content>
      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <ReactMarkdown>{modalContent}</ReactMarkdown>
      </Modal>
    </Layout>
  );
};

export default App;
