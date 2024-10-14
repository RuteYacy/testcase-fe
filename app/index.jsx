import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StatusBar, Text, View, Image } from 'react-native';

import logo from '../assets/images/logo.png';
import CustomButton from '../components/CustomButton';


export default function App() {
  return (
      <SafeAreaView className="bg-whitePrimary dark:bg-black h-full">
        <ScrollView
          contentContainerStyle={{
            height: "100%",
          }}
        >
          <View className="w-full flex justify-center items-center h-full px-4">
            <Image
              source={logo}
              className='w-44 h-44 my-6'
            />
            <View className="relative">
              <Text className="text-[28px] text-black dark:text-whitePrimary font-bold text-center">
                  Make Informed Choices with{" "}
                <Text className="text-secondary-200">CloudWalk</Text>
              </Text>
            </View>

            <Text className="text-sm text-black dark:text-whitePrimary  mt-7 text-center">
              Where Emotions Meet Analytics: Transform Your Financial Path with CloudWalk
            </Text>

            <CustomButton
              title="Sign In with Email"
              handlePress={() => router.push("/sign-in")}
              containerStyles="w-full mt-7 border border-gray"
              textStyles="text-black dark:text-whitePrimary"
            />
          </View>
        </ScrollView>

        <StatusBar backgroundColor="#161622" style="light" />
      </SafeAreaView>
  );
}
