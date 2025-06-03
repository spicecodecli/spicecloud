import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Tabs, 
  Tab, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        // Fetch project details
        const projectResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/projects/${projectId}`);
        setProject(projectResponse.data);
        
        // Fetch latest metrics for all files in the project
        const metricsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/metrics/project/${projectId}/latest`);
        setFiles(metricsResponse.data);
        
        if (metricsResponse.data.length > 0) {
          setSelectedFile(metricsResponse.data[0]);
          
          // Fetch historical metrics for the first file
          const historyResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/metrics/file/${metricsResponse.data[0].id}`);
          setMetrics(historyResponse.data);
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    try {
      const historyResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/metrics/file/${file.id}`);
      setMetrics(historyResponse.data);
    } catch (error) {
      console.error('Error fetching file metrics:', error);
    }
  };

  // Format metrics data for charts
  const formatMetricsForChart = () => {
    return metrics.map(metric => {
      const data = metric.data;
      return {
        date: new Date(metric.timestamp).toLocaleDateString(),
        ...data
      };
    }).reverse(); // Show oldest to newest
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        {project?.name}
      </Typography>
      
      {project?.description && (
        <Typography variant="body1" sx={{ mb: 3 }}>
          {project.description}
        </Typography>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="project tabs">
          <Tab label="Overview" />
          <Tab label="Files" />
          <Tab label="Metrics History" />
        </Tabs>
      </Paper>

      {/* Overview Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Project Summary
              </Typography>
              <Typography variant="body2">
                Repository: {project?.repositoryUrl || 'Not specified'}
              </Typography>
              <Typography variant="body2">
                Files analyzed: {files.length}
              </Typography>
              <Typography variant="body2">
                Last updated: {project?.updatedAt ? new Date(project.updatedAt).toLocaleString() : 'Never'}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Latest Metrics
              </Typography>
              {files.length === 0 ? (
                <Typography variant="body2">
                  No metrics available yet. Run SpiceCode CLI on your project to collect metrics.
                </Typography>
              ) : (
                <Typography variant="body2">
                  {files.length} files have been analyzed with SpiceCode.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Files Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Files
              </Typography>
              <List>
                {files.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="No files analyzed yet" />
                  </ListItem>
                ) : (
                  files.map((file) => (
                    <React.Fragment key={file.id}>
                      <ListItem 
                        button 
                        selected={selectedFile?.id === file.id}
                        onClick={() => handleFileSelect(file)}
                      >
                        <ListItemText 
                          primary={file.name} 
                          secondary={file.path} 
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))
                )}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              {selectedFile ? (
                <>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Path: {selectedFile.path}
                  </Typography>
                  
                  {selectedFile.Metrics && selectedFile.Metrics.length > 0 ? (
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Latest Metrics:
                      </Typography>
                      <pre style={{ 
                        backgroundColor: '#f5f5f5', 
                        padding: '10px', 
                        borderRadius: '4px',
                        overflow: 'auto' 
                      }}>
                        {JSON.stringify(selectedFile.Metrics[0].data, null, 2)}
                      </pre>
                    </Box>
                  ) : (
                    <Typography variant="body2">
                      No metrics available for this file.
                    </Typography>
                  )}
                </>
              ) : (
                <Typography variant="body1">
                  Select a file to view its metrics.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Metrics History Tab */}
      {tabValue === 2 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Metrics History
            </Typography>
            
            {selectedFile ? (
              <Typography variant="body2" sx={{ mb: 2 }}>
                Showing metrics history for: {selectedFile.name}
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ mb: 2 }}>
                Select a file to view its metrics history.
              </Typography>
            )}
            
            {metrics.length > 0 ? (
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={formatMetricsForChart()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {/* Dynamically create lines based on the first metric's data keys */}
                    {metrics.length > 0 && Object.keys(metrics[0].data).map((key, index) => (
                      <Line 
                        key={key}
                        type="monotone" 
                        dataKey={key} 
                        stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} 
                        activeDot={{ r: 8 }} 
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Typography variant="body1">
                No historical data available for this file.
              </Typography>
            )}
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ProjectDetails;
