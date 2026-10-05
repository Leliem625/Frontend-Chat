import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { sendOtp } from "../../api/auth";
const APP_LOGO = require("../../../assets/images/messenger_app_icon.png");

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Kiểm tra email hợp lệ
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // TODO: Viết hàm gọi API gửi mã OTP quên mật khẩu tại đây
  const handleSendOtp = async () => {
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Chưa nhập email",
        text2: "Vui lòng nhập địa chỉ email của bạn",
      });
      return;
    }

    if (!isValidEmail) {
      Toast.show({
        type: "error",
        text1: "Email không hợp lệ",
        text2: "Vui lòng nhập đúng định dạng email (vd: name@gmail.com)",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("Gửi mã OTP đến:", email);
      // TODO: Gọi API gửi OTP (ví dụ: await sendOtp(email);)
      await sendOtp(email);
      Toast.show({
        type: "success",
        text1: "Mã OTP đã được gửi",
        text2: "Vui lòng kiểm tra hòm thư email của bạn",
      });

      // Chuyển sang màn hình xác thực OTP kèm email đã nhập
      router.push({
        pathname: "/(auth)/verify-otp",
        params: { email: email.trim() },
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Không thể gửi OTP",
        text2: error.message || "Vui lòng thử lại sau",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(auth)/login");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* Header Bar */}
      <View className="h-14 flex-row items-center justify-between border-b border-slate-100 bg-surface px-4">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            className="h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm"
          >
            <MaterialIcons name="arrow-back" size={22} color="#0f172a" />
          </TouchableOpacity>
          <View className="ml-1 h-8 w-8 overflow-hidden rounded-xl border border-slate-100 bg-white p-0.5">
            <Image
              source={APP_LOGO}
              style={{ width: "100%", height: "100%", borderRadius: 6 }}
              contentFit="contain"
            />
          </View>
          <Text className="ml-1 text-[17px] font-semibold tracking-tight text-slate-800">
            Quên mật khẩu
          </Text>
        </View>

        <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
          <MaterialIcons name="person" size={18} color="#ffffff" />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="px-5 pb-8"
        >
          {/* Glowing Lock Emblem */}
          <View className="mt-6 items-center text-center">
            <View className="relative mb-4 h-24 w-24 items-center justify-center">
              <View className="absolute inset-0 rounded-full bg-primary/15" />
              <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/20 shadow-sm">
                <View className="h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
                  <MaterialIcons name="lock-reset" size={32} color="#0084ff" />
                </View>
              </View>
              {/* Key badge */}
              <View className="absolute -top-1 right-1 h-6 w-6 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm">
                <MaterialIcons name="vpn-key" size={13} color="#0084ff" />
              </View>
            </View>

            <Text className="text-center text-[26px] font-bold tracking-tight text-slate-900">
              Quên mật khẩu?
            </Text>
            <Text className="mt-2 max-w-[320px] text-center text-[14px] leading-5 text-slate-500">
              Đừng lo lắng! Vui lòng nhập địa chỉ email liên kết với tài khoản
              của bạn để nhận mã xác thực OTP.
            </Text>
          </View>

          {/* Form Content */}
          <View className="mt-6 w-full space-y-4">
            {/* Input Email */}
            <View>
              <View className="mb-1.5 flex-row items-center justify-between pl-1">
                <Text className="text-[14px] font-semibold text-slate-800">
                  Email đăng ký
                </Text>
                {isValidEmail && (
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons
                      name="check-circle"
                      size={14}
                      color="#10b981"
                    />
                    <Text className="text-[12px] font-semibold text-emerald-600">
                      Hợp lệ
                    </Text>
                  </View>
                )}
              </View>

              <View className="h-13 relative flex-row items-center rounded-full border border-slate-100 bg-white px-4 shadow-sm">
                <MaterialIcons name="mail" size={20} color="#0084ff" />
                <TextInput
                  className="ml-3 h-full flex-1 text-[15px] text-slate-900"
                  placeholder="example@gmail.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {email.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setEmail("")}
                    activeOpacity={0.7}
                    className="p-1"
                  >
                    <MaterialIcons name="cancel" size={18} color="#94a3b8" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Explanatory Helper Hint */}
              <View className="mt-2 flex-row items-center gap-1.5 px-1">
                <MaterialIcons
                  name="mark-email-unread"
                  size={16}
                  color="#0084ff"
                />
                <Text className="text-[12px] text-slate-500">
                  Chúng tôi sẽ gửi mã gồm 6 chữ số đến hòm thư này.
                </Text>
              </View>
            </View>

            {/* Security Micro-Card / Trust Badge */}
            <View className="mt-3 flex-row items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
              <View className="h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <MaterialIcons name="verified-user" size={20} color="#0084ff" />
              </View>
              <View className="flex-1">
                <Text className="text-[13px] font-semibold text-slate-900">
                  Bảo mật đa lớp
                </Text>
                <Text className="mt-0.5 text-[12px] leading-4 text-slate-500">
                  Mã xác thực chỉ có hiệu lực trong 5 phút để bảo vệ bạn.
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <View className="pt-3">
              <TouchableOpacity
                className="h-13 w-full flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-md shadow-primary/30 active:opacity-90"
                onPress={handleSendOtp}
                disabled={loading}
                activeOpacity={0.88}
              >
                {loading ? (
                  <View className="p-4">
                    <ActivityIndicator color="#ffffff" />
                  </View>
                ) : (
                  <View className="flex-row items-center justify-center gap-3 p-4">
                    <Text className="text-[16px] font-semibold text-white">
                      Gửi mã xác thực
                    </Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={19}
                      color="#ffffff"
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Secondary Footer Actions */}
          <View className="mt-8 flex-col items-center justify-center gap-3">
            <View className="flex-row items-center justify-center">
              <Text className="text-[14px] text-slate-500">
                Nhớ lại mật khẩu?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/login")}
                activeOpacity={0.7}
              >
                <Text className="text-[14px] font-semibold text-primary">
                  Quay lại Đăng nhập
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Support Badge */}
            <View className="mt-2 flex-row items-center gap-1.5 rounded-full border border-slate-100 bg-white px-4 py-1.5 shadow-sm">
              <MaterialIcons name="support-agent" size={16} color="#10b981" />
              <Text className="text-[12px] text-slate-600">
                Cần trợ giúp thêm?
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="ml-1 text-[12px] font-semibold text-primary">
                  Liên hệ hỗ trợ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
