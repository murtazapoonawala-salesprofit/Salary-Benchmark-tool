import React, { useState, useMemo } from 'react';
import { Inputs, DealSize, Region, Achievement, CalculationResult, CurrentRole, RevenueResponsibility, PrimaryDomain, BuyingCommittee } from './types';
import { 
  DEAL_SIZE_OPTIONS, REGION_OPTIONS, ACHIEVEMENT_OPTIONS,
  CURRENT_ROLE_OPTIONS, REVENUE_RESPONSIBILITY_OPTIONS, PRIMARY_DOMAIN_OPTIONS, BUYING_COMMITTEE_OPTIONS
} from './constants';
import { InputGroup } from './components/InputGroup';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, CheckCircle, DollarSign, Briefcase, Globe, Target, User, ChevronRight, ArrowLeft, Info } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

  const [inputs, setInputs] = useState<Inputs>({
    // Defaults for existing logic fields
    yearsExperience: 5,
    fixedSalaryLacs: 15,
    variablePercentage: 30,
    dealSize: DealSize.BETWEEN_10_50,
    region: Region.INDIA,
    achievement: Achievement.BETWEEN_90_100,

    // Defaults for new fields
    currentRole: CurrentRole.AE_SMB,
    revenueResponsibility: RevenueResponsibility.IC_ROLE,
    primaryDomain: PrimaryDomain.SAAS_HORIZONTAL,
    buyingCommittee: BuyingCommittee.BUSINESS_TECH
  });

  // --- Handlers ---
  const handleNumberChange = (field: keyof Inputs, value: string) => {
    // Allow empty string to clear the field
    if (value === '') {
      setInputs(prev => ({
        ...prev,
        [field]: ''
      }));
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setInputs(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  const handleEnumChange = (field: keyof Inputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBenchmarkClick = () => {
    setIsLoading(true);
    window.scrollTo(0, 0);

    setTimeout(() => {
      setStep(2);
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 3000);
  };

  const handleBackClick = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  // --- Logic ---
  const results: CalculationResult = useMemo(() => {
    // Safe values for calculation (treat empty string as 0)
    const safeFixedSalary = inputs.fixedSalaryLacs === '' ? 0 : inputs.fixedSalaryLacs;
    const safeVariablePct = inputs.variablePercentage === '' ? 0 : inputs.variablePercentage;
    const safeYearsExp = inputs.yearsExperience === '' ? 0 : inputs.yearsExperience;

    // 1. Total CTC
    const totalCtc = safeFixedSalary + (safeFixedSalary * (safeVariablePct / 100));

    // 2. Deal Size Factor
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

    // 6. X Value - Updated Formula: 2.6 + (0.1 * Z)
    const xValue = 2.6 + (0.1 * zValue);

    // 7. Benchmark Salary
    const benchmarkSalary = safeYearsExp * xValue;

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900 font-sans p-4">
        <div className="text-center space-y-6 animate-in fade-in duration-700 max-w-md w-full">
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#32AF6F] rounded-full border-t-transparent animate-spin"></div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">Calculating Benchmark...</h2>
            <p className="text-slate-500">
              Analyzing your profile against 500+ market data points across {inputs.region} region...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Sales Compensation Benchmark</h1>
            <p className="text-slate-600 mt-2 text-sm">Tech Sales Professionals</p>
        </div>

        {step === 1 ? (
          /* --- STEP 1: INPUT FORM --- */
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* Intro Text */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800">
              Benchmark your compensation against market standards based on role, domain, geography, and performance consistency.
            </div>

            {/* Section 1: Profile Context */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <div className="bg-blue-100 p-1.5 rounded-md">
                   <User className="text-blue-600" size={18} />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">Section 1: Profile Context</h2>
              </div>
              
              <div className="space-y-5">
                <InputGroup label="Total Years of B2B Sales Experience" id="experience">
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

                <InputGroup label="Current Role" id="currentRole">
                  <select
                    id="currentRole"
                    value={inputs.currentRole}
                    onChange={(e) => handleEnumChange('currentRole', e.target.value)}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-slate-50"
                  >
                    {CURRENT_ROLE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </InputGroup>

                <InputGroup label="Revenue Responsibility" id="revenueResp">
                  <select
                    id="revenueResp"
                    value={inputs.revenueResponsibility}
                    onChange={(e) => handleEnumChange('revenueResponsibility', e.target.value)}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-slate-50"
                  >
                    {REVENUE_RESPONSIBILITY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </InputGroup>
              </div>
            </section>

            {/* Section 2: Market & Deal Complexity */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <div className="bg-purple-100 p-1.5 rounded-md">
                   <Briefcase className="text-purple-600" size={18} />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">Section 2: Market & Deal Complexity</h2>
              </div>

              <div className="space-y-5">
                <InputGroup label="Primary Domain" id="primaryDomain">
                  <select
                    id="primaryDomain"
                    value={inputs.primaryDomain}
                    onChange={(e) => handleEnumChange('primaryDomain', e.target.value)}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-slate-50"
                  >
                    {PRIMARY_DOMAIN_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </InputGroup>

                <InputGroup label="Average Deal Size" id="dealSize">
                  <select
                    id="dealSize"
                    value={inputs.dealSize}
                    onChange={(e) => handleEnumChange('dealSize', e.target.value)}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-slate-50"
                  >
                    {DEAL_SIZE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </InputGroup>
              </div>
            </section>

            {/* Section 3: Geography & Buyer Complexity */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <div className="bg-emerald-100 p-1.5 rounded-md">
                   <Globe className="text-emerald-600" size={18} />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">Section 3: Geography & Buyer Complexity</h2>
              </div>

              <div className="space-y-5">
                <InputGroup label="Primary Region of Operation" id="region">
                  <select
                    id="region"
                    value={inputs.region}
                    onChange={(e) => handleEnumChange('region', e.target.value)}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-slate-50"
                  >
                    {REGION_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </InputGroup>

                <InputGroup label="Buying Committee You Sell To" id="buyingCommittee">
                  <select
                    id="buyingCommittee"
                    value={inputs.buyingCommittee}
                    onChange={(e) => handleEnumChange('buyingCommittee', e.target.value)}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-slate-50"
                  >
                    {BUYING_COMMITTEE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </InputGroup>
              </div>
            </section>

             {/* Section 4: Compensation Structure */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                 <div className="bg-amber-100 p-1.5 rounded-md">
                   <DollarSign className="text-amber-600" size={18} />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">Section 4: Compensation Structure</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Fixed Salary Field - Now First */}
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

                 {/* Variable Pay Field - Now Second */}
                 <InputGroup label="Variable Pay as % of Fixed (OTE Variable)" id="variable" helperText="e.g. 30 for 30%">
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
            </section>

             {/* Section 5: Performance Consistency */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <div className="bg-rose-100 p-1.5 rounded-md">
                   <Target className="text-rose-600" size={18} />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">Section 5: Performance Consistency</h2>
              </div>

              <div className="space-y-5">
                <InputGroup label="Achievement Level – Last 3 Years" id="achievement">
                  <select
                    id="achievement"
                    value={inputs.achievement}
                    onChange={(e) => handleEnumChange('achievement', e.target.value)}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-slate-50"
                  >
                    {ACHIEVEMENT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </InputGroup>
              </div>
            </section>

            <div className="pt-4 pb-8">
              <button
                onClick={handleBenchmarkClick}
                className="w-full flex items-center justify-center gap-2 bg-[#32AF6F] text-white py-4 px-6 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Benchmark Result <ChevronRight size={20} />
              </button>
            </div>

          </div>
        ) : (
          /* --- STEP 2: RESULTS DASHBOARD --- */
          <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-12">
             <button 
              onClick={handleBackClick}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors"
            >
              <ArrowLeft size={16} /> Edit Profile inputs
            </button>

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
                         Based on {inputs.yearsExperience === '' ? 0 : inputs.yearsExperience} years exp. & performance factors
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

              {/* IMPORTANT NOTE BOX + CTA */}
              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                     <Info className="text-slate-400" size={20} />
                     <h4>Important Context</h4>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    This benchmark reflects current market trends but may vary based on domain, company context, consultative sales capability, and demand.
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Final compensation is influenced by role complexity, target ownership, and performance expectations.
                  </p>
                </div>
                
                <a 
                  href="https://salesprofit.in/tools/sales-compensation-benchmark/#contact" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-[#32AF6F] text-white py-4 px-6 rounded-xl font-bold text-lg hover:opacity-95 transition-all shadow-md hover:shadow-lg transform active:scale-[0.98]"
                >
                  Speak with our recruitment consultant for a tailored compensation assessment
                </a>
              </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;