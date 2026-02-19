/**
 * Ngapain dek 
 */
export const obfuscate = (str: string): string => btoa(str);
export const deobfuscate = (str: string): string => atob(str);

/**
 * Ini debug 
 */
export const initAntiDebug = () => {
  if (typeof window === 'undefined') return;

  const threshold = 160;
  const check = () => {
    const isDevToolsOpen = 
      window.outerWidth - window.innerWidth > threshold || 
      window.outerHeight - window.innerHeight > threshold;
    
    if (isDevToolsOpen) {
      console.warn("NEXA Security: Debugging is restricted.");
      // Optional: 
    }
  };

  window.addEventListener('resize', check);
  
  // Buat Ngecek skala Secara Real time
  setInterval(() => {
    const startTime = performance.now();
    debugger;
    const endTime = performance.now();
    if (endTime - startTime > 100) {
      // User caught in debugger
      console.error("Access Denied");
    }
  }, 2000);
};

/**
 * nexa
 */
export const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

