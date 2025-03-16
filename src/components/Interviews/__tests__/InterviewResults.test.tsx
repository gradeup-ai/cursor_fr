import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InterviewResults from '../InterviewResults';
import InterviewResultsService from '../../../services/interview-results.service';
import CandidateService from '../../../services/candidate.service';
import PDFService from '../../../services/pdf.service';

// Мокаем jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
    output: jest.fn().mockReturnValue(new Blob(['test']))
  }));
});

jest.mock('../../../services/interview-results.service');
jest.mock('../../../services/candidate.service');
jest.mock('../../../services/pdf.service');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' })
}));

const mockCandidate = {
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  created_at: '2024-03-20T10:00:00Z',
  updated_at: '2024-03-20T10:00:00Z'
};

const mockInterviewResult = {
  id: '1',
  interview_id: '1',
  candidate_id: '1',
  recording_url: 'http://example.com/recording.mp4',
  transcript: 'Interview transcript',
  duration: 3600,
  created_at: '2024-03-20T10:00:00Z',
  updated_at: '2024-03-20T10:00:00Z',
  status: 'pending',
  hr_notes: 'Good candidate',
  hr_rating: 4,
  hr_decision: 'pending'
};

const renderInterviewResults = () => {
  render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InterviewResults />} />
      </Routes>
    </BrowserRouter>
  );
};

describe('InterviewResults', () => {
  beforeEach(() => {
    (InterviewResultsService.getInterviewResult as jest.Mock).mockResolvedValue(mockInterviewResult);
    (CandidateService.getCandidate as jest.Mock).mockResolvedValue(mockCandidate);
    (InterviewResultsService.getInterviewAnalytics as jest.Mock).mockResolvedValue({
      total_interviews: 10,
      average_duration: 3600,
      acceptance_rate: 70
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен загрузить и отобразить результаты интервью', async () => {
    renderInterviewResults();

    await waitFor(() => {
      expect(screen.getByText('Результаты интервью')).toBeInTheDocument();
      expect(screen.getByText('Транскрипт интервью')).toBeInTheDocument();
      const transcriptSection = screen.getByRole('heading', { name: 'Транскрипт интервью' }).parentElement;
      expect(transcriptSection).toHaveTextContent('Interview transcript');
      expect(screen.getByText('Good candidate')).toBeInTheDocument();
      expect(screen.getByDisplayValue('4')).toBeInTheDocument();
    });
  });

  it('должен обновить заметки HR', async () => {
    renderInterviewResults();

    await waitFor(() => {
      expect(screen.getByLabelText(/заметки/i)).toBeInTheDocument();
    });

    const notesTextarea = screen.getByLabelText(/заметки/i);
    fireEvent.change(notesTextarea, { target: { value: 'Updated notes' } });

    const saveButton = screen.getByText(/сохранить/i);
    fireEvent.click(saveButton);

    expect(InterviewResultsService.updateInterviewResult).toHaveBeenCalledWith('1', expect.objectContaining({
      hr_notes: 'Updated notes'
    }));
  });

  it('должен обновить рейтинг HR', async () => {
    renderInterviewResults();

    await waitFor(() => {
      expect(screen.getByLabelText(/оценка/i)).toBeInTheDocument();
    });

    const ratingInput = screen.getByLabelText(/оценка/i);
    fireEvent.change(ratingInput, { target: { value: '5' } });

    const saveButton = screen.getByText(/сохранить/i);
    fireEvent.click(saveButton);

    expect(InterviewResultsService.updateInterviewResult).toHaveBeenCalledWith('1', expect.objectContaining({
      hr_rating: 5
    }));
  });

  it('должен обновить решение HR', async () => {
    renderInterviewResults();

    await waitFor(() => {
      expect(screen.getByLabelText(/решение/i)).toBeInTheDocument();
    });

    const decisionSelect = screen.getByLabelText(/решение/i);
    fireEvent.change(decisionSelect, { target: { value: 'accepted' } });

    const saveButton = screen.getByText(/сохранить/i);
    fireEvent.click(saveButton);

    expect(InterviewResultsService.updateInterviewResult).toHaveBeenCalledWith('1', expect.objectContaining({
      hr_decision: 'accepted',
      status: 'accepted'
    }));
  });

  it('должен сгенерировать PDF отчет', async () => {
    renderInterviewResults();

    await waitFor(() => {
      expect(screen.getByText(/экспорт в pdf/i)).toBeInTheDocument();
    });

    const exportButton = screen.getByText(/экспорт в pdf/i);
    fireEvent.click(exportButton);

    expect(PDFService.generateInterviewReport).toHaveBeenCalledWith(mockInterviewResult, mockCandidate);
  });

  it('должен отобразить сообщение об ошибке при неудачной загрузке', async () => {
    (InterviewResultsService.getInterviewResult as jest.Mock).mockRejectedValue(new Error('Failed to load'));

    renderInterviewResults();

    await waitFor(() => {
      expect(screen.getByText('Ошибка загрузки данных')).toBeInTheDocument();
    });
  });
}); 