"use server";

import IncidentList from "@/app/Components/responder/IncidentList";
import { fetchAllIncidents } from "@/app/lib/action";

export default async function Page() {
  const reports = await fetchAllIncidents(); 

  return (
    <div className="mx-5">
      <IncidentList reports={reports} />
    </div>
  );
}
