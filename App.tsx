import React, { useState, useMemo } from 'react';
import { Inputs, DealSize, Region, Achievement, CalculationResult } from './types';
import { DEAL_SIZE_OPTIONS, REGION_OPTIONS, ACHIEVEMENT_OPTIONS } from './constants';
import { InputGroup } from './components/InputGroup';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, CheckCircle, TrendingUp, DollarSign, Briefcase, Globe, Target } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [inputs, setInputs] = useState<Inputs>({
    yearsExperience: 5,
    fixedSalaryLacs: 15,
    variablePercentage: 30, // Default to 30%
    dealSize: DealSize.BETWEEN_10_50,
    region: Region.INDIA,
    achievement: Achievement.BETWEEN_90_100,
  });

  // --- Handlers ---
  const handleNumberChange = (field: keyof Inputs, value: string) => {
    const numValue = parseFloat(value);
    setInputs(prev => ({
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue
    }));
  };

  const handleEnumChange = (field: keyof Inputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // --- Logic ---
  const results: CalculationResult = useMemo(() => {
    // 1. Total CTC
    // variablePercentage is now entered as a whole number (e.g. 30), so divide by 100
    const totalCtc = inputs.fixedSalaryLacs + (inputs.fixedSalaryLacs * (inputs.variablePercentage / 100));

    // 2. Deal Size Factor
    // New Logic: Factor is 1 only for "Less than 10 Lakhs". 
    // For "Between 10–50 Lakhs", "Between 50–100 Lakhs", "Above 100 Lakhs", factor is 2.
    let dealFactor = 1;
    if (inputs.dealSize !== DealSize.LESS_THAN_10) {
      dealFactor = 2;
    }

    // 3. Region Factor
    let regionFactor = 1;
    if (inputs.region === Region.BOTH) {
      regionFactor = 2;
    }

    // 4. Achievement Factor
    let achievementFactor = 0;
    switch (inputs.achievement) {
      case Achievement.LESS_THAN_70: achievementFactor = 60; break;
      case Achievement.BETWEEN_70_90: achievementFactor = 80; break;
      case Achievement.BETWEEN_90_100: achievementFactor = 110; break;
      case Achievement.BETWEEN_100_120: achievementFactor = 120; break;
      case Achievement.ABOVE_120: achievementFactor = 150; break;
    }

    // 5. Z Value
    const zValue = dealFactor + regionFactor + (0.01 * achievementFactor);

    // 6. X Value
    const xValue = 2 + (0.1 * zValue);

    // 7. Benchmark Salary
    const benchmarkSalary = inputs.yearsExperience * xValue;

    // Final Output
    const isUnderpaid = totalCtc < benchmarkSalary;

    return {
      totalCtc,
      dealFactor,
      regionFactor,
      achievementFactor,
      zValue,
      xValue,
      benchmarkSalary,
      isUnderpaid,
      status: isUnderpaid ? "Underpaid" : "Market Aligned"
    };
  }, [inputs]);

  // --- Chart Data ---
  const chartData = [
    {
      name: 'Your CTC',
      amount: parseFloat(results.totalCtc.toFixed(1)),
      fill: '#64748b' // Slate 500
    },
    {
      name: 'Benchmark',
      amount: parseFloat(results.benchmarkSalary.toFixed(1)),
      fill: results.isUnderpaid ? '#ef4444' : '#10b981' // Red if underpaid, Green if aligned
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <Briefcase className="text-blue-600" size={20} />
                <h2 className="text-lg font-semibold">Profile Details</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <InputGroup label="Years of Experience" id="experience">
                  <input
                    type="number"
                    id="experience"
                    min="0"
                    step="0.5"
                    value={inputs.yearsExperience}
                    onChange={(e) => handleNumberChange('yearsExperience', e.target.value)}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-slate-50"
                  />
                </InputGroup>

                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Fixed Salary (Lakhs PA)" id="fixed">
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-slate-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        type="number"
                        id="fixed"
                        min="0"
                        step="0.5"
                        value={inputs.fixedSalaryLacs}
                        onChange={(e) => handleNumberChange('fixedSalaryLacs', e.target.value)}
                        className="block w-full rounded-md border-slate-300 pl-7 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-slate-50"
                      />
                    </div>
                  </InputGroup>

                  <InputGroup label="Variable Pay %" id="variable" helperText={`e.g. 30 for 30%`}>
                    <input
                      type="number"
                      id="variable"
                      min="0"
                      max="100"
                      step="1"
                      value={inputs.variablePercentage}
                      onChange={(e) => handleNumberChange('variablePercentage', e.target.value)}
                      className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-slate-50"
                    />
                  </InputGroup>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <Target className="text-blue-600" size={20} />
                <h2 className="text-lg font-semibold">Performance & Scope</h2>
              </div>

              <div className="space-y-4">
                <InputGroup label="Deal Size Handled" id="dealsize">
                  <select
                    id="dealsize"
                    value={inputs.dealSize}
                    onChange={(e) => handleEnumChange('dealSize', e.target.value)}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-slate-50"
                  >
                    {DEAL_SIZE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </InputGroup>

                <InputGroup label="Region of Operation" id="region">
                  <div className="relative">
                     <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                        <Globe size={16} className="text-slate-400" />
                      </div>
                    <select
                      id="region"
                      value={inputs.region}
                      onChange={(e) => handleEnumChange('region', e.target.value)}
                      className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-slate-50"
                    >
                      {REGION_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </InputGroup>

                <InputGroup label="Achievement Level" id="achievement">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                        <TrendingUp size={16} className="text-slate-400" />
                      </div>
                    <select
                      id="achievement"
                      value={inputs.achievement}
                      onChange={(e) => handleEnumChange('achievement', e.target.value)}
                      className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-slate-50"
                    >
                      {ACHIEVEMENT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </InputGroup>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 space-y-6">
              
              {/* Main Result Card */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className={`p-6 ${results.isUnderpaid ? 'bg-red-50' : 'bg-emerald-50'} border-b ${results.isUnderpaid ? 'border-red-100' : 'border-emerald-100'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium uppercase tracking-wider text-slate-500 mb-1">Market Assessment</h3>
                      <div className="flex items-center gap-3">
                        {results.isUnderpaid ? (
                          <AlertCircle className="text-red-600" size={32} />
                        ) : (
                          <CheckCircle className="text-emerald-600" size={32} />
                        )}
                        <span className={`text-3xl font-bold ${results.isUnderpaid ? 'text-red-700' : 'text-emerald-700'}`}>
                          {results.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Stats */}
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-500 mb-1">Your Total CTC</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-slate-900">₹{results.totalCtc.toFixed(1)}</span>
                        <span className="text-sm font-medium text-slate-500">Lakhs</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-600 mb-1 font-medium">Benchmark Salary</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-blue-700">₹{results.benchmarkSalary.toFixed(1)}</span>
                        <span className="text-sm font-medium text-blue-600">Lakhs</span>
                      </div>
                      <p className="text-xs text-blue-500 mt-2">
                         Based on {inputs.yearsExperience} years exp. & performance factors
                      </p>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 12 }} 
                          dy={10}
                        />
                        <YAxis 
                          hide 
                        />
                        <Tooltip 
                          cursor={{fill: 'transparent'}}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar 
                          dataKey="amount" 
                          radius={[4, 4, 0, 0]}
                          barSize={60}
                          animationDuration={1000}
                        >
                           {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Debug / Breakdown Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="text-slate-400" size={18} />
                  <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Calculation Breakdown</h4>
                 </div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center divide-x divide-slate-100">
                    <div>
                      <span className="block text-xs text-slate-500 mb-1">Deal Factor</span>
                      <span className="font-mono font-medium text-slate-700">{results.dealFactor}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500 mb-1">Region Factor</span>
                      <span className="font-mono font-medium text-slate-700">{results.regionFactor}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500 mb-1">Achiev. Factor</span>
                      <span className="font-mono font-medium text-slate-700">{results.achievementFactor}</span>
                    </div>
                     <div>
                      <span className="block text-xs text-slate-500 mb-1">Z Value</span>
                      <span className="font-mono font-bold text-blue-600">{results.zValue.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500 mb-1">X Value</span>
                      <span className="font-mono font-bold text-purple-600">{results.xValue.toFixed(2)}</span>
                    </div>
                 </div>
                 <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                    <p>Formula: Benchmark = Years Exp × X</p>
                    <p>Where X = 2 + (0.1 × Z)</p>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;