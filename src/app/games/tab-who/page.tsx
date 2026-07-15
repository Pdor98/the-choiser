import { Suspense } from "react";

import { PageExitBar } from "@/components/layout/page-exit-bar";
import { TabWhoExperience } from "@/features/games/tab-who-experience";

export default function TabWhoPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={null}>
        <TabWhoExperience />
      </Suspense>
      <PageExitBar description="Quando chiudi un round puoi tornare alla Home o spostarti subito su un’altra sezione senza perdere tempo." />
    </div>
  );
}
