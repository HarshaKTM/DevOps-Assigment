import React from 'react';
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';

describe('StatCard Component', () => {
  const defaultProps = {
    title: 'Test Stat',
    value: '42',
    icon: <div data-testid="mock-icon" />,
    color: 'primary',
  };

  test('renders the component with all props', () => {
    render(<StatCard {...defaultProps} />);
    
    // Check that the title is rendered
    expect(screen.getByText('Test Stat')).toBeInTheDocument();
    
    // Check that the value is rendered
    expect(screen.getByText('42')).toBeInTheDocument();
    
    // Check that the icon is rendered
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  test('renders the component with subtitle if provided', () => {
    const propsWithSubtitle = {
      ...defaultProps,
      subtitle: 'Subtitle Text',
    };
    render(<StatCard {...propsWithSubtitle} />);
    
    // Check that the subtitle is rendered
    expect(screen.getByText('Subtitle Text')).toBeInTheDocument();
  });

  test('renders the component with comparison if provided', () => {
    const propsWithComparison = {
      ...defaultProps,
      comparison: {
        type: 'increase' as const,
        value: '10%',
      },
    };
    render(<StatCard {...propsWithComparison} />);
    
    // Check that the comparison text is rendered
    expect(screen.getByText('10%')).toBeInTheDocument();
  });

  test('renders without optional props', () => {
    render(<StatCard {...defaultProps} />);
    
    // Check that the title and value are still rendered
    expect(screen.getByText('Test Stat')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    
    // Check that the icon is rendered (since it's required)
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });
}); 