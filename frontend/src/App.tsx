import React, { useState } from 'react';
import { Layout, Menu, Typography, Upload, Button, Input, Spin, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';  // Import Ant Design styles

const { Header, Content } = Layout;
const { TextArea } = Input;

const App: React.FC = () => {
  const [patientRecord, setPatientRecord] = useState<string>('');
  const [providerInput, setProviderInput] = useState<string>('');
  const [estimation, setEstimation] = useState<string>('');
  const [plan, setPlan] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (info: any) => {
    const file = info.file.originFileObj || info.file; 
    if (file instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result;
        setPatientRecord(typeof text === 'string' ? text : '');
        message.success(`${info.file.name} uploaded successfully`);
      };
      reader.readAsText(file);
    } else {
      message.error('Failed to read the file. Please try again.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientRecord, providerInput }),
      });
      const data = await response.json();
      setEstimation(data.estimation);
      setPlan(data.plan);
    } catch (error) {
      message.error('Error processing the data');
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <Header>
        <Typography.Title style={{ color: 'white', margin: 0, textAlign: 'center' }} level={3}>
          Mind-Guide
        </Typography.Title>
      </Header>
      <Content style={{ padding: '50px', maxWidth: '800px', margin: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <Upload
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleFileChange}
            accept=".txt"
          >
            <Button icon={<UploadOutlined />}>Upload Patient Record</Button>
          </Upload>
          {patientRecord && (
            <Typography.Paragraph>
              File uploaded: {patientRecord.slice(0, 20)}...
            </Typography.Paragraph>
          )}
          <TextArea
            rows={4}
            placeholder="Provider Input"
            value={providerInput}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProviderInput(e.target.value)}
            style={{ marginTop: '20px', marginBottom: '20px' }}
          />
          <Button type="primary" htmlType="submit" disabled={isLoading}>
            {isLoading ? <Spin size="small" /> : 'Process'}
          </Button>
        </form>

        {estimation && (
          <div style={{ marginTop: '30px' }}>
            <Typography.Title level={4}>Estimation</Typography.Title>
            <Typography.Paragraph>{estimation}</Typography.Paragraph>
          </div>
        )}

        {plan && (
          <div style={{ marginTop: '30px' }}>
            <Typography.Title level={4}>Plan</Typography.Title>
            <Typography.Paragraph>{plan}</Typography.Paragraph>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default App;
