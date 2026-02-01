// Test Gateway Connection
const testGateway = async () => {
  try {
    const response = await fetch('http://localhost:8090/actuator/health');
    console.log('Gateway status:', response.status);
    return response.ok;
  } catch (error) {
    console.log('Gateway error:', error);
    return false;
  }
};

export { testGateway };