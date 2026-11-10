import React from 'react';

export const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Deep Obsidian canvas */}
      <div className="absolute inset-0 bg-[#080b12]" />
      
      {/* Ultra-subtle ambient lighting */}
      <div 
        className="absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.09]"
        style={{ background: 'radial-gradient(circle, #38bdf8 0%, #6366f1 60%, transparent 80%)' }}
      />
      <div 
        className="absolute top-1/2 -right-32 w-[450px] h-[450px] rounded-full blur-[170px] opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }}
      />

      {/* Very faint delicate micro dot-grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
