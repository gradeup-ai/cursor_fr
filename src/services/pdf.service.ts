import type { InterviewResult } from '../types/interview';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

class PDFService {
  generateInterviewReport(interview: InterviewResult): Blob {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('Interview Report', 20, 20);

    // Add interview details
    doc.setFontSize(12);
    doc.text(`Interview ID: ${interview.interview_id}`, 20, 40);
    doc.text(`Candidate ID: ${interview.candidate_id}`, 20, 50);
    doc.text(`Duration: ${Math.floor(interview.duration / 60)} minutes`, 20, 60);
    doc.text(`Status: ${interview.status}`, 20, 70);
    doc.text(`Created: ${new Date(interview.created_at).toLocaleString()}`, 20, 80);

    // Add transcript
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Transcript', 20, 20);
    doc.setFontSize(12);
    
    const splitTranscript = doc.splitTextToSize(interview.transcript, 170);
    doc.text(splitTranscript, 20, 40);

    // Add HR notes if available
    if (interview.hr_notes) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text('HR Notes', 20, 20);
      doc.setFontSize(12);
      
      const splitNotes = doc.splitTextToSize(interview.hr_notes, 170);
      doc.text(splitNotes, 20, 40);
    }

    // Save the PDF
    return doc.output('blob');
  }
}

export default new PDFService(); 