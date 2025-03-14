"use client";

import { useState } from "react";
import SubmissionList from "../../components/SubmissionList";
import CorrectionButton from "../../components/CorrectionButton";
import CorrectionResults from "../../components/CorrectionResults";

export default function Home() {
  const [correctionResult, setCorrectionResult] = useState<any>(null); 
  const [taskId, setTaskId] = useState<string | null>(null);

  return (
    <div className="flex flex-grow">
      <SubmissionList />
      <CorrectionButton
        setCorrectionResult={setCorrectionResult}
        taskId={taskId}
        setTaskId={setTaskId}
      />
      <CorrectionResults correctionResult={correctionResult} />
    </div>
  );
}