import { View, Image, StatusBar } from "react-native";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

import { colors } from "@/styles/colors";

import { Input } from "@/components/input";
import { Button } from "@/components/button";

export default function Register(){
 return (
 <View className="flex-1 bg-green-500 items-center justify-center p-8">

   <StatusBar barStyle="light-content" />

   <Image 
    source={require("@/assets/logo.png")}
    className="h-16"
    resizeMode="contain"
   />
   
   <View className="w-full mt-12 gap-3">
    <Input>
     <FontAwesome6 
      name="user-circle"
      color={colors.green[200]}
      size={20}
     />
     <Input.Field 
      placeholder="Nome Completo"
     />
    </Input>

    <Input>
     <FontAwesome6 
      name="alternate-email"
      color={colors.green[200]}
      size={20}
     />
     <Input.Field 
      placeholder="Seu Email"
      keyboardType="email-address"
     />
    </Input>

    <Button title="Acessar Credencial" />

    <Link 
     href="/register"
     className="text-gray-100 text-base font-bold text-center mt-8"
    >
     Ainda não possui ingresso?
    </Link>
   </View>
  </View>
 )
}