import { ComponentPropsWithoutRef } from "react"
import "./Button.css"

// 1. Define the Interface
// Extending ComponentPropsWithoutRef ensures all native button attributes are included.
interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "warning"
}

// 2. Apply the Interface
const Button = ({ children, variant, className, ...props }: ButtonProps) => {
  const buttonVariant = variant ?? "primary"
  let buttonClass = "ds-button "
  if (buttonVariant === "primary") {
    buttonClass += "ds-button--primary"
  } else if (buttonVariant === "secondary") {
    buttonClass += "ds-button--secondary"
  } else {
    buttonClass += "ds-button--warning"
  }
  if (className) {
    buttonClass = `${buttonClass} ${className}`
  }
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  )
}

export default Button
