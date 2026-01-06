import "./ProfileAvatar.css"
import { ComponentPropsWithoutRef } from "react"

interface ProfileAvatarProp extends ComponentPropsWithoutRef<"div"> {
  width: string
  fontSize: string
}
export const ProfileAvatar = ({
  children,
  width,
  fontSize,
  ...props
}: ProfileAvatarProp) => {
  return (
    <div className="profile-avatar" style={{ width, fontSize }} {...props}>
      {children}
    </div>
  )
}
