
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Writeups from './Writeups';
import { WriteupViewer } from './WriteupViewer';

// Mock the WriteupViewer component to inspect props
jest.mock('./WriteupViewer', () => ({
  WriteupViewer: jest.fn(({ writeup, onClose }) => (
    <div data-testid="writeup-viewer">
      <h1>{writeup.title}</h1>
      <button onClick={onClose}>Close</button>
    </div>
  )),
}));

// Mock animations
jest.mock('@/utils/animations', () => ({
  scrollVariants: {},
  staggerContainer: {},
  getViewportSettings: () => ({}),
  transitions: { fast: {}, smooth: {} },
  easings: { easeOutQuint: 'linear' },
}));

jest.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

jest.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: () => false,
}));

const mockWriteups = [
  {
    id: '1',
    title: 'Writeup One',
    description: 'Desc One',
    date: '2024-01-01',
    readingTime: '5 min',
    tags: ['tag1'],
    category: 'tutorial',
    githubUrl: 'http://github.com/one',
  },
  {
    id: '2',
    title: 'Writeup Two',
    description: 'Desc Two',
    date: '2024-01-02',
    readingTime: '5 min',
    tags: ['tag2'],
    category: 'research',
    githubUrl: 'http://github.com/two',
  },
];

describe('Writeups Component', () => {
  it('passes correct writeup to viewer when different cards are clicked', async () => {
    render(<Writeups writeups={mockWriteups} />);

    // Click first writeup
    const readMoreButtons = screen.getAllByText('Read more');
    fireEvent.click(readMoreButtons[0]);

    // Check if viewer opened with first writeup
    expect(screen.getByTestId('writeup-viewer')).toBeInTheDocument();
    expect(screen.getByTestId('writeup-viewer')).toHaveTextContent('Writeup One');

    // Close viewer
    fireEvent.click(screen.getByText('Close'));
    
    // Wait for viewer to disappear (mocked implementation might not animate out, but logic sets state to null)
    // In our mock, AnimatePresence isn't fully mocked but if state is null, it should remove it? 
    // Actually AnimatePresence needs the child to be removed from React tree.
    
    // With AnimatePresence mocked or not, if selectedWriteup is null, the child expression evaluates to null.
    // However, AnimatePresence holds onto it.
    // Let's assume for this test we just want to verify state update.
    
    // Click second writeup
    fireEvent.click(readMoreButtons[1]);

    // Check if viewer opened with second writeup
    await waitFor(() => {
        expect(screen.getByTestId('writeup-viewer')).toHaveTextContent('Writeup Two');
    });
    
    // Verify the mock was called with new props
    // We can't easily check the mock calls order without getting the mock instance, 
    // but the presence of "Writeup Two" confirms it.
  });
});
