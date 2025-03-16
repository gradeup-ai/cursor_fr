import PDFService from '../pdf.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { InterviewResult, Candidate } from '../../types/interview';

const mockAutoTable = jest.fn();
const mockSave = jest.fn();
const mockText = jest.fn();
const mockSetFontSize = jest.fn();
const mockSetFont = jest.fn();
const mockOutput = jest.fn().mockReturnValue(new Blob(['pdf-content'], { type: 'application/pdf' }));

const mockJsPDF = jest.fn().mockImplementation(() => ({
  autoTable: mockAutoTable,
  save: mockSave,
  text: mockText,
  setFontSize: mockSetFontSize,
  setFont: mockSetFont,
  output: mockOutput
}));

jest.mock('jspdf', () => ({
  jsPDF: mockJsPDF
}));

describe('PDFService', () => {
  let mockJsPDF: jest.Mock;

  const mockResult: InterviewResult = {
    id: '1',
    interview_id: '1',
    candidate_id: '1',
    recording_url: 'http://example.com/recording.mp4',
    transcript: 'Interview transcript',
    duration: 30,
    created_at: '2024-03-20T10:00:00Z',
    status: 'reviewed',
    hr_notes: 'Good candidate',
    hr_rating: 4,
    hr_decision: 'accepted'
  };

  const mockCandidate: Candidate = {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    resume_url: 'http://example.com/resume.pdf',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z'
  };

  beforeEach(() => {
    mockJsPDF = jsPDF as unknown as jest.Mock;
    mockJsPDF.mockClear();
    jest.clearAllMocks();
  });

  it('должен сгенерировать PDF отчет', async () => {
    const result = await PDFService.generateInterviewReport(mockResult, mockCandidate);

    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe('application/pdf');
  });

  it('должен включить всю необходимую информацию в отчет', async () => {
    const mockDoc = {
      setFontSize: jest.fn(),
      text: jest.fn(),
      output: jest.fn().mockReturnValue(new Blob(['pdf-content'], { type: 'application/pdf' }))
    };

    jest.mocked(jsPDF).mockImplementation(() => mockDoc);

    await PDFService.generateInterviewReport(mockResult, mockCandidate);

    expect(mockDoc.text).toHaveBeenCalledWith(
      expect.stringContaining('Результаты интервью'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      expect.stringContaining(`${mockCandidate.first_name} ${mockCandidate.last_name}`),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      expect.stringContaining(mockResult.transcript || ''),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      expect.stringContaining(mockResult.hr_notes || ''),
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('should generate interview report', () => {
    const mockResult: InterviewResult = {
      id: '1',
      interview_id: '1',
      candidate_id: '1',
      recording_url: 'test-url',
      transcript: 'test transcript',
      duration: 3600,
      created_at: '2024-03-20',
      status: 'reviewed',
      hr_notes: 'test notes',
      summary: 'test summary',
      score: 85,
      recommendation: 'Hire',
      candidate: {
        id: '1',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe'
      },
      vacancy: {
        id: '1',
        title: 'Software Engineer',
        description: 'Test description'
      }
    };

    const mockDoc = {
      setFontSize: jest.fn(),
      text: jest.fn(),
      save: jest.fn(),
      addPage: jest.fn(),
      splitTextToSize: jest.fn().mockReturnValue(['test']),
      output: jest.fn().mockReturnValue(new Blob(['pdf-content'], { type: 'application/pdf' })),
      internal: {
        scaleFactor: 1
      },
      getStringUnitWidth: jest.fn().mockReturnValue(1),
      getLineHeight: jest.fn().mockReturnValue(1),
      getFontSize: jest.fn().mockReturnValue(1),
      setFont: jest.fn(),
      line: jest.fn(),
      rect: jest.fn(),
      circle: jest.fn(),
      ellipse: jest.fn(),
      roundedRect: jest.fn(),
      triangle: jest.fn(),
      getTextDimensions: jest.fn().mockReturnValue({ w: 1, h: 1 }),
      setTextColor: jest.fn(),
      setFillColor: jest.fn(),
      setDrawColor: jest.fn(),
      setLineCap: jest.fn(),
      setLineJoin: jest.fn(),
      setLineWidth: jest.fn(),
      setLineDashPattern: jest.fn()
    };

    jest.mocked(jsPDF).mockImplementation(() => mockDoc as unknown as jsPDF);

    PDFService.generateInterviewReport(mockResult);

    expect(mockDoc.text).toHaveBeenCalledWith(
      'Interview Report',
      expect.any(Number),
      expect.any(Number)
    );

    expect(mockDoc.text).toHaveBeenCalledWith(
      `Candidate: ${mockResult.candidate.firstName} ${mockResult.candidate.lastName}`,
      expect.any(Number),
      expect.any(Number)
    );

    expect(mockDoc.text).toHaveBeenCalledWith(
      `Position: ${mockResult.vacancy.title}`,
      expect.any(Number),
      expect.any(Number)
    );

    expect(mockDoc.save).toHaveBeenCalledWith('interview-report.pdf');
  });
}); 