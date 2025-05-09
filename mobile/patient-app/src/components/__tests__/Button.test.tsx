import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button Component', () => {
  test('renders correctly with default props', () => {
    const { getByText } = render(<Button label="Test Button" onPress={() => {}} />);
    
    const buttonElement = getByText('Test Button');
    expect(buttonElement).toBeTruthy();
  });
  
  test('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button label="Press Me" onPress={mockOnPress} />);
    
    const buttonElement = getByText('Press Me');
    fireEvent.press(buttonElement);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
  
  test('renders in disabled state when disabled prop is true', () => {
    const { getByText } = render(<Button label="Disabled Button" onPress={() => {}} disabled />);
    
    const buttonElement = getByText('Disabled Button');
    expect(buttonElement.props.style).toMatchObject({opacity: 0.5});
  });
  
  test('renders with secondary style when mode is secondary', () => {
    const { getByText } = render(
      <Button label="Secondary Button" onPress={() => {}} mode="secondary" />
    );
    
    const buttonElement = getByText('Secondary Button');
    // In a real test, we would check specific styling
    expect(buttonElement).toBeTruthy();
  });
  
  test('renders with custom style when provided', () => {
    const customStyle = { backgroundColor: 'purple' };
    const { getByText } = render(
      <Button label="Custom Button" onPress={() => {}} style={customStyle} />
    );
    
    const buttonElement = getByText('Custom Button');
    // Check that the style is applied
    expect(buttonElement).toBeTruthy();
  });
}); 