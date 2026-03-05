// App.js
import React, { useState, useEffect } from 'react';
import {
  Home,
  Activity,
  Footprints,
  Bluetooth,
  Battery,
  MapPin,
  Headphones,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  Navigation,
  Download,
  Share2,
  Settings,
  BarChart3,
  Zap,
  Award,
  ArrowLeft
} from 'lucide-react';

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [connectedDevices, setConnectedDevices] = useState({
    insole: false,
    earbuds: false,
    gps: false
  });
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [trainingSessions, setTrainingSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [showSportSelector, setShowSportSelector] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        connectedDevices={connectedDevices} 
        batteryLevel={batteryLevel}
      />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <HomeTab 
            connectedDevices={connectedDevices}
            batteryLevel={batteryLevel}
            setConnectedDevices={setConnectedDevices}
            startSession={() => setShowSportSelector(true)}
            showSportSelector={showSportSelector}
            setShowSportSelector={setShowSportSelector}
          />
        )}
        
        {activeTab === 'training' && (
          <TrainingTab 
            trainingSessions={trainingSessions}
            currentSession={currentSession}
          />
        )}
        
        {activeTab === 'analysis' && (
          <AnalysisTab 
            trainingSessions={trainingSessions}
          />
        )}
        
        {activeTab === 'fatigue' && (
          <FatigueTab 
            currentSession={currentSession}
          />
        )}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

// Header Component
const Header = ({ connectedDevices, batteryLevel }) => (
  <header className="bg-white shadow-md p-4">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Footprints className="text-blue-600" size={32} />
        <h1 className="text-2xl font-bold text-gray-800">SOLEsync</h1>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Bluetooth className={connectedDevices.insole ? 'text-green-500' : 'text-gray-400'} size={20} />
          <span className="text-sm">Insole</span>
        </div>
        <div className="flex items-center space-x-2">
          <Headphones className={connectedDevices.earbuds ? 'text-green-500' : 'text-gray-400'} size={20} />
          <span className="text-sm">Earbuds</span>
        </div>
        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
          <Battery className="text-green-600" size={18} />
          <span className="text-sm font-medium">{batteryLevel}%</span>
        </div>
      </div>
    </div>
  </header>
);

