import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const VitalsChart = ({ vitalsData = [], activeMetric = 'heartRate' }) => {
  const formattedData = [...vitalsData].reverse().map(v => {
    const time = new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      time,
      heartRate: v.heartRate,
      sys: v.bloodPressureSys,
      dia: v.bloodPressureDia,
      glucose: v.bloodGlucose,
      oxygen: v.oxygenLevel
    };
  });

  const getMetricConfig = () => {
    switch (activeMetric) {
      case 'bloodPressure':
        return {
          key: 'sys',
          name: 'Systolic BP (mmHg)',
          color: '#38BDF8',
          gradientId: 'colorSys'
        };
      case 'glucose':
        return {
          key: 'glucose',
          name: 'Blood Glucose (mg/dL)',
          color: '#F59E0B',
          gradientId: 'colorGlucose'
        };
      case 'oxygen':
        return {
          key: 'oxygen',
          name: 'Oxygen Saturation SpO2 (%)',
          color: '#10B981',
          gradientId: 'colorO2'
        };
      default:
        return {
          key: 'heartRate',
          name: 'Heart Rate (BPM)',
          color: '#A3E635',
          gradientId: 'colorHr'
        };
    }
  };

  const config = getMetricConfig();

  return (
    <div style={{ width: '100%', height: '300px', marginTop: '10px' }}>
      {formattedData.length === 0 ? (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          No vital log history available yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(11, 19, 43, 0.9)',
                border: '1px solid rgba(163, 230, 53, 0.3)',
                borderRadius: '12px',
                color: '#FFF'
              }}
            />
            <Area
              type="monotone"
              dataKey={config.key}
              name={config.name}
              stroke={config.color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#${config.gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
