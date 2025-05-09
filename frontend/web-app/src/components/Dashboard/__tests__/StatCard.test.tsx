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
    render(<StatCard {...defaultProps} subtitle="Subtitle Text" />);
    
    // Check that the subtitle is rendered
    expect(screen.getByText('Subtitle Text')).toBeInTheDocument();
  });

  test('renders the component with comparison if provided', () => {
    render(<StatCard {...defaultProps} comparison={{ type: 'increase', value: '10%' }} />);
    
    // Check that the comparison text is rendered
    expect(screen.getByText('10%')).toBeInTheDocument();
  });

  test('renders without an icon if not provided', () => {
    const { icon, ...propsWithoutIcon } = defaultProps;
    render(<StatCard {...propsWithoutIcon} />);
    
    // Check that the title and value are still rendered
    expect(screen.getByText('Test Stat')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    
    // Check that the icon is not rendered
    expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
  });
}); 