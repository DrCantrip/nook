import { useRouter } from "expo-router";
import { ErrorScreenTemplate } from "../src/components/organisms/ErrorScreenTemplate";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <ErrorScreenTemplate
      title="This corner doesn't exist"
      body="The page you're looking for might have moved, or the link might be out of date."
      primaryAction={{
        label: "Back to home",
        onPress: () => router.replace("/"),
      }}
    />
  );
}
