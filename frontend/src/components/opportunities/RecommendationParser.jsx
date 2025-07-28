import { TrendingUp, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const parseRecommendation = (text) => {
  const lines = text.split('\n').filter(line => line.trim());
  const parsed = {
    recommendation: '',
    reason: '',
    holdingPeriod: '',
    targetPrice: ''
  };

  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes('**recommendation:**') || lowerLine.includes('1.')) {
      parsed.recommendation = line.replace(/.*recommendation:\*\*|\*\*|1\.\s*/gi, '').trim();
    } else if (lowerLine.includes('**reason:**') || lowerLine.includes('2.')) {
      parsed.reason = line.replace(/.*reason:\*\*|\*\*|2\.\s*/gi, '').trim();
    } else if (lowerLine.includes('holding period') || lowerLine.includes('3.')) {
      parsed.holdingPeriod = line.replace(/.*holding period.*:\*\*|\*\*|3\.\s*/gi, '').trim();
    } else if (lowerLine.includes('target price') || lowerLine.includes('4.')) {
      parsed.targetPrice = line.replace(/.*target price.*:\*\*|\*\*|4\.\s*/gi, '').trim();
    }
  });

  // If no structured format found, try to extract from continuous text
  if (!parsed.recommendation && !parsed.reason) {
    const fullText = text.replace(/\*\*/g, '');
    const sections = fullText.split(/\d+\./);
    
    if (sections.length > 1) {
      parsed.recommendation = sections[1]?.split(/reason|Reason/i)[0]?.trim() || '';
      parsed.reason = sections[2]?.trim() || '';
      parsed.holdingPeriod = sections[3]?.trim() || '';
      parsed.targetPrice = sections[4]?.trim() || '';
    }
  }

  return parsed;
};

export const getRecommendationIcon = (rec) => {
  const recLower = rec.toLowerCase();
  if (recLower.includes('buy')) return <TrendingUp className="w-5 h-5 text-green-500" />;
  if (recLower.includes('sell')) return <XCircle className="w-5 h-5 text-red-500" />;
  if (recLower.includes('hold')) return <CheckCircle className="w-5 h-5 text-blue-500" />;
  return <AlertCircle className="w-5 h-5 text-yellow-500" />;
};

export const getRecommendationColor = (rec) => {
  const recLower = rec.toLowerCase();
  if (recLower.includes('buy')) return 'border-green-200 bg-green-50';
  if (recLower.includes('sell')) return 'border-red-200 bg-red-50';
  if (recLower.includes('hold')) return 'border-blue-200 bg-blue-50';
  return 'border-yellow-200 bg-yellow-50';
};