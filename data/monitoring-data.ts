// Monitoring and location-based data

export const weeklyData = [
    { day: 'Mon', PM25: 35, PM10: 65, AQI: 68, NO2: 22, SO2: 12, O3: 45 },
    { day: 'Tue', PM25: 22, PM10: 45, AQI: 52, NO2: 18, SO2: 8, O3: 38 },
    { day: 'Wed', PM25: 120, PM10: 180, AQI: 172, NO2: 45, SO2: 38, O3: 60 },
    { day: 'Thu', PM25: 85, PM10: 125, AQI: 140, NO2: 38, SO2: 25, O3: 55 },
    { day: 'Fri', PM25: 28, PM10: 52, AQI: 58, NO2: 20, SO2: 10, O3: 40 },
    { day: 'Sat', PM25: 18, PM10: 32, AQI: 48, NO2: 15, SO2: 5, O3: 35 },
    { day: 'Sun', PM25: 42, PM10: 78, AQI: 82, NO2: 26, SO2: 14, O3: 48 },
  ];
  
  export const hourlyExposureData = [
    { time: '6am', value: 15, temperature: 20, humidity: 65 },
    { time: '8am', value: 85, temperature: 22, humidity: 60 },
    { time: '10am', value: 60, temperature: 24, humidity: 55 },
    { time: '12pm', value: 45, temperature: 26, humidity: 50 },
    { time: '2pm', value: 30, temperature: 28, humidity: 45 },
    { time: '4pm', value: 55, temperature: 27, humidity: 48 },
    { time: '6pm', value: 95, temperature: 25, humidity: 52 },
    { time: '8pm', value: 40, temperature: 23, humidity: 58 },
    { time: '10pm', value: 25, temperature: 22, humidity: 62 },
    { time: '12am', value: 20, temperature: 21, humidity: 65 },
    { time: '2am', value: 12, temperature: 20, humidity: 68 },
    { time: '4am', value: 10, temperature: 19, humidity: 70 },
  ];
  
  export const exposureByLocation = [
    { name: 'Thamel', value: 35, fill: '#0088FE' },
    { name: 'Kalanki', value: 120, fill: '#00C49F' },
    { name: 'Balaju', value: 85, fill: '#FFBB28' },
    { name: 'Bhaktapur', value: 28, fill: '#FF8042' },
    { name: 'Lalitpur', value: 18, fill: '#8884d8' },
    { name: 'Koteshwor', value: 156, fill: '#82ca9d' },
    { name: 'Chabahil', value: 68, fill: '#ffc658' },
    { name: 'Swayambhu', value: 105, fill: '#a4de6c' },
  ];
  
  // Transform heatmap data for recharts
  export const heatmapData = [
    { name: '6-9 AM', Mon: 78, Tue: 56, Wed: 110, Thu: 92, Fri: 36, Sat: 25, Sun: 42 },
    { name: '9-12 PM', Mon: 55, Tue: 32, Wed: 98, Thu: 76, Fri: 29, Sat: 18, Sun: 38 },
    { name: '12-3 PM', Mon: 43, Tue: 25, Wed: 85, Thu: 64, Fri: 25, Sat: 15, Sun: 30 },
    { name: '3-6 PM', Mon: 91, Tue: 47, Wed: 132, Thu: 110, Fri: 47, Sat: 30, Sun: 55 },
    { name: '6-9 PM', Mon: 81, Tue: 52, Wed: 142, Thu: 89, Fri: 38, Sat: 35, Sun: 65 },
  ];
  
  export const monthlyTrendData = [
    { month: 'Jan', PM25: 45, PM10: 75, AQI: 80 },
    { month: 'Feb', PM25: 58, PM10: 95, AQI: 105 },
    { month: 'Mar', PM25: 78, PM10: 118, AQI: 125 },
    { month: 'Apr', PM25: 92, PM10: 140, AQI: 150 },
    { month: 'May', PM25: 65, PM10: 105, AQI: 110 },
    { month: 'Jun', PM25: 42, PM10: 70, AQI: 85 },
    { month: 'Jul', PM25: 35, PM10: 60, AQI: 70 },
    { month: 'Aug', PM25: 30, PM10: 55, AQI: 65 },
    { month: 'Sep', PM25: 48, PM10: 80, AQI: 95 },
    { month: 'Oct', PM25: 62, PM10: 100, AQI: 110 },
    { month: 'Nov', PM25: 75, PM10: 120, AQI: 130 },
    { month: 'Dec', PM25: 55, PM10: 90, AQI: 100 },
  ];
  
  export const weatherTrendData = [
    { month: 'Jan', temperature: 12, humidity: 55, precipitation: 5 },
    { month: 'Feb', temperature: 14, humidity: 50, precipitation: 10 },
    { month: 'Mar', temperature: 18, humidity: 45, precipitation: 15 },
    { month: 'Apr', temperature: 22, humidity: 40, precipitation: 20 },
    { month: 'May', temperature: 25, humidity: 55, precipitation: 60 },
    { month: 'Jun', temperature: 27, humidity: 70, precipitation: 120 },
    { month: 'Jul', temperature: 28, humidity: 85, precipitation: 200 },
    { month: 'Aug', temperature: 27, humidity: 80, precipitation: 180 },
    { month: 'Sep', temperature: 26, humidity: 75, precipitation: 100 },
    { month: 'Oct', temperature: 22, humidity: 60, precipitation: 40 },
    { month: 'Nov', temperature: 18, humidity: 50, precipitation: 15 },
    { month: 'Dec', temperature: 14, humidity: 55, precipitation: 5 },
  ];
  
  export const radarData = [
    { subject: 'PM2.5', A: 120, B: 25, fullMark: 150 },
    { subject: 'PM10', A: 85, B: 50, fullMark: 150 },
    { subject: 'NO2', A: 35, B: 20, fullMark: 150 },
    { subject: 'SO2', A: 28, B: 15, fullMark: 150 },
    { subject: 'O3', A: 52, B: 30, fullMark: 150 },
    { subject: 'CO', A: 42, B: 25, fullMark: 150 },
  ];
  
  // Kathmandu locations with AQI values
  export const kathmandu_locations = [
    { name: 'Thamel', lat: 27.7154, lng: 85.3123, aqi: 88, pm25: 35, pm10: 65 },
    { name: 'Kalanki', lat: 27.6939, lng: 85.2824, aqi: 190, pm25: 120, pm10: 180 },
    { name: 'Balaju', lat: 27.7362, lng: 85.3007, aqi: 145, pm25: 85, pm10: 125 },
    { name: 'Bhaktapur', lat: 27.6710, lng: 85.4298, aqi: 78, pm25: 28, pm10: 52 },
    { name: 'Lalitpur', lat: 27.6588, lng: 85.3247, aqi: 65, pm25: 18, pm10: 32 },
    { name: 'Koteshwor', lat: 27.6769, lng: 85.3497, aqi: 210, pm25: 156, pm10: 210 },
    { name: 'Chabahil', lat: 27.7197, lng: 85.3429, aqi: 110, pm25: 68, pm10: 95 },
    { name: 'Swayambhu', lat: 27.7147, lng: 85.2896, aqi: 160, pm25: 105, pm10: 145 },
    { name: 'Budhanilkantha', lat: 27.7784, lng: 85.3618, aqi: 62, pm25: 32, pm10: 60 },
    { name: 'Kirtipur', lat: 27.6818, lng: 85.2884, aqi: 55, pm25: 25, pm10: 48 },
    { name: 'Godavari', lat: 27.5965, lng: 85.3782, aqi: 42, pm25: 15, pm10: 28 },
    { name: 'Ratnapark', lat: 27.7041, lng: 85.3131, aqi: 138, pm25: 85, pm10: 120 },
    { name: 'Sankhu', lat: 27.7568, lng: 85.4597, aqi: 145, pm25: 92, pm10: 130 },
    { name: 'Chandragiri', lat: 27.6540, lng: 85.2081, aqi: 58, pm25: 25, pm10: 48 },
    { name: 'Tokha', lat: 27.7860, lng: 85.3306, aqi: 70, pm25: 38, pm10: 65 }
  ];
  
  export const personalExposurePoints = [
    { time: '8:00 AM', location: 'Home', aqi: 65, activity: 'Getting Ready', lat: 27.7197, lng: 85.3429 },
    { time: '8:30 AM', location: 'Commuting', aqi: 145, activity: 'Walking to Bus', lat: 27.7180, lng: 85.3400 },
    { time: '9:00 AM', location: 'Bus Stop', aqi: 190, activity: 'Waiting for Bus', lat: 27.7154, lng: 85.3350 },
    { time: '9:30 AM', location: 'Main Road', aqi: 210, activity: 'Bus Journey', lat: 27.7100, lng: 85.3250 },
    { time: '10:00 AM', location: 'Office Area', aqi: 160, activity: 'Walking to Office', lat: 27.7041, lng: 85.3131 },
    { time: '10:30 AM', location: 'Office', aqi: 75, activity: 'Working', lat: 27.7041, lng: 85.3131 },
    { time: '1:00 PM', location: 'Lunch Place', aqi: 110, activity: 'Lunch Break', lat: 27.7020, lng: 85.3150 },
    { time: '5:30 PM', location: 'Office', aqi: 85, activity: 'Leaving Office', lat: 27.7041, lng: 85.3131 },
    { time: '6:00 PM', location: 'Shopping', aqi: 125, activity: 'Grocery Shopping', lat: 27.7100, lng: 85.3200 },
    { time: '6:30 PM', location: 'Commuting', aqi: 180, activity: 'Bus Journey Home', lat: 27.7150, lng: 85.3300 },
    { time: '7:00 PM', location: 'Local Area', aqi: 155, activity: 'Walking Home', lat: 27.7180, lng: 85.3400 },
    { time: '7:30 PM', location: 'Home', aqi: 78, activity: 'Dinner', lat: 27.7197, lng: 85.3429 }
  ];
  
  // Monitoring stations data
  export const airQualityMonitoringStations = [
    { id: 1, name: 'US Embassy', location: 'Maharajgunj', status: 'Active', lastUpdate: '15 min ago', pm25: 65, pm10: 90, aqi: 112, lat: 27.7172, lng: 85.3240 },
    { id: 2, name: 'Ratnapark', location: 'City Center', status: 'Active', lastUpdate: '10 min ago', pm25: 85, pm10: 120, aqi: 138, lat: 27.7041, lng: 85.3131 },
    { id: 3, name: 'Pulchowk', location: 'Lalitpur', status: 'Active', lastUpdate: '20 min ago', pm25: 42, pm10: 68, aqi: 78, lat: 27.6778, lng: 85.3187 },
    { id: 4, name: 'Bhaktapur', location: 'Bhaktapur Durbar Square', status: 'Active', lastUpdate: '25 min ago', pm25: 38, pm10: 65, aqi: 75, lat: 27.6710, lng: 85.4298 },
    { id: 5, name: 'Kirtipur', location: 'Tribhuvan University', status: 'Maintenance', lastUpdate: '1 day ago', pm25: null, pm10: null, aqi: null, lat: 27.6818, lng: 85.2884 },
    { id: 6, name: 'Kalanki', location: 'Outer Ring Road', status: 'Active', lastUpdate: '30 min ago', pm25: 128, pm10: 185, aqi: 175, lat: 27.6939, lng: 85.2824 },
    { id: 7, name: 'Shankhapark', location: 'Kathmandu Center', status: 'Active', lastUpdate: '15 min ago', pm25: 75, pm10: 110, aqi: 125, lat: 27.7104, lng: 85.3093 },
    { id: 8, name: 'Dharan', location: 'Eastern Nepal', status: 'Active', lastUpdate: '40 min ago', pm25: 32, pm10: 55, aqi: 65, lat: 26.8065, lng: 87.2846 },
    { id: 9, name: 'Pokhara', location: 'Western Nepal', status: 'Active', lastUpdate: '45 min ago', pm25: 25, pm10: 42, aqi: 52, lat: 28.2096, lng: 83.9856 },
    { id: 10, name: 'Nepalgunj', location: 'Mid-Western Nepal', status: 'Inactive', lastUpdate: '2 days ago', pm25: null, pm10: null, aqi: null, lat: 28.0500, lng: 81.6167 },
    { id: 11, name: 'Dhulikhel', location: 'Kavrepalanchok', status: 'Active', lastUpdate: '35 min ago', pm25: 30, pm10: 58, aqi: 62, lat: 27.6225, lng: 85.5464 },
    { id: 12, name: 'Chitwan', location: 'National Park Area', status: 'Active', lastUpdate: '50 min ago', pm25: 28, pm10: 50, aqi: 58, lat: 27.5291, lng: 84.3542 },
  ];