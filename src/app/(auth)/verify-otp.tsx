import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
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
import { sendOtp, verifyOtp } from "../../api/auth";
const APP_LOGO = require("../../../assets/images/messenger_app_icon.png");

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email || "user***@gmail.com";

  // State lưu mã OTP 6 số
  const [otpCode, setOtpCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(45);
  const [loading, setLoading] = useState(false);

  // Ref để điều khiển bàn phím native của máy
  const inputRef = useRef<TextInput>(null);

  // Đếm ngược 45s gửi lại mã
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Tự động bật bàn phím của máy khi vào màn hình
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Gửi lại mã
  const handleResendOtp = async () => {
    setTimeLeft(45);
    setOtpCode("");
    inputRef.current?.focus();
    Toast.show({
      type: "info",
      text1: "Đã gửi lại mã",
      text2: `Mã OTP mới đã được gửi tới ${email}`,
    });
    await sendOtp(email);
  };

  // TODO: Viết hàm xác thực OTP của bạn tại đây
  const handleVerifyOtp = async () => {
    if (otpCode.length < 6) {
      Toast.show({
        type: "error",
        text1: "Mã OTP chưa đủ",
        text2: "Vui lòng nhập đủ 6 chữ số mã xác thực",
      });
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      console.log("Xác thực OTP:", otpCode, "cho email:", email);
      // TODO: Gọi API xác thực OTP (ví dụ: await authApi.verifyOtp({ email, otp: otpCode }))
      await verifyOtp(otpCode, email);
      Toast.show({
        type: "success",
        text1: "Xác thực thành công",
        text2: "Mời bạn tạo mật khẩu mới",
      });

      // Chuyển sang màn hình tạo mật khẩu mới kèm email và mã OTP
      router.push({
        pathname: "/(auth)/reset-password",
        params: { email, otp: otpCode },
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Mã OTP không đúng",
        text2: error.message || "Mã xác thực không hợp lệ hoặc đã hết hạn",
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
            Xác thực OTP
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
          {/* Emblem & Tiêu đề */}
          <View className="mt-6 items-center text-center">
            <View className="relative mb-4 h-24 w-24 items-center justify-center">
              <View className="absolute inset-0 rounded-full bg-primary/15" />
              <View className="h-20 w-20 items-center justify-center rounded-full border border-slate-100 bg-white shadow-md">
                <View className="h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <MaterialIcons
                    name="mark-email-read"
                    size={32}
                    color="#0084ff"
                  />
                </View>
              </View>
              <View className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full bg-primary shadow-md">
                <MaterialIcons name="lock" size={16} color="#ffffff" />
              </View>
            </View>

            <Text className="text-center text-[25px] font-bold tracking-tight text-slate-900">
              Xác thực mã OTP
            </Text>
            <Text className="mt-1 max-w-xs text-center text-[14px] text-slate-500">
              Chúng tôi đã gửi mã xác thực 6 chữ số đến email
            </Text>

            {/* Email badge & Nút Thay đổi */}
            <View className="mt-2.5 flex-row items-center gap-1.5 rounded-full border border-slate-100 bg-white px-3.5 py-1.5 shadow-sm">
              <MaterialIcons name="alternate-email" size={15} color="#0084ff" />
              <Text className="text-[13px] font-semibold text-slate-800">
                {email}
              </Text>
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <Text className="ml-1 text-[12px] font-semibold text-primary underline">
                  Thay đổi
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ô nhập OTP (Bấm vào sẽ hiện bàn phím số của máy) */}
          <View className="mt-8 items-center">
            {/* Input ẩn nhận sự kiện gõ bàn phím từ máy */}
            <TextInput
              ref={inputRef}
              value={otpCode}
              onChangeText={(text) => {
                // Chỉ nhận tối đa 6 ký tự số
                const clean = text.replace(/[^0-9]/g, "").slice(0, 6);
                setOtpCode(clean);
              }}
              keyboardType="number-pad"
              maxLength={6}
              textContentType="oneTimeCode"
              autoFocus={true}
              style={{
                position: "absolute",
                opacity: 0,
                width: 1,
                height: 1,
              }}
            />

            {/* 6 Ô hiển thị số tương tác */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => inputRef.current?.focus()}
              className="w-full max-w-sm flex-row justify-center gap-2"
            >
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const digit = otpCode[index] || "";
                const isCurrent =
                  index === otpCode.length ||
                  (index === 5 && otpCode.length === 6);
                return (
                  <View
                    key={index}
                    className={`h-14 w-12 items-center justify-center rounded-2xl border bg-white shadow-sm ${
                      digit
                        ? "border-primary bg-blue-50/30"
                        : isCurrent
                          ? "border-primary shadow-md"
                          : "border-slate-200"
                    }`}
                  >
                    {digit ? (
                      <>
                        <Text className="text-[22px] font-bold text-primary">
                          {digit}
                        </Text>
                        <View className="absolute bottom-1.5 h-0.5 w-5 rounded-full bg-primary" />
                      </>
                    ) : (
                      <View className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    )}
                  </View>
                );
              })}
            </TouchableOpacity>

            {/* Đồng hồ đếm ngược / Gửi lại mã */}
            <View className="mt-5 flex-row items-center gap-1.5">
              <Text className="text-[13px] text-slate-500">
                Chưa nhận được mã?
              </Text>
              {timeLeft > 0 ? (
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="schedule" size={15} color="#0084ff" />
                  <Text className="text-[13px] font-semibold text-primary">
                    Gửi lại ({timeLeft < 10 ? `0${timeLeft}` : timeLeft}s)
                  </Text>
                </View>
              ) : (
                <TouchableOpacity onPress={handleResendOtp} activeOpacity={0.7}>
                  <Text className="text-[13px] font-semibold text-primary underline">
                    Gửi lại mã
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Nút Xác nhận OTP */}
          <View className="mx-auto mt-7 w-full max-w-sm">
            <TouchableOpacity
              className="h-13 w-full flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-md shadow-primary/30 active:opacity-90"
              onPress={handleVerifyOtp}
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
                    Xác nhận OTP
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

          {/* Thẻ Bảo mật đa lớp */}
          <View className="mx-auto mt-6 w-full max-w-sm flex-row items-start gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
            <View className="h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <MaterialIcons name="verified-user" size={18} color="#10b981" />
            </View>
            <View className="flex-1">
              <Text className="text-[13px] font-semibold text-slate-900">
                Bảo mật đa lớp
              </Text>
              <Text className="mt-0.5 text-[12px] leading-4 text-slate-500">
                Không bao giờ chia sẻ mã 6 số này với bất kỳ ai, kể cả nhân viên
                hỗ trợ.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
