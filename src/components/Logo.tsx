export default function Logo({ className = '', inverted = false }: { className?: string, inverted?: boolean }) {
  return (
    <img 
      src={inverted ? '/logo-white.svg' : '/logo-black.svg'} 
      alt="CORTUM" 
      className={className}
      style={{ objectFit: 'contain' }} 
    />
  );
}
