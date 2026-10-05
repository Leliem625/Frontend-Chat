import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const APP_LOGO = require("../../../assets/images/messenger_app_icon.png");

export default function WelcomeScreen() {
  const router = useRouter();

  const handleSkip = () => {
    router.replace("/(auth)/login");
  };

  const handleGetStarted = () => {
    router.push("/(auth)/register");
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* Header với nút Bỏ qua */}
      <View className="h-11 flex-row items-center justify-end px-5">
        <TouchableOpacity
          className="rounded-full bg-white/80 px-3.5 py-1.5 active:opacity-75"
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text className="text-sm font-medium text-slate-500">Bỏ qua</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
        className="px-5 pb-4"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Khu vực Hero minh họa */}
        <View className="relative w-full flex-col items-center justify-center py-3">
          {/* Hiệu ứng vầng sáng nền (Glow backlight backdrop) */}
          <View className="absolute h-56 w-56 -translate-y-2 rounded-full bg-primary/15 opacity-90" />
          <View className="absolute h-36 w-36 translate-x-10 translate-y-4 rounded-full bg-cyan-400/20 opacity-90" />

          {/* Hero Visual Composition */}
          <View className="relative h-52 w-64 items-center justify-center">
            {/* Huy hiệu nổi bên trái: Bảo mật đa tầng */}
            <View className="absolute left-0 top-6 z-20 flex-row items-center gap-1.5 rounded-full border border-slate-100 bg-white/95 px-3 py-1.5 shadow-sm">
              <MaterialIcons name="lock" size={15} color="#10b981" />
              <Text className="text-[11px] font-semibold text-slate-800">
                Bảo mật đa tầng
              </Text>
            </View>

            {/* Biểu tượng cảm xúc nổi bên phải trên: ✨ */}
            <View className="absolute right-2 top-2 z-20 h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm">
              <Text className="text-lg">✨</Text>
            </View>

            {/* Logo ứng dụng chính */}
            <View className="relative z-10 rounded-[2.5rem] border border-black/5 bg-white p-2.5 shadow-xl">
              <LinearGradient
                colors={["#0084ff", "#00a3ff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: 32,
                  padding: 2,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={APP_LOGO}
                  style={{ width: "100%", height: "100%", borderRadius: 30 }}
                  contentFit="cover"
                />
              </LinearGradient>

              {/* Chấm trực tuyến màu xanh lá */}
              <View className="absolute bottom-3 right-3 h-5 w-5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
            </View>

            {/* Huy hiệu nổi bên phải dưới: Gọi thoại HD */}
            <View className="absolute bottom-4 right-0 z-20 flex-row items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 shadow-md">
              <MaterialIcons name="videocam" size={15} color="#ffffff" />
              <Text className="text-[11px] font-bold tracking-tight text-white">
                Gọi thoại HD
              </Text>
            </View>
          </View>
        </View>

        {/* Tiêu đề & Lời giới thiệu */}
        <View className="flex-col items-center px-1 text-center">
          <Text className="text-center text-[25px] font-bold leading-[32px] tracking-tight text-slate-900">
            Kết nối nhanh chóng,{"\n"}trò chuyện không giới hạn
          </Text>
          <Text className="mt-2.5 max-w-sm text-center text-[14px] font-normal leading-5 text-slate-500">
            Trải nghiệm nhắn tin tức thì, gọi thoại HD chất lượng cao và chia sẻ
            từng khoảnh khắc ý nghĩa cùng bạn bè hoàn toàn miễn phí.
          </Text>
        </View>

        {/* Danh sách 3 thẻ tính năng */}
        <View className="my-4 w-full flex-col gap-2.5">
          {/* Card 1: Trợ lý AI */}
          <View className="flex-row items-center gap-3.5 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <View className="h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <MaterialIcons name="smart-toy" size={22} color="#0084ff" />
            </View>
            <View className="flex-1 text-left">
              <Text className="text-[14px] font-semibold text-slate-900">
                Trợ lý AI thông minh
              </Text>
              <Text
                className="mt-0.5 text-[12px] leading-4 text-slate-500"
                numberOfLines={2}
              >
                Hỗ trợ dịch thuật trực tiếp, tóm tắt và gợi ý phản hồi nhanh
                chóng.
              </Text>
            </View>
          </View>

          {/* Card 2: Lưu trữ đám mây */}
          <View className="flex-row items-center gap-3.5 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <View className="h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <MaterialIcons name="cloud-done" size={22} color="#0084ff" />
            </View>
            <View className="flex-1 text-left">
              <Text className="text-[14px] font-semibold text-slate-900">
                Lưu trữ đám mây vĩnh viễn
              </Text>
              <Text
                className="mt-0.5 text-[12px] leading-4 text-slate-500"
                numberOfLines={2}
              >
                Hình ảnh, video và tệp tài liệu lưu trữ an toàn, không lo hết
                hạn.
              </Text>
            </View>
          </View>

          {/* Card 3: Hội nhóm & Cộng đồng */}
          <View className="flex-row items-center gap-3.5 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <View className="h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <MaterialIcons name="groups" size={22} color="#0084ff" />
            </View>
            <View className="flex-1 text-left">
              <Text className="text-[14px] font-semibold text-slate-900">
                Hội nhóm & Cộng đồng lớn
              </Text>
              <Text
                className="mt-0.5 text-[12px] leading-4 text-slate-500"
                numberOfLines={2}
              >
                Tạo nhóm kết nối không giới hạn, chia sẻ khoảnh khắc vui vẻ cùng
                bạn bè.
              </Text>
            </View>
          </View>
        </View>

        {/* Khu vực phân trang & Nút hành động */}
        <View className="mt-auto w-full flex-col items-center gap-3.5 pt-1">
          {/* Thanh chấm chỉ báo phân trang (Pagination Dots) */}
          <View className="flex-row items-center justify-center gap-1.5">
            <View className="h-2 w-7 rounded-full bg-primary" />
            <View className="h-2 w-2 rounded-full bg-slate-200" />
            <View className="h-2 w-2 rounded-full bg-slate-200" />
          </View>

          {/* Nút hành động chính: Bắt đầu khám phá */}
          <View className="w-full flex-col items-center gap-2.5">
            <TouchableOpacity
              className="h-13 w-full flex-row items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 shadow-lg active:opacity-90"
              onPress={handleGetStarted}
              activeOpacity={0.88}
            >
              <Text className="text-[15px] font-semibold text-white">
                Bắt đầu khám phá
              </Text>
              <MaterialIcons name="arrow-forward" size={19} color="#ffffff" />
            </TouchableOpacity>

            {/* Nút chuyển sang Đăng nhập */}
            <TouchableOpacity
              className="flex-row items-center gap-1 rounded-full px-4 py-1.5 active:opacity-75"
              onPress={handleLogin}
              activeOpacity={0.7}
            >
              <Text className="text-[13px] text-slate-500">
                Đã có tài khoản?{" "}
              </Text>
              <Text className="text-[13px] font-semibold text-primary">
                Đăng nhập
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
