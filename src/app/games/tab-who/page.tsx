import { PageExitBar } from "@/components/layout/page-exit-bar";
import { TabWhoGame } from "@/features/games/tab-who";

export default function TabWhoPage() {
  return (
    <div className="space-y-8">
      <TabWhoGame />
      <PageExitBar description="Quando chiudi un round puoi tornare alla Home o spostarti subito su un’altra sezione senza perdere tempo." />
    </div>
  );
}
