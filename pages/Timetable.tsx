import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { api } from '../services/api';
import { Clock } from 'lucide-react';

export const Timetable: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    api.getClasses().then(setClasses).catch(console.error);
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-bold text-gray-900">Timetable</h1>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Time</th>
                {days.map(day => (
                  <th key={day} className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time, i) => (
                <tr key={time} className="border-b">
                  <td className="px-4 py-4 text-sm text-gray-500 flex items-center gap-2">
                    <Clock size={14} /> {time}
                  </td>
                  {days.map((day, j) => {
                    const cls = classes[(i + j) % Math.max(classes.length, 1)];
                    return (
                      <td key={day} className="px-4 py-4">
                        {cls && (i + j) % 3 !== 0 ? (
                          <div className="bg-primary/10 rounded-lg p-2">
                            <p className="font-medium text-sm text-primary">{cls.subject}</p>
                            <p className="text-xs text-gray-500">{cls.room}</p>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-sm">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {classes.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">All Classes</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {classes.map(c => (
              <div key={c.id} className="p-4 border rounded-lg">
                <h4 className="font-semibold">{c.name}</h4>
                <p className="text-sm text-gray-500">{c.subject} • {c.room}</p>
                <p className="text-xs text-gray-400 mt-1">{c.schedule}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
