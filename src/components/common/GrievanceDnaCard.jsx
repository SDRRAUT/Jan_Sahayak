import React from 'react';
import { Dna, ShieldAlert, Sparkles, Building2, MapPin, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function GrievanceDnaCard({ dna, isDark = false, compact = false }) {
  if (!dna) return null;

  const containerBg = isDark ? 'bg-[#132A22] text-[#F8FAFC] border-[rgba(255,255,255,0.12)]' : 'bg-white text-[#0F172A] border-[rgba(15,23,42,0.08)]';
  const subText = isDark ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const badgeBg = isDark ? 'bg-[rgba(16,185,129,0.15)] text-[#10B981]' : 'bg-[#E8F7F0] text-[#0E5E3A]';

  return (
    <div className={`rounded-[16px] border p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_16px_-2px_rgba(15,23,42,0.04)] ${containerBg}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E8F7F0] flex items-center justify-center text-[#0E5E3A]">
            <Dna className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E5E3A] dark:text-[#10B981]">Grievance DNA™</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[rgba(15,23,42,0.06)] dark:bg-[rgba(255,255,255,0.1)] text-[#0F172A] dark:text-white font-semibold">
                {dna.dnaId || 'DNA-VERIFIED'}
              </span>
            </div>
            <p className={`text-[11px] ${subText}`}>Intelligence Fingerprint by JanSahayk AI</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-[#10B981]">{dna.departmentConfidence || dna.confidence || 98.4}%</span>
          <p className={`text-[10px] ${subText}`}>Routing Confidence</p>
        </div>
      </div>

      {/* Core DNA Attributes */}
      <div className="grid grid-cols-2 gap-3 my-3.5">
        <div className="p-2.5 rounded-lg bg-[rgba(15,23,42,0.02)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.04)] dark:border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] dark:text-[#94A3B8] mb-1">
            <Building2 className="w-3.5 h-3.5" /> Auto-Detected Dept
          </div>
          <p className="text-xs font-semibold truncate text-[#0F172A] dark:text-white">{dna.department}</p>
          <span className="text-[10px] text-[#0E5E3A] dark:text-[#10B981] font-medium">{dna.category}</span>
        </div>

        <div className="p-2.5 rounded-lg bg-[rgba(15,23,42,0.02)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.04)] dark:border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] dark:text-[#94A3B8] mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Urgency Index
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${dna.urgency === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400' : 'bg-amber-100 text-amber-800'}`}>
              {dna.urgency || 'HIGH'} ({dna.urgencyScore || 90}/100)
            </span>
          </div>
          <span className={`text-[10px] ${subText}`}>{dna.sentimentLabel || 'Elevated Hazard'}</span>
        </div>
      </div>

      {/* Extracted Entities */}
      {dna.extractedEntities && dna.extractedEntities.length > 0 && (
        <div className="mb-3">
          <span className={`text-[11px] font-semibold uppercase tracking-wider block mb-1.5 ${subText}`}>Extracted Entities</span>
          <div className="flex flex-wrap gap-1.5">
            {dna.extractedEntities.map((ent, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-[rgba(15,23,42,0.04)] dark:bg-[rgba(255,255,255,0.08)] border border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.08)]">
                <span className="opacity-60">{ent.label}:</span>
                <strong className="font-semibold">{ent.val}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* RAG Historical Match */}
      {dna.ragMatches && dna.ragMatches.length > 0 && !compact && (
        <div className="pt-2.5 border-t border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-semibold flex items-center gap-1 text-[#0E5E3A] dark:text-[#10B981]">
              <Sparkles className="w-3 h-3" /> Historical RAG Match
            </span>
            <span className="font-mono text-[10px] text-[#10B981] font-bold">{(dna.ragMatches[0].similarity * 100).toFixed(0)}% Precedent Match</span>
          </div>
          <p className={`text-[11px] line-clamp-2 ${subText}`}>
            "{dna.ragMatches[0].summary}" — Resolved in {dna.ragMatches[0].resolutionTime || '14 hours'}
          </p>
        </div>
      )}
    </div>
  );
}
