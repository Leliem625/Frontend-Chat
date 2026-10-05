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
import Svg, { Path } from "react-native-svg";
import Toast from "react-native-toast-message";

import { useAuth } from "@/context/auth";

const APP_LOGO = require("../../../assets/images/messenger_app_icon.png");

// Logo Google chuẩn 4 màu chính hãng
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
        fill="#4285F4"
      />
      <Path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
        fill="#34A853"
      />
      <Path
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12c0 2.03.45 3.84 1.25 5.42l4.03-3.15z"
        fill="#FBBC05"
      />
      <Path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        fill="#EA4335"
      />
    </Svg>
  );
}

// Logo Apple chuẩn
function AppleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.65-.8 1.1-1.91.98-3.02-1 .04-2.13.67-2.79 1.45-.58.67-1.1 1.77-.96 2.85 1.12.09 2.12-.58 2.77-1.28z"
        fill="#000000"
      />
    </Svg>
  );
}

// Logo Facebook chuẩn
function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        fill="#1877F2"
      />
    </Svg>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  // State quản lý form
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      Toast.show({
        type: "error",
        text1: "Thông tin chưa đủ",
        text2: "Vui lòng nhập tài khoản và mật khẩu",
      });
      return;
    }

    setLoading(true);
    try {
      await login(identifier, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      const msg =
        error.message ||
        error.response?.data?.message ||
        "Tài khoản hoặc mật khẩu không chính xác";
      Toast.show({
        type: "error",
        text1: "Lỗi đăng nhập",
        text2: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(auth)/welcome");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* Header với nút quay lại */}
      <View className="h-11 flex-row items-center px-4">
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          className="h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white/80 shadow-sm"
        >
          <MaterialIcons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="px-5 pb-6"
        >
          {/* Vầng sáng nền tinh tế */}
          <View className="relative w-full flex-col items-center pt-2">
            <View className="absolute -top-10 h-64 w-64 rounded-full bg-primary/10 opacity-70" />
            <View className="absolute right-0 top-16 h-44 w-44 rounded-full bg-slate-200/50 opacity-60" />

            {/* Logo App thương hiệu với chấm online */}
            <View className="relative my-3 items-center justify-center">
              <View className="h-20 w-20 items-center justify-center rounded-2xl border border-slate-100 bg-white p-2 shadow-md">
                <Image
                  source={APP_LOGO}
                  style={{ width: "100%", height: "100%", borderRadius: 12 }}
                  contentFit="contain"
                />
              </View>
              {/* Chấm trực tuyến (Online ping dot) */}
              <View className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
            </View>

            {/* Tiêu đề & Lời chào mừng */}
            <View className="mb-6 px-4 text-center">
              <Text className="mb-1 text-center text-[26px] font-bold tracking-tight text-slate-900">
                Chào mừng trở lại!
              </Text>
              <Text className="max-w-xs text-center text-[14px] leading-5 text-slate-500">
                Đăng nhập để tiếp tục trò chuyện cùng bạn bè và kết nối tức thì.
              </Text>
            </View>

            {/* Form đăng nhập */}
            <View className="w-full space-y-4">
              {/* Ô nhập Tài khoản */}
              <View>
                <Text className="mb-1.5 pl-1 text-[12px] font-semibold text-slate-600">
                  Tài khoản
                </Text>
                <View className="h-13 relative flex-row items-center rounded-2xl border border-slate-100 bg-white px-4 shadow-sm">
                  <MaterialIcons
                    name="alternate-email"
                    size={20}
                    color="#64748b"
                  />
                  <TextInput
                    className="ml-3 h-full flex-1 text-[15px] text-slate-900"
                    placeholder="Email hoặc số điện thoại"
                    placeholderTextColor="#94a3b8"
                    value={identifier}
                    onChangeText={setIdentifier}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Ô nhập Mật khẩu */}
              <View className="mt-3">
                <Text className="mb-1.5 pl-1 text-[12px] font-semibold text-slate-600">
                  Mật khẩu
                </Text>
                <View className="h-13 relative flex-row items-center rounded-2xl border border-slate-100 bg-white px-4 shadow-sm">
                  <MaterialIcons name="lock" size={20} color="#64748b" />
                  <TextInput
                    className="ml-3 h-full flex-1 text-[15px] text-slate-900"
                    placeholder="Mật khẩu của bạn"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                    className="p-1"
                  >
                    <MaterialIcons
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={20}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Link Quên mật khẩu */}
              <View className="flex-row justify-end pt-1">
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  activeOpacity={0.7}
                  className="py-1"
                >
                  <Text className="text-[13px] font-semibold text-primary">
                    Quên mật khẩu?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Nút Đăng nhập */}
              <View className="pt-2">
                <TouchableOpacity
                  className="h-12 w-full flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-md shadow-primary/30 active:opacity-90"
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.88}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <>
                      <Text className="text-[16px] font-semibold text-white">
                        Đăng nhập
                      </Text>
                      <MaterialIcons
                        name="arrow-forward"
                        size={18}
                        color="#ffffff"
                      />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Dải phân cách "Hoặc tiếp tục với" */}
            <View className="my-6 w-full flex-row items-center">
              <View className="h-[1px] flex-1 bg-slate-200" />
              <Text className="px-3 text-[12px] font-medium text-slate-400">
                Hoặc tiếp tục với
              </Text>
              <View className="h-[1px] flex-1 bg-slate-200" />
            </View>

            {/* Các nút Đăng nhập mạng xã hội */}
            <View className="w-full flex-row gap-3">
              {/* Google */}
              <TouchableOpacity
                className="h-12 flex-1 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm active:scale-95"
                activeOpacity={0.7}
              >
                <GoogleIcon size={22} />
              </TouchableOpacity>

              {/* Apple */}
              <TouchableOpacity
                className="h-12 flex-1 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm active:scale-95"
                activeOpacity={0.7}
              >
                <AppleIcon size={22} />
              </TouchableOpacity>

              {/* Facebook */}
              <TouchableOpacity
                className="h-12 flex-1 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm active:scale-95"
                activeOpacity={0.7}
              >
                <FacebookIcon size={22} />
              </TouchableOpacity>
            </View>

            {/* Link Đăng ký ngay */}
            <View className="mt-8 flex-row items-center justify-center text-center">
              <Text className="text-[14px] text-slate-500">
                Chưa có tài khoản?{" "}
              </Text>
              <TouchableOpacity onPress={handleRegister} activeOpacity={0.7}>
                <Text className="text-[14px] font-semibold text-primary">
                  Đăng ký ngay
                </Text>
              </TouchableOpacity>
            </View>

            {/* Chú thích Điều khoản & Quyền riêng tư */}
            <View className="mt-6 px-4 text-center">
              <Text className="text-center text-[11px] leading-4 text-slate-400">
                Bằng việc tiếp tục, bạn đồng ý với{" "}
                <Text className="text-slate-500 underline">
                  Điều khoản dịch vụ
                </Text>{" "}
                và{" "}
                <Text className="text-slate-500 underline">
                  Chính sách bảo mật
                </Text>{" "}
                của ứng dụng.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
