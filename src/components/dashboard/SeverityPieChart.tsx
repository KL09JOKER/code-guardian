import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#3b82f6',
  low: '#10b981',
};

interface SeverityPieChartProps {
  data: { name: string; value: number }[];
}

export function SeverityPieChart({ data }: SeverityPieChartProps) {
  const filteredData = data.filter(d => d.value > 0);

  return (
    <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-foreground">Severity Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          {filteredData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={filteredData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {filteredData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
