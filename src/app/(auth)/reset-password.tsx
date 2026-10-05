import { forgotPassword } from "@/api/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
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

const APP_LOGO = require("../../../assets/images/messenger_app_icon.png");

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; otp?: string }>();
  const email = params.email || "";
  const otp = params.otp || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 3 tiêu chí đánh giá độ mạnh mật khẩu
  const hasMinLength = newPassword.length >= 8;
  const hasCase = /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword);
  const hasSymbolOrNum = /[\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
    newPassword
  );

  const score =
    (hasMinLength ? 1 : 0) + (hasCase ? 1 : 0) + (hasSymbolOrNum ? 1 : 0);

  const isMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const isMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  // Lấy nhãn và màu độ mạnh
  const getStrengthInfo = () => {
    if (!newPassword) return { label: "Chưa nhập", color: "text-slate-400" };
    if (score === 1) return { label: "Yếu", color: "text-red-500" };
    if (score === 2) return { label: "Trung bình", color: "text-primary" };
    return { label: "Mạnh", color: "text-emerald-500" };
  };

  const strengthInfo = getStrengthInfo();

  // TODO: Viết hàm gọi API đặt lại mật khẩu mới tại đây
  const handleSubmitNewPassword = async () => {
    if (!hasMinLength || !hasCase || !hasSymbolOrNum) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu chưa đủ mạnh",
        text2: "Vui lòng hoàn thành đủ 3 tiêu chí bảo mật cho mật khẩu",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu không khớp",
        text2: "Mật khẩu xác nhận không trùng khớp",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("Cập nhật mật khẩu mới cho:", { email, otp, newPassword });
      // TODO: Gọi API reset password (ví dụ: await authApi.forgotPassword({ email, otp, newPassword }))
      await forgotPassword(email, newPassword);
      Toast.show({
        type: "success",
        text1: "Đặt lại mật khẩu thành công!",
        text2: "Mời bạn đăng nhập bằng mật khẩu mới",
      });

      // Chuyển người dùng về trang Đăng nhập
      router.replace("/(auth)/login");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi cập nhật mật khẩu",
        text2: error.message || "Không thể đặt lại mật khẩu, vui lòng thử lại",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* Header Bar */}
      <View className="h-14 flex-row items-center justify-between border-b border-slate-100 bg-surface px-4">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => router.back()}
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
            Tạo mật khẩu mới
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
          {/* Security Shield / Lock Emblem */}
          <View className="mt-5 items-center text-center">
            <View className="relative mb-3 h-24 w-24 items-center justify-center">
              <View className="absolute inset-0 rounded-full bg-primary/15" />
              <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-100 shadow-sm">
                <View className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-md">
                  <MaterialIcons name="lock" size={32} color="#ffffff" />
                </View>
              </View>
              {/* Checkmark Badge */}
              <View className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-md">
                <MaterialIcons name="verified" size={17} color="#ffffff" />
              </View>
            </View>

            <Text className="text-center text-[25px] font-bold tracking-tight text-slate-900">
              Tạo mật khẩu mới
            </Text>
            <Text className="mt-1 max-w-xs text-center text-[14px] leading-5 text-slate-500">
              Mật khẩu mới của bạn phải khác với các mật khẩu đã sử dụng trước
              đây để đảm bảo an toàn.
            </Text>
          </View>

          {/* Form Setup */}
          <View className="mt-6 w-full space-y-4">
            {/* Input 1: Mật khẩu mới */}
            <View>
              <Text className="mb-1.5 pl-1 text-[14px] font-semibold text-slate-800">
                Mật khẩu mới
              </Text>
              <View className="h-13 relative flex-row items-center rounded-full border border-slate-100 bg-white px-4 shadow-sm">
                <MaterialIcons name="lock-outline" size={20} color="#0084ff" />
                <TextInput
                  className="ml-3 h-full flex-1 text-[15px] text-slate-900"
                  placeholder="Tối thiểu 8 ký tự"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  activeOpacity={0.7}
                  className="p-1"
                >
                  <MaterialIcons
                    name={showNewPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Strength Checklist & Bar Indicator */}
            <View className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-[12px] font-medium text-slate-500">
                  Độ mạnh mật khẩu
                </Text>
                <Text className={`text-[12px] font-bold ${strengthInfo.color}`}>
                  {strengthInfo.label}
                </Text>
              </View>

              {/* Progress Track (3 thanh đo) */}
              <View className="mb-3 h-1.5 w-full flex-row gap-1 overflow-hidden rounded-full bg-slate-100">
                <View
                  className={`h-full flex-1 rounded-full ${
                    score >= 1
                      ? score === 1
                        ? "bg-red-500"
                        : score === 2
                          ? "bg-primary"
                          : "bg-emerald-500"
                      : "bg-transparent"
                  }`}
                />
                <View
                  className={`h-full flex-1 rounded-full ${
                    score >= 2
                      ? score === 2
                        ? "bg-primary"
                        : "bg-emerald-500"
                      : "bg-transparent"
                  }`}
                />
                <View
                  className={`h-full flex-1 rounded-full ${
                    score >= 3 ? "bg-emerald-500" : "bg-transparent"
                  }`}
                />
              </View>

              {/* 3 Tiêu chí bảo mật */}
              <View className="flex-col gap-1.5">
                {/* Tiêu chí 1: Độ dài */}
                <View className="flex-row items-center gap-2">
                  <MaterialIcons
                    name={
                      hasMinLength ? "check-circle" : "radio-button-unchecked"
                    }
                    size={16}
                    color={hasMinLength ? "#10b981" : "#94a3b8"}
                  />
                  <Text
                    className={`text-[12px] ${
                      hasMinLength
                        ? "font-medium text-slate-900"
                        : "text-slate-500"
                    }`}
                  >
                    Tối thiểu 8 ký tự
                  </Text>
                </View>

                {/* Tiêu chí 2: Chữ hoa & chữ thường */}
                <View className="flex-row items-center gap-2">
                  <MaterialIcons
                    name={hasCase ? "check-circle" : "radio-button-unchecked"}
                    size={16}
                    color={hasCase ? "#10b981" : "#94a3b8"}
                  />
                  <Text
                    className={`text-[12px] ${
                      hasCase ? "font-medium text-slate-900" : "text-slate-500"
                    }`}
                  >
                    Chứa cả chữ hoa và chữ thường
                  </Text>
                </View>

                {/* Tiêu chí 3: Số hoặc ký tự đặc biệt */}
                <View className="flex-row items-center gap-2">
                  <MaterialIcons
                    name={
                      hasSymbolOrNum ? "check-circle" : "radio-button-unchecked"
                    }
                    size={16}
                    color={hasSymbolOrNum ? "#10b981" : "#94a3b8"}
                  />
                  <Text
                    className={`text-[12px] ${
                      hasSymbolOrNum
                        ? "font-medium text-slate-900"
                        : "text-slate-500"
                    }`}
                  >
                    Có ít nhất 1 số hoặc ký tự đặc biệt (!@#$)
                  </Text>
                </View>
              </View>
            </View>

            {/* Input 2: Xác nhận mật khẩu mới */}
            <View>
              <Text className="mb-1.5 pl-1 text-[14px] font-semibold text-slate-800">
                Xác nhận mật khẩu mới
              </Text>
              <View
                className={`h-13 relative flex-row items-center rounded-full border bg-white px-4 shadow-sm ${
                  isMismatch
                    ? "border-red-400 bg-red-50/20"
                    : isMatch
                      ? "border-emerald-400"
                      : "border-slate-100"
                }`}
              >
                <MaterialIcons name="lock-reset" size={20} color="#0084ff" />
                <TextInput
                  className="ml-3 h-full flex-1 text-[15px] text-slate-900"
                  placeholder="Nhập lại mật khẩu mới"
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

              {isMismatch && (
                <View className="mt-1.5 flex-row items-center gap-1 px-3">
                  <MaterialIcons
                    name="error-outline"
                    size={14}
                    color="#ef4444"
                  />
                  <Text className="text-[12px] font-medium text-red-500">
                    Mật khẩu xác nhận không khớp
                  </Text>
                </View>
              )}
            </View>

            {/* Nút Submit */}
            <View className="pt-2">
              <TouchableOpacity
                className="h-13 w-full flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-md shadow-primary/30 active:opacity-90"
                onPress={handleSubmitNewPassword}
                disabled={loading}
                activeOpacity={0.88}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Text className="text-[16px] font-semibold text-white">
                      Lưu mật khẩu mới
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

            {/* Security Notice Footnote */}
            <View className="mt-3 flex-row items-start gap-2.5 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              <MaterialIcons name="devices" size={18} color="#0084ff" />
              <Text className="flex-1 text-[12px] leading-4 text-slate-500">
                Tài khoản của bạn sẽ tự động đăng xuất trên các thiết bị khác
                sau khi đổi mật khẩu thành công để bảo vệ thông tin.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