// Home Tab Component
const HomeTab = ({ 
  connectedDevices, 
  batteryLevel, 
  setConnectedDevices, 
  startSession,
  showSportSelector,
  setShowSportSelector 
}) => {
  const [selectedSport, setSelectedSport] = useState('');

  const sports = [
    { id: 'running', name: 'Running', icon: '🏃', requiresGPS: true },
    { id: 'walking', name: 'Walking', icon: '🚶', requiresGPS: false },
    { id: 'hiking', name: 'Hiking', icon: '🥾', requiresGPS: true },
    { id: 'trail', name: 'Trail Running', icon: '⛰️', requiresGPS: true }
  ];

  const handleConnectDevice = (device) => {
    setConnectedDevices(prev => ({ ...prev, [device]: !prev[device] }));
  };

  const handleStartSession = () => {
    if (selectedSport === 'running' || selectedSport === 'trail') {
      setConnectedDevices(prev => ({ ...prev, gps: true }));
    }
    // Start training session logic here
    setShowSportSelector(false);
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Device Connection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DeviceCard
            icon={<Footprints size={24} />}
            name="Smart Insole"
            connected={connectedDevices.insole}
            battery={batteryLevel}
            onConnect={() => handleConnectDevice('insole')}
          />
          <DeviceCard
            icon={<Headphones size={24} />}
            name="Earbuds"
            connected={connectedDevices.earbuds}
            onConnect={() => handleConnectDevice('earbuds')}
          />
        </div>
      </div>

      {/* Start Training Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Start Training</h2>
        
        {!showSportSelector ? (
          <button
            onClick={startSession}
            className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Start New Session
          </button>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Select Sport:</h3>
            <div className="grid grid-cols-2 gap-3">
              {sports.map(sport => (
                <button
                  key={sport.id}
                  onClick={() => setSelectedSport(sport.id)}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedSport === sport.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-2xl block mb-2">{sport.icon}</span>
                  <span className="font-medium">{sport.name}</span>
                </button>
              ))}
            </div>
            
            {selectedSport && (
              <div className="space-y-3">
                {sports.find(s => s.id === selectedSport)?.requiresGPS && (
                  <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded">
                    <MapPin size={20} />
                    <span>GPS will be enabled for route tracking</span>
                  </div>
                )}
                <button
                  onClick={handleStartSession}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Begin Training
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats Preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Today's Preview</h2>
        <div className="grid grid-cols-3 gap-4">
          <StatCard value="0" label="Sessions" icon={<Calendar size={20} />} />
          <StatCard value="0 min" label="Duration" icon={<Clock size={20} />} />
          <StatCard value="Ready" label="Status" icon={<Zap size={20} />} />
        </div>
      </div>
    </div>
  );
};

// Device Card Component
const DeviceCard = ({ icon, name, connected, battery, onConnect }) => (
  <div className={`p-4 rounded-lg border-2 ${connected ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-3">
        <div className={`${connected ? 'text-green-600' : 'text-gray-400'}`}>
          {icon}
        </div>
        <span className="font-medium">{name}</span>
      </div>
      <button
        onClick={onConnect}
        className={`px-3 py-1 rounded-full text-sm ${
          connected 
            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
        }`}
      >
        {connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
    {battery !== undefined && connected && (
      <div className="flex items-center space-x-2">
        <Battery size={16} className="text-gray-600" />
        <div className="flex-1 h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-green-500 rounded-full" 
            style={{ width: `${battery}%` }}
          />
        </div>
        <span className="text-sm text-gray-600">{battery}%</span>
      </div>
    )}
  </div>
);

// Training Tab Component (updated)
const TrainingTab = ({ trainingSessions, currentSession }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedSession, setSelectedSession] = useState(null);
  const [hoveredSession, setHoveredSession] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Use sample data as training sessions (expanded to 5 entries)
  const sessions = sampleTrainingSessions.map((s, index) => ({
    ...s,
    id: index,
    durationMin: parseInt(s.duration), // "45 min" -> 45
    dateObj: new Date(s.date.replace('Today', '2025-01-01').replace('Yesterday', '2024-12-31')) // dummy conversion
  }));

  const handleSessionClick = (session) => {
    setSelectedSession(session);
  };

  const handleBack = () => {
    setSelectedSession(null);
  };

  // If a session is selected, show detailed view
  if (selectedSession) {
    return (
      <div className="space-y-6">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={20} className="mr-1" /> Back to Training Log
        </button>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">{selectedSession.type}</h2>
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Date" value={selectedSession.date} />
            <DetailItem label="Duration" value={selectedSession.duration} />
            <DetailItem label="Distance" value={selectedSession.distance} />
            <DetailItem label="Pace" value={selectedSession.pace} />
            <DetailItem label="Icon" value={selectedSession.icon} />
          </div>
          {selectedSession.hasRoute && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Route Map</h3>
              <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
                {/* Dummy route map visualization */}
                <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none" className="rounded">
                  <path
                    d="M50 150 Q100 50, 150 150 T250 50 T350 150"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="150" r="6" fill="#10b981" stroke="white" strokeWidth="2" />
                  <circle cx="350" cy="150" r="6" fill="#ef4444" stroke="white" strokeWidth="2" />
                  <text x="30" y="130" fontSize="12" fill="#374151">Start</text>
                  <text x="330" y="130" fontSize="12" fill="#374151">Finish</text>
                </svg>
              </div>
              <p className="text-sm text-gray-600 mt-2">Route: 5.2 km • Elevation gain: 120 m</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Training Time Line Graph */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Training Time Analysis</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 rounded ${timeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 rounded ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Month
            </button>
          </div>
        </div>
        
        {/* Line Graph */}
        <LineGraph
          sessions={sessions}
          onSessionClick={handleSessionClick}
          onHover={(session, event) => {
            setHoveredSession(session);
            if (event) {
              setTooltipPos({ x: event.clientX, y: event.clientY });
            }
          }}
          onHoverEnd={() => setHoveredSession(null)}
        />

        {/* Recommendation */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Next Session Recommendation</h3>
          <p className="text-green-700">
            Based on your recent activity, we recommend a 75-minute training session.
            This will optimize your recovery and performance.
          </p>
        </div>
      </div>

      {/* Training Log */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Training Log</h2>
        <div className="space-y-3">
          {sessions.map((session, index) => (
            <TrainingLogEntry 
              key={index} 
              session={session} 
              onClick={() => handleSessionClick(session)}
            />
          ))}
        </div>
      </div>

      {/* Tooltip for hovered session */}
      {hoveredSession && (
        <div
          className="fixed bg-black text-white text-sm rounded py-1 px-2 pointer-events-none z-50"
          style={{ left: tooltipPos.x + 10, top: tooltipPos.y + 10 }}
        >
          <div>{hoveredSession.type}</div>
          <div>{hoveredSession.duration} • {hoveredSession.distance}</div>
        </div>
      )}
    </div>
  );
};

// Line Graph Component
const LineGraph = ({ sessions, onSessionClick, onHover, onHoverEnd }) => {
  const width = 600;
  const height = 200;
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  // Find max duration for scaling
  const maxDuration = Math.max(...sessions.map(s => s.durationMin)) + 10;
  
  // Generate points
  const points = sessions.map((session, i) => {
    const x = margin.left + (i / (sessions.length - 1)) * graphWidth;
    const y = margin.top + graphHeight - (session.durationMin / maxDuration) * graphHeight;
    return { x, y, session };
  });

  // Line path
  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

  return (
    <div className="relative overflow-x-auto">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="#e5e7eb" />
        <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke="#e5e7eb" />
        
        {/* Line */}
        <path d={linePath} stroke="#3b82f6" strokeWidth="2" fill="none" />
        
        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="6"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="2"
            className="cursor-pointer hover:fill-blue-700 transition-colors"
            onClick={() => onSessionClick(p.session)}
            onMouseEnter={(e) => onHover(p.session, e)}
            onMouseLeave={onHoverEnd}
          />
        ))}

        {/* X-axis labels (session numbers) */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - margin.bottom + 15}
            textAnchor="middle"
            fontSize="10"
            fill="#6b7280"
          >
            {i + 1}
          </text>
        ))}

        {/* Y-axis label */}
        <text
          x={margin.left - 10}
          y={margin.top - 5}
          textAnchor="end"
          fontSize="10"
          fill="#6b7280"
        >
          Minutes
        </text>
      </svg>
    </div>
  );
};

