// lib/getExams.ts
export const getExamsByClassId = async (classId: string) => {
    try {
      const response = await fetch(`/api/exams?classId=${encodeURIComponent(classId)}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des examens");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des examens :", error);
      throw error;
    }
  };