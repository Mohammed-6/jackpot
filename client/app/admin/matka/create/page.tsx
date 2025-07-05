import CreateProject from "@/src/admin/matka/createMatka";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="p-6">
      <Suspense fallback={<p>Loading form...</p>}>
        <CreateProject />
      </Suspense>
    </div>
  );
}
