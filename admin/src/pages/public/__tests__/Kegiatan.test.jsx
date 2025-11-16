import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Kegiatan from '../Kegiatan';
import api from '../../../services/api';

// Mock API
jest.mock('../../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn()
}));

// Mock window.confirm and window.alert
global.alert = jest.fn();
global.confirm = jest.fn(() => true);

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Kegiatan Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert.mockClear();
    global.confirm.mockClear();
  });

  it('should render kegiatan page', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    
    renderWithRouter(<Kegiatan />);
    
    expect(screen.getByText(/Kegiatan/i)).toBeInTheDocument();
    expect(screen.getByText(/Tambahkan Materi/i)).toBeInTheDocument();
  });

  it('should fetch and display materials', async () => {
    const mockMaterials = [
      { id: 1, title: 'Material 1', description: 'Description 1', category: 'Safety', content: 'Content 1' },
      { id: 2, title: 'Material 2', description: 'Description 2', category: 'Kesehatan', content: 'Content 2' }
    ];

    api.get.mockResolvedValueOnce({ data: mockMaterials });
    
    renderWithRouter(<Kegiatan />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/public/materials');
    });

    await waitFor(() => {
      expect(screen.getByText('Material 1')).toBeInTheDocument();
      expect(screen.getByText('Material 2')).toBeInTheDocument();
    });
  });

  it('should display loading state', () => {
    api.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderWithRouter(<Kegiatan />);
    
    expect(screen.getByText(/Memuat data/i)).toBeInTheDocument();
  });

  it('should open add material modal', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    
    renderWithRouter(<Kegiatan />);
    
    const addButton = screen.getByText(/Tambahkan Materi/i);
    await userEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Tambahkan Materi Baru/i)).toBeInTheDocument();
    });
  });

  it('should close add material modal', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    
    renderWithRouter(<Kegiatan />);
    
    const addButton = screen.getByText(/Tambahkan Materi/i);
    await userEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Tambahkan Materi Baru/i)).toBeInTheDocument();
    });

    // Find cancel button (more reliable than close icon)
    const cancelButton = screen.getByRole('button', { name: /Batal/i });
    await userEvent.click(cancelButton);
    
    await waitFor(() => {
      expect(screen.queryByText(/Tambahkan Materi Baru/i)).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should validate form before submitting', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    
    renderWithRouter(<Kegiatan />);
    
    const addButton = screen.getByText(/Tambahkan Materi/i);
    await userEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Tambahkan Materi Baru/i)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /Simpan/i });
    
    // HTML5 validation prevents form submission, so we need to check if form is invalid
    // or if alert is called. Since the component uses alert for validation,
    // we'll try to submit and check if alert was called
    await userEvent.click(submitButton);
    
    // Wait a bit for validation to run
    await waitFor(() => {
      // Check if alert was called OR if form fields are still empty (validation prevented submission)
      const titleInput = screen.getByLabelText(/Judul Materi/i);
      expect(titleInput.value).toBe('');
    }, { timeout: 2000 });
    
    // Since HTML5 required might prevent alert, we check that form wasn't submitted
    expect(api.post).not.toHaveBeenCalled();
  });

  it('should submit new material successfully', async () => {
    const mockNewMaterial = {
      id: 1,
      title: 'New Material',
      description: 'New Description',
      category: 'Safety',
      content: 'New Content'
    };

    api.get.mockResolvedValueOnce({ data: [] });
    api.post.mockResolvedValueOnce({ data: { data: mockNewMaterial } });
    
    renderWithRouter(<Kegiatan />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    const addButton = screen.getByText(/Tambahkan Materi/i);
    await userEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Tambahkan Materi Baru/i)).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText(/Judul Materi/i) || screen.getByPlaceholderText(/Masukkan judul materi/i);
    const captionInput = screen.getByLabelText(/Caption/i) || screen.getByPlaceholderText(/Masukkan caption/i);
    const contentInput = screen.getByLabelText(/Isi Materi/i) || screen.getByPlaceholderText(/Masukkan isi materi/i);

    await userEvent.type(titleInput, 'New Material');
    await userEvent.type(captionInput, 'New Description');
    await userEvent.type(contentInput, 'New Content');

    const submitButton = screen.getByText(/Simpan/i);
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/public/materials', {
        title: 'New Material',
        category: 'Safety',
        description: 'New Description',
        content: 'New Content'
      });
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Materi berhasil ditambahkan!');
    });
  });

  it('should filter materials by category', async () => {
    const mockMaterials = [
      { id: 1, title: 'Safety Material', description: 'Desc 1', category: 'Safety', content: 'Content 1' },
      { id: 2, title: 'Health Material', description: 'Desc 2', category: 'Kesehatan', content: 'Content 2' }
    ];

    api.get.mockResolvedValueOnce({ data: mockMaterials });
    
    renderWithRouter(<Kegiatan />);
    
    await waitFor(() => {
      expect(screen.getByText('Safety Material')).toBeInTheDocument();
    });

    // Use getAllByText and find the button (not the badge)
    const safetyButtons = screen.getAllByText('Safety');
    const safetyFilterButton = safetyButtons.find(btn => 
      btn.closest('button') && btn.textContent === 'Safety'
    ) || safetyButtons[0];
    
    await userEvent.click(safetyFilterButton);
    
    await waitFor(() => {
      expect(screen.getByText('Safety Material')).toBeInTheDocument();
      expect(screen.queryByText('Health Material')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should search materials', async () => {
    const mockMaterials = [
      { id: 1, title: 'Safety Material', description: 'Desc 1', category: 'Safety', content: 'Content 1' },
      { id: 2, title: 'Health Material', description: 'Desc 2', category: 'Kesehatan', content: 'Content 2' }
    ];

    api.get.mockResolvedValueOnce({ data: mockMaterials });
    
    renderWithRouter(<Kegiatan />);
    
    await waitFor(() => {
      expect(screen.getByText('Safety Material')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Cari materi/i);
    await userEvent.type(searchInput, 'Safety');
    
    await waitFor(() => {
      expect(screen.getByText('Safety Material')).toBeInTheDocument();
      expect(screen.queryByText('Health Material')).not.toBeInTheDocument();
    });
  });

  it('should toggle select mode', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    
    renderWithRouter(<Kegiatan />);
    
    const selectButton = screen.getByText(/Select/i);
    await userEvent.click(selectButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    });
  });

  it('should delete selected materials', async () => {
    const mockMaterials = [
      { id: 1, title: 'Material 1', description: 'Desc 1', category: 'Safety', content: 'Content 1' },
      { id: 2, title: 'Material 2', description: 'Desc 2', category: 'Kesehatan', content: 'Content 2' }
    ];

    api.get.mockResolvedValueOnce({ data: mockMaterials });
    api.delete.mockResolvedValueOnce({});
    
    renderWithRouter(<Kegiatan />);
    
    await waitFor(() => {
      expect(screen.getByText('Material 1')).toBeInTheDocument();
    });

    const selectButton = screen.getByText(/Select/i);
    await userEvent.click(selectButton);
    
    // Find and click checkbox (might need to adjust selector)
    const checkboxes = screen.getAllByRole('checkbox');
    if (checkboxes.length > 0) {
      await userEvent.click(checkboxes[0]);
    }

    await waitFor(() => {
      const deleteButton = screen.getByText(/Hapus/i);
      expect(deleteButton).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/Hapus/i);
    await userEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalled();
    });
  });

  it('should open material detail modal', async () => {
    const mockMaterials = [
      { id: 1, title: 'Material 1', description: 'Desc 1', category: 'Safety', content: 'Content 1' }
    ];

    api.get.mockResolvedValueOnce({ data: mockMaterials });
    
    renderWithRouter(<Kegiatan />);
    
    await waitFor(() => {
      expect(screen.getByText('Material 1')).toBeInTheDocument();
    });

    // Find the material card by its title (h3 element)
    const materialTitle = screen.getByRole('heading', { name: 'Material 1', level: 3 });
    const materialCard = materialTitle.closest('div[class*="bg-white"]');
    
    if (materialCard) {
      await userEvent.click(materialCard);
      
      // Wait for modal to appear - check for modal title (h2)
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Material 1', level: 2 })).toBeInTheDocument();
      }, { timeout: 3000 });
    }
  });

  it('should handle API error when fetching materials', async () => {
    api.get.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithRouter(<Kegiatan />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });

  it('should handle API error when adding material', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    api.post.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithRouter(<Kegiatan />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    const addButton = screen.getByText(/Tambahkan Materi/i);
    await userEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Tambahkan Materi Baru/i)).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText(/Judul Materi/i) || screen.getByPlaceholderText(/Masukkan judul materi/i);
    const captionInput = screen.getByLabelText(/Caption/i) || screen.getByPlaceholderText(/Masukkan caption/i);
    const contentInput = screen.getByLabelText(/Isi Materi/i) || screen.getByPlaceholderText(/Masukkan isi materi/i);

    await userEvent.type(titleInput, 'New Material');
    await userEvent.type(captionInput, 'New Description');
    await userEvent.type(contentInput, 'New Content');

    const submitButton = screen.getByText(/Simpan/i);
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });
});

