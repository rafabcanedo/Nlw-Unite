import { TouchableOpacity, TouchableOpacityProps, Text, ActivityIndicator } from "react-native";

type ButtonProps = TouchableOpacityProps & {
 title: string
 isLoading?: boolean
}

export function Button({ title, isLoading = false, ...rest }: ButtonProps) {
 return (
  <TouchableOpacity
   className="w-full h-14 bg-orange-500 items-center justify-center rounded-lg"
   activeOpacity={0.7}
   disabled={isLoading}
   {...rest}
  >
   {isLoading ? (
    <ActivityIndicator className="text-green-500" />
   ) : (
   <Text className="text-green-500 text-base font-bold uppercase">
    {title}
   </Text>
   )}
  </TouchableOpacity>
 )
}