// Detail Item for session view
const DetailItem = ({ label, value }) => (
  <div>
    <span className="text-sm text-gray-500">{label}</span>
    <p className="font-medium">{value}</p>
  </div>
);

// Training Log Entry Component (updated with onClick)
const TrainingLogEntry = ({ session, onClick }) => (
  <div 
    className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
    onClick={onClick}
  >
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{session.icon}</span>
          <div>
            <h3 className="font-semibold">{session.type}</h3>
            <p className="text-sm text-gray-600">{session.date}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-3">
          <div>
            <span className="text-sm text-gray-500">Duration</span>
            <p className="font-medium">{session.duration}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Distance</span>
            <p className="font-medium">{session.distance}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Pace</span>
            <p className="font-medium">{session.pace}</p>
          </div>
        </div>
      </div>
      <button className="text-blue-600 hover:text-blue-800" onClick={(e) => e.stopPropagation()}>
        <Download size={20} />
      </button>
    </div>
  </div>
);

// Analysis Tab Component
const AnalysisTab = ({ trainingSessions }) => {
  const [selectedSession, setSelectedSession] = useState(null);

  return (
    <div className="space-y-6">
      {/* Foot Pressure Diagram */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Foot Pressure Analysis</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <FootPressureDiagram />
          <PressureLegend />
        </div>
      </div>

      {/* Posture Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Posture & Form Recommendations</h2>
        <div className="space-y-4">
          <RecommendationCard
            title="Heel Strike Pattern"
            description="Your heel strike is heavier on the right foot. Try to land more mid-foot to reduce impact."
            severity="medium"
          />
          <RecommendationCard
            title="Cadence Optimization"
            description="Aim for 170-180 steps per minute to improve efficiency and reduce injury risk."
            severity="low"
          />
          <RecommendationCard
            title="Pelvic Tilt"
            description="Slight anterior pelvic tilt detected. Engage core muscles for better alignment."
            severity="high"
          />
        </div>
      </div>
    </div>
  );
};

// Foot Pressure Diagram Component
const FootPressureDiagram = () => {
  const pressureZones = {
    heel: 75,
    midfoot: 45,
    forefoot: 60,
    toes: 30
  };

  const getColor = (value) => {
    if (value > 70) return 'bg-red-500';
    if (value > 50) return 'bg-yellow-500';
    if (value > 30) return 'bg-green-500';
    return 'bg-blue-500';
  };

  return (
    <div className="relative w-64 h-80 mx-auto">
      {/* Foot Outline */}
      <svg viewBox="0 0 200 250" className="w-full h-full">
        {/* Heel */}
        <rect 
          x="60" y="180" width="80" height="50" 
          className={`${getColor(pressureZones.heel)} opacity-70`}
          rx="10"
        />
        {/* Midfoot */}
        <rect 
          x="60" y="120" width="80" height="60" 
          className={`${getColor(pressureZones.midfoot)} opacity-70`}
        />
        {/* Forefoot */}
        <rect 
          x="50" y="60" width="100" height="60" 
          className={`${getColor(pressureZones.forefoot)} opacity-70`}
        />
        {/* Toes */}
        <rect 
          x="40" y="30" width="120" height="30" 
          className={`${getColor(pressureZones.toes)} opacity-70`}
          rx="15"
        />
        
        {/* Foot Outline */}
        <path
          d="M40 30 L40 220 Q50 230 70 230 L130 230 Q150 230 160 220 L160 30 Q150 20 130 20 L70 20 Q50 20 40 30"
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

// Pressure Legend
const PressureLegend = () => (
  <div className="space-y-2">
    <h3 className="font-semibold">Pressure Distribution</h3>
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-red-500 rounded"></div>
        <span>High Pressure (Heel) - 75%</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
        <span>Medium Pressure (Forefoot) - 60%</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-green-500 rounded"></div>
        <span>Normal Pressure (Midfoot) - 45%</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded"></div>
        <span>Low Pressure (Toes) - 30%</span>
      </div>
    </div>
  </div>
);

// Fatigue Tab Component
const FatigueTab = ({ currentSession }) => {
  const [fatigueMetrics, setFatigueMetrics] = useState({
    timeUntilFatigued: 15,
    contactTime: 245,
    leftFootForce: 48,
    rightFootForce: 52,
    formScore: 78
  });

  return (
    <div className="space-y-6">
      {/* Fatigue Timer */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Fatigue Analysis</h2>
        <div className="text-center mb-6">
          <div className="inline-block relative">
            <svg className="w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#e6e6e6"
                strokeWidth="12"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="12"
                strokeDasharray={`${(fatigueMetrics.timeUntilFatigued / 60) * 553} 553`}
                transform="rotate(-90 96 96)"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-4xl font-bold">{fatigueMetrics.timeUntilFatigued}</span>
              <span className="text-gray-500 block">minutes</span>
              <span className="text-sm">until fatigue</span>
            </div>
          </div>
        </div>

        {/* Fatigue Metrics */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <MetricCard
            label="Contact Time"
            value={`${fatigueMetrics.contactTime}ms`}
            trend="+12ms"
            trendDirection="up"
            warning="Increasing contact time indicates fatigue"
          />
          <MetricCard
            label="Form Score"
            value={`${fatigueMetrics.formScore}%`}
            trend="-5%"
            trendDirection="down"
            warning="Form deterioration detected"
          />
        </div>

        {/* Force Balance */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">Force Distribution</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Left</span>
            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500"
                style={{ width: `${fatigueMetrics.leftFootForce}%` }}
              />
            </div>
            <span className="text-sm font-medium">{fatigueMetrics.leftFootForce}%</span>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm">Right</span>
            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500"
                style={{ width: `${fatigueMetrics.rightFootForce}%` }}
              />
            </div>
            <span className="text-sm font-medium">{fatigueMetrics.rightFootForce}%</span>
          </div>
          {Math.abs(fatigueMetrics.leftFootForce - fatigueMetrics.rightFootForce) > 5 && (
            <div className="mt-3 flex items-center space-x-2 text-yellow-600">
              <AlertTriangle size={16} />
              <span className="text-sm">Significant imbalance detected - {fatigueMetrics.leftFootForce < fatigueMetrics.rightFootForce ? 'Right' : 'Left'} leg compensating</span>
            </div>
          )}
        </div>
      </div>

      {/* Instant Warnings */}
      {currentSession && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Real-time Alerts</h2>
          <div className="space-y-3">
            <WarningMessage
              type="warning"
              message="Increased contact time detected - consider reducing intensity"
            />
            <WarningMessage
              type="info"
              message="5 minutes until predicted fatigue onset"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Bottom Navigation Component
const BottomNavigation = ({ activeTab, setActiveTab }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
    <div className="container mx-auto flex justify-around">
      <NavButton
        icon={<Home size={24} />}
        label="Home"
        active={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      />
      <NavButton
        icon={<Activity size={24} />}
        label="Training"
        active={activeTab === 'training'}
        onClick={() => setActiveTab('training')}
      />
      <NavButton
        icon={<BarChart3 size={24} />}
        label="Analysis"
        active={activeTab === 'analysis'}
        onClick={() => setActiveTab('analysis')}
      />
      <NavButton
        icon={<Zap size={24} />}
        label="Fatigue"
        active={activeTab === 'fatigue'}
        onClick={() => setActiveTab('fatigue')}
      />
    </div>
  </nav>
);

// Helper Components
const NavButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center px-4 py-1 rounded-lg ${
      active ? 'text-blue-600' : 'text-gray-500'
    }`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const StatCard = ({ value, label, icon }) => (
  <div className="text-center">
    <div className="flex justify-center text-gray-600 mb-2">{icon}</div>
    <div className="font-bold text-xl">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

const MetricCard = ({ label, value, trend, trendDirection, warning }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <div className="text-sm text-gray-600 mb-1">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
    {trend && (
      <div className={`text-sm mt-1 ${trendDirection === 'up' ? 'text-red-500' : 'text-green-500'}`}>
        {trend}
      </div>
    )}
    {warning && (
      <div className="text-xs text-yellow-600 mt-2 flex items-center space-x-1">
        <AlertTriangle size={12} />
        <span>{warning}</span>
      </div>
    )}
  </div>
);

const WarningMessage = ({ type, message }) => {
  const colors = {
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    alert: 'bg-red-50 border-red-200 text-red-800'
  };

  return (
    <div className={`p-3 rounded-lg border ${colors[type]} flex items-start space-x-2`}>
      <AlertTriangle size={16} className="mt-0.5" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

const RecommendationCard = ({ title, description, severity }) => {
  const colors = {
    low: 'border-green-200 bg-green-50',
    medium: 'border-yellow-200 bg-yellow-50',
    high: 'border-red-200 bg-red-50'
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[severity]}`}>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

// Sample Data - expanded to 5 entries with route maps for first two
const sampleTrainingSessions = [
  {
    type: 'Morning Run',
    icon: '🏃',
    date: 'Today, 7:30 AM',
    duration: '45 min',
    distance: '5.2 km',
    pace: '5:45 /km',
    hasRoute: true
  },
  {
    type: 'Evening Walk',
    icon: '🚶',
    date: 'Yesterday, 6:00 PM',
    duration: '30 min',
    distance: '2.1 km',
    pace: '14:15 /km',
    hasRoute: true
  },
  {
    type: 'Trail Run',
    icon: '⛰️',
    date: '2 days ago',
    duration: '75 min',
    distance: '8.5 km',
    pace: '6:30 /km',
    hasRoute: true
  },
  {
    type: 'Recovery Run',
    icon: '🧘',
    date: '3 days ago',
    duration: '25 min',
    distance: '3.0 km',
    pace: '8:20 /km',
    hasRoute: false
  },
  {
    type: 'Long Run',
    icon: '🏃‍♂️',
    date: '5 days ago',
    duration: '90 min',
    distance: '12.0 km',
    pace: '7:30 /km',
    hasRoute: true
  }
];

export default App;