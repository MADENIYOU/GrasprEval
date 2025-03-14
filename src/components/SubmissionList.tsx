import { useEffect, useState } from "react";

export default function SubmissionList() {
  const [submissions, setSubmissions] = useState<string[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/get_submissions");
        const data = await response.json();
        setSubmissions(data.files);
      } catch (error) {
        console.error("Erreur lors de la récupération des soumissions :", error);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="sidebar">
      <h2 className="font-bold mb-4">Copies soumises</h2>
      <ul>
        {submissions.map((sub, index) => (
          <li key={index} className="card">
            {sub}
          </li>
        ))}
      </ul>
    </div>
  );
}