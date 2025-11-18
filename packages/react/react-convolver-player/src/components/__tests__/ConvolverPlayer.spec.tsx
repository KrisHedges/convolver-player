import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ConvolverPlayer from '../ConvolverPlayer';

describe('ConvolverPlayer', () => {
  it('renders without crashing', () => {
    render(<ConvolverPlayer />);
    expect(screen.getByTestId('convolver-player')).toBeInTheDocument();
  });
});
