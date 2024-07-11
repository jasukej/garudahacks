interface AvatarProps {
    src?: string | null | undefined
}

const Avatar = ({ src }:AvatarProps) => {
  return (
    <div className="rounded-full">
        <img 
            src={src || '/src/assets/placeholder.jpeg'}
            height={30}
            width={30}
            style={{ objectFit: 'cover', borderRadius: 20 }}
        />
    </div>
  )
}

export default Avatar