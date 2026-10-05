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
import { register } from "../../api/auth";
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

export default function RegisterScreen() {
  const router = useRouter();

  // State quản lý form đăng ký
  const [fullName, setFullName] = useState("");
  const [userContact, setUserContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // TODO: Viết hàm gọi API đăng ký của bạn tại đây
  const handleRegister = async () => {
    // 1. Kiểm tra validation cơ bản
    if (!fullName.trim() || !userContact.trim() || !password) {
      Toast.show({
        type: "error",
        text1: "Thông tin chưa đủ",
        text2: "Vui lòng nhập đầy đủ các trường bắt buộc",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu không khớp",
        text2: "Mật khẩu và xác nhận mật khẩu phải giống nhau",
      });
      return;
    }

    if (!agreeTerms) {
      Toast.show({
        type: "error",
        text1: "Chưa đồng ý điều khoản",
        text2: "Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("Submit register:", { fullName, userContact, password });
      await register(fullName, userContact, password);
      router.replace("/(auth)/login");
    } catch (error: any) {
      const msg =
        error.message ||
        error.response?.data?.message ||
        "Đăng ký thất bại, vui lòng thử lại";
      Toast.show({
        type: "error",
        text1: "Lỗi đăng ký",
        text2: msg,
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

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  const handleHelp = () => {
    Toast.show({
      type: "info",
      text1: "Hỗ trợ",
      text2: "Liên hệ bộ phận chăm sóc khách hàng: support@chat.com",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* Top Navigation Bar */}
      <View className="h-11 flex-row items-center justify-between px-4">
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          className="h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white/80 shadow-sm"
        >
          <MaterialIcons name="arrow-back" size={20} color="#0f172a" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleHelp}
          activeOpacity={0.7}
          className="flex-row items-center gap-1 px-2 py-1"
        >
          <MaterialIcons name="help-outline" size={18} color="#0084ff" />
          <Text className="text-[13px] font-semibold text-primary">Hỗ trợ</Text>
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
          className="px-5 pb-8"
        >
          {/* Brand Showcase & Title */}
          <View className="my-3 flex-col items-center text-center">
            <View className="relative mb-2">
              <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-white p-1 shadow-sm">
                <Image
                  source={APP_LOGO}
                  style={{ width: "100%", height: "100%", borderRadius: 30 }}
                  contentFit="cover"
                />
              </View>
              {/* Active status ring */}
              <View className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
            </View>

            <Text className="text-center text-[25px] font-bold tracking-tight text-slate-900">
              Tạo tài khoản mới
            </Text>
            <Text className="mt-1 max-w-[280px] text-center text-[14px] leading-5 text-slate-500">
              Kết nối trò chuyện cùng bạn bè và đồng nghiệp chỉ trong vài giây.
            </Text>
          </View>

          {/* Registration Form */}
          <View className="w-full flex-col gap-3">
            {/* Input 1: Họ và tên */}
            <View className="flex-col gap-1">
              <Text className="pl-1 text-[12px] font-semibold text-slate-600">
                Họ và tên
              </Text>
              <View className="h-13 flex-row items-center rounded-full border border-slate-100 bg-white px-4 shadow-sm">
                <MaterialIcons name="person" size={20} color="#0084ff" />
                <TextInput
                  className="ml-3 h-full flex-1 text-[15px] text-slate-900"
                  placeholder="Nguyễn Văn A"
                  placeholderTextColor="#94a3b8"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Input 2: Email hoặc Số điện thoại */}
            <View className="flex-col gap-1">
              <Text className="pl-1 text-[12px] font-semibold text-slate-600">
                Email hoặc Số điện thoại
              </Text>
              <View className="h-13 flex-row items-center rounded-full border border-slate-100 bg-white px-4 shadow-sm">
                <MaterialIcons name="mail" size={20} color="#0084ff" />
                <TextInput
                  className="ml-3 h-full flex-1 text-[15px] text-slate-900"
                  placeholder="name@example.com hoặc 0912..."
                  placeholderTextColor="#94a3b8"
                  value={userContact}
                  onChangeText={setUserContact}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Input 3: Mật khẩu */}
            <View className="flex-col gap-1">
              <Text className="pl-1 text-[12px] font-semibold text-slate-600">
                Mật khẩu
              </Text>
              <View className="h-13 flex-row items-center rounded-full border border-slate-100 bg-white px-4 shadow-sm">
                <MaterialIcons name="lock" size={20} color="#0084ff" />
                <TextInput
                  className="ml-3 h-full flex-1 text-[15px] text-slate-900"
                  placeholder="Tối thiểu 8 ký tự"
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

            {/* Input 4: Xác nhận mật khẩu */}
            <View className="flex-col gap-1">
              <Text className="pl-1 text-[12px] font-semibold text-slate-600">
                Xác nhận mật khẩu
              </Text>
              <View className="h-13 flex-row items-center rounded-full border border-slate-100 bg-white px-4 shadow-sm">
                <MaterialIcons name="lock-outline" size={20} color="#0084ff" />
                <TextInput
                  className="ml-3 h-full flex-1 text-[15px] text-slate-900"
                  placeholder="Nhập lại mật khẩu"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                  className="p-1"
                >
                  <MaterialIcons
                    name={showConfirmPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Checkbox Đồng ý điều khoản */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAgreeTerms(!agreeTerms)}
              className="flex-row items-start gap-2.5 px-1 pt-2"
            >
              <View
                className={`mt-0.5 h-5 w-5 items-center justify-center rounded-md border ${
                  agreeTerms
                    ? "border-primary bg-primary"
                    : "border-slate-300 bg-white"
                }`}
              >
                {agreeTerms && (
                  <MaterialIcons name="check" size={14} color="#ffffff" />
                )}
              </View>
              <Text className="flex-1 text-[13px] leading-5 text-slate-600">
                Tôi đồng ý với{" "}
                <Text className="font-medium text-primary underline">
                  Điều khoản dịch vụ
                </Text>{" "}
                và{" "}
                <Text className="font-medium text-primary underline">
                  Chính sách bảo mật
                </Text>{" "}
                của ứng dụng.
              </Text>
            </TouchableOpacity>

            {/* Nút Đăng ký (Primary CTA Button) */}
            <TouchableOpacity
              className="mt-3 h-12 w-full flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-md shadow-primary/30 active:opacity-90"
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.88}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text className="text-[16px] font-semibold text-white">
                    Đăng ký
                  </Text>
                  <MaterialIcons
                    name="arrow-forward"
                    size={19}
                    color="#ffffff"
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Dải phân cách "Hoặc đăng ký bằng" */}
          <View className="relative my-6 flex-row items-center justify-center">
            <View className="h-[1px] w-full bg-slate-200" />
            <Text className="absolute bg-surface px-3 text-[12px] font-medium text-slate-400">
              Hoặc đăng ký bằng
            </Text>
          </View>

          {/* Các nút Đăng ký mạng xã hội */}
          <View className="grid w-full flex-row gap-3">
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

          {/* Footer Link chuyển về Đăng nhập */}
          <View className="mt-8 flex-row items-center justify-center text-center">
            <Text className="text-[14px] text-slate-500">
              Đã có tài khoản?{" "}
            </Text>
            <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
              <Text className="text-[14px] font-semibold text-primary">
                Đăng nhập ngay
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
