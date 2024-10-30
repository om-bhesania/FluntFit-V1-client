import logo from "../assets/images/logo.png";
interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <img
      src={logo}
      alt="Flaunt Fit"
      className={`h-[170px] ${className && className}`}
    />
  );
};

export default Logo;